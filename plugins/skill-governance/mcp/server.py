#!/usr/bin/env python3
"""Small stdio MCP adapter around skillctl.py, with no third-party dependencies."""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CLI = ROOT / "scripts" / "skillctl.py"
DB = Path(os.environ.get("SKILL_GOVERNANCE_DB", "~/.local/state/skill-governance/registry.json")).expanduser()


def filters():
    return {"type": "object", "properties": {"group": {"type": "string"}, "plugin": {"type": "string"}}}


def inventory_schema(with_filters=False):
    properties = {
        "roots": {"type": "array", "items": {"type": "string"}},
        "user_roots": {"type": "array", "items": {"type": "string"}},
    }
    if with_filters:
        properties.update(filters()["properties"])
    return {"type": "object", "properties": properties, "required": ["roots"]}


def skill_id_schema():
    return {"type": "object", "properties": {"skill_id": {"type": "string"}}, "required": ["skill_id"]}


TOOLS = [
    {"name": "skill_scan", "description": "Discover SKILL.md files under one or more accessible roots.",
     "inputSchema": {"type": "object", "properties": {"roots": {"type": "array", "items": {"type": "string"}}, "user_roots": {"type": "array", "items": {"type": "string"}}}, "required": ["roots"]}},
    {"name": "skill_list", "description": "List known skills with per-skill status, group, and source path.",
     "inputSchema": inventory_schema(True)},
    {"name": "plugin_list", "description": "List discovered plugins and their native/Codex/Claude config formats.",
     "inputSchema": inventory_schema()},
    {"name": "plugin_count", "description": "Count discovered plugins.",
     "inputSchema": inventory_schema()},
    {"name": "skill_count", "description": "Count known skills, optionally by group or plugin.",
     "inputSchema": inventory_schema(True)},
    {"name": "skill_stats", "description": "Report observed match, context-load, invocation, success, and failure counts.",
     "inputSchema": inventory_schema(True)},
    {"name": "skill_set_status", "description": "Enable or disable one skill without disabling its plugin.",
     "inputSchema": {"type": "object", "properties": {"skill_id": {"type": "string"}, "status": {"enum": ["enabled", "disabled"]}, "reason": {"type": "string"}}, "required": ["skill_id", "status"]}},
    {"name": "skill_check", "description": "Evaluate the load gate for one governed skill.",
     "inputSchema": skill_id_schema()},
    {"name": "skill_record", "description": "Record an observed lifecycle event for a skill.",
     "inputSchema": {"type": "object", "properties": {"skill_id": {"type": "string"}, "stage": {"enum": ["matched", "context_loaded", "invoked", "succeeded", "failed"]}, "host": {"type": "string"}, "thread": {"type": "string"}, "task": {"type": "string"}, "reason": {"type": "string"}, "count": {"type": "integer", "minimum": 0, "maximum": 1}}, "required": ["skill_id", "stage"]}},
    {"name": "skill_failures", "description": "List recorded skill failures and exact recorded reasons.",
     "inputSchema": {"type": "object", "properties": {}}},
    {"name": "skill_overlaps", "description": "Find likely overlapping skills by description similarity.",
     "inputSchema": {"type": "object", "properties": {"group": {"type": "string"}, "plugin": {"type": "string"}, "threshold": {"type": "number", "minimum": 0, "maximum": 1}}}},
    {"name": "skill_improve", "description": "Generate a safe improvement proposal for a user-owned skill based on an unmatched task and failures.",
     "inputSchema": {"type": "object", "properties": {"skill_id": {"type": "string"}, "task": {"type": "string"}}, "required": ["skill_id", "task"]}},
]


def invoke(name, args):
    mapping = {
        "skill_scan": ["scan", *args.get("roots", [])], "skill_list": ["list"],
        "plugin_list": ["plugins"], "plugin_count": ["count-plugins"],
        "skill_count": ["count"], "skill_stats": ["stats"], "skill_check": ["check", args.get("skill_id", "")],
        "skill_failures": ["failures"], "skill_overlaps": ["overlaps"],
        "skill_improve": ["improve", args.get("skill_id", ""), "--task", args.get("task", "")],
        "skill_record": ["record", args.get("skill_id", ""), args.get("stage", "")],
        "skill_set_status": [args.get("status", ""), args.get("skill_id", "")],
    }
    if name not in mapping:
        raise ValueError(f"unknown tool: {name}")
    cmd = [sys.executable, str(CLI), "--db", str(DB), *mapping[name]]
    if name == "skill_scan":
        for user_root in args.get("user_roots", []):
            cmd.extend(["--user-root", str(user_root)])
    elif name in {"skill_list", "plugin_list", "plugin_count", "skill_count", "skill_stats"}:
        for root in args.get("roots", []):
            cmd.extend(["--root", str(root)])
        for user_root in args.get("user_roots", []):
            cmd.extend(["--user-root", str(user_root)])
    for key in ("group", "plugin", "reason", "host", "thread", "task"):
        if key in args and args[key] and not (name == "skill_improve" and key == "task"):
            cmd.extend(["--" + key, str(args[key])])
    if name == "skill_overlaps" and "threshold" in args:
        cmd.extend(["--threshold", str(args["threshold"])])
    if name == "skill_record" and "count" in args:
        cmd.extend(["--count", str(args["count"])])
    result = subprocess.run(cmd, text=True, capture_output=True, timeout=120)
    if result.returncode not in (0, 3):
        raise RuntimeError((result.stderr or result.stdout).strip())
    return result.stdout.strip()


def response(request):
    method = request.get("method")
    if method == "initialize":
        result = {"protocolVersion": "2025-06-18", "capabilities": {"tools": {"listChanged": False}}, "serverInfo": {"name": "skill-governance", "version": "0.1.0"}}
    elif method == "tools/list":
        result = {"tools": TOOLS}
    elif method == "tools/call":
        params = request.get("params", {})
        try:
            result = {"content": [{"type": "text", "text": invoke(params.get("name", ""), params.get("arguments", {}))}], "isError": False}
        except Exception as exc:
            result = {"content": [{"type": "text", "text": str(exc)}], "isError": True}
    elif method and method.startswith("notifications/"):
        return None
    else:
        return {"jsonrpc": "2.0", "id": request.get("id"), "error": {"code": -32601, "message": "Method not found"}}
    return {"jsonrpc": "2.0", "id": request.get("id"), "result": result}


def read_message():
    line = sys.stdin.buffer.readline()
    if not line:
        return None
    try:
        return json.loads(line)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {"_parse_error": True}


def write_message(payload):
    body = (json.dumps(payload, ensure_ascii=False) + "\n").encode()
    sys.stdout.buffer.write(body)
    sys.stdout.buffer.flush()


def main():
    while True:
        request = read_message()
        if request is None:
            break
        if request.get("_parse_error"):
            write_message({"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": "Parse error"}})
            continue
        answer = response(request)
        if answer is not None and "id" in request:
            write_message(answer)


if __name__ == "__main__":
    main()
