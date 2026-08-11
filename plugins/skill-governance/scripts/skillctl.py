#!/usr/bin/env python3
"""Portable, dependency-free skill inventory and telemetry registry."""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import re
import sys
from contextlib import contextmanager
from pathlib import Path

try:
    import fcntl
except ImportError:  # Windows
    fcntl = None
    import msvcrt

SCHEMA = 1
STAGES = {"matched", "context_loaded", "invoked", "succeeded", "failed"}


def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()


def empty():
    return {"schema": SCHEMA, "plugins": {}, "skills": {}, "policy": {}, "events": [], "scans": []}


def load(path):
    if not path.exists():
        return empty()
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("schema") != SCHEMA:
        raise SystemExit(f"unsupported registry schema: {data.get('schema')}")
    data.setdefault("plugins", {})
    return data


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(tmp, path)


@contextmanager
def registry_lock(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    lock_path = path.with_suffix(path.suffix + ".lock")
    with lock_path.open("a+b") as lock:
        if lock.tell() == 0:
            lock.write(b"\0")
            lock.flush()
        lock.seek(0)
        if fcntl is not None:
            fcntl.flock(lock.fileno(), fcntl.LOCK_EX)
        else:
            msvcrt.locking(lock.fileno(), msvcrt.LK_LOCK, 1)
        try:
            yield
        finally:
            lock.seek(0)
            if fcntl is not None:
                fcntl.flock(lock.fileno(), fcntl.LOCK_UN)
            else:
                msvcrt.locking(lock.fileno(), msvcrt.LK_UNLCK, 1)


def frontmatter(path):
    text = path.read_text(encoding="utf-8", errors="replace")
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.S)
    out = {}
    if match:
        for line in match.group(1).splitlines():
            if ":" in line:
                key, value = line.split(":", 1)
                out[key.strip()] = value.strip().strip("'\"")
    return out


def manifest_name(directory):
    manifests = [directory / "bl1nk.jsonc", directory / ".codex-plugin" / "plugin.json", directory / ".claude-plugin" / "plugin.json"]
    for manifest in manifests:
        if not manifest.is_file():
            continue
        try:
            return json.loads(manifest.read_text()).get("name", directory.name)
        except Exception:
            return directory.name
    return None


def plugin_for(path):
    for parent in path.parents:
        identity = manifest_name(parent)
        if identity:
            return identity
        if parent.parent.name == "plugins":
            return parent.name
    return "local"


def group_for(path, meta):
    if meta.get("group"):
        return meta["group"]
    parts = [p.lower() for p in path.parts]
    if "skills" in parts:
        i = parts.index("skills")
        if i and parts[i - 1] not in {".codex", ".agents"}:
            return parts[i - 1]
    return "uncategorized"


def selected(data, args):
    rows = list(data["skills"].values())
    if getattr(args, "group", None):
        rows = [x for x in rows if x["group"].lower() == args.group.lower()]
    if getattr(args, "plugin", None):
        rows = [x for x in rows if x["plugin"].lower() == args.plugin.lower()]
    return sorted(rows, key=lambda x: x["id"])


def is_under(path, root):
    try:
        path.relative_to(root)
        return True
    except ValueError:
        return False


def cmd_scan(data, args):
    found = 0
    user_roots = [Path(x).expanduser().resolve() for x in args.user_root]
    for raw in args.roots:
        root = Path(raw).expanduser().resolve()
        if not root.exists():
            data["scans"].append({"at": now(), "root": str(root), "status": "missing"})
            continue
        discovered = set()
        candidates = [root] if root.is_dir() else []
        candidates.extend(x for x in root.rglob("*") if x.is_dir())
        discovered_plugins = set()
        for directory in candidates:
            formats = []
            if (directory / "bl1nk.jsonc").is_file(): formats.append("ibl1nk")
            if (directory / ".codex-plugin" / "plugin.json").is_file(): formats.append("codex")
            if (directory / ".claude-plugin" / "plugin.json").is_file(): formats.append("claude")
            if formats:
                plugin_id = manifest_name(directory) or directory.name
                discovered_plugins.add(plugin_id)
                previous_roots = data["plugins"].get(plugin_id, {}).get("scan_roots", [])
                scan_roots = sorted(set(previous_roots) | {str(root)})
                data["plugins"][plugin_id] = {
                    "id": plugin_id, "path": str(directory), "formats": formats,
                    "scan_roots": scan_roots,
                    "owner": "user" if any(is_under(directory.resolve(), x) for x in user_roots) else "external",
                    "writable": os.access(directory, os.W_OK), "seen_at": now()
                }
        for path in root.rglob("SKILL.md"):
            path = path.resolve()
            meta = frontmatter(path)
            name = meta.get("name", path.parent.name)
            plugin = plugin_for(path)
            source_key = str(path)
            path_hash = hashlib.sha256(source_key.encode()).hexdigest()[:12]
            skill_id = f"{plugin}:{name}@{path_hash}"
            discovered.add(skill_id)
            explicit_user = meta.get("owner", "").lower() == "user"
            trusted_user_root = any(is_under(path, user_root) for user_root in user_roots)
            data["skills"][skill_id] = {
                "id": skill_id, "name": name, "description": meta.get("description", ""),
                "group": group_for(path, meta), "plugin": plugin, "source": "local",
                "path": source_key, "source_key": source_key, "scan_root": str(root),
                "owner": "user" if explicit_user or trusted_user_root else "external",
                "writable": os.access(path, os.W_OK),
                "observability": data["skills"].get(skill_id, {}).get("observability", "unknown"),
                "seen_at": now()
            }
            found += 1
        stale = [skill_id for skill_id, item in data["skills"].items()
                 if item.get("scan_root") == str(root) and skill_id not in discovered]
        for skill_id in stale:
            del data["skills"][skill_id]
        for plugin_id, item in list(data["plugins"].items()):
            roots = set(item.get("scan_roots", []))
            if str(root) in roots and plugin_id not in discovered_plugins:
                roots.remove(str(root))
                if roots:
                    item["scan_roots"] = sorted(roots)
                else:
                    del data["plugins"][plugin_id]
        data["scans"].append({"at": now(), "root": str(root), "status": "ok"})
    if not getattr(args, "quiet", False):
        print(found)


def cmd_list(data, args):
    for item in selected(data, args):
        status = data["policy"].get(item["id"], {}).get("status", "enabled")
        print(f'{item["id"]}\t{status}\t{item["group"]}\t{item["path"]}')


def cmd_count(data, args):
    print(len(selected(data, args)))


def cmd_plugins(data, args):
    for item in sorted(data["plugins"].values(), key=lambda x: x["id"]):
        print(f'{item["id"]}\t{",".join(item["formats"])}\t{item["path"]}')


def cmd_count_plugins(data, args):
    print(len(data["plugins"]))


def cmd_policy(data, args, status):
    if args.skill_id not in data["skills"]:
        raise SystemExit(f"unknown skill: {args.skill_id}")
    data["policy"][args.skill_id] = {"status": status, "reason": args.reason, "updated_at": now()}
    print(f"{args.skill_id}\t{status}")


def cmd_check(data, args):
    if args.skill_id not in data["skills"]:
        print("unknown")
        return 2
    status = data["policy"].get(args.skill_id, {}).get("status", "enabled")
    print(status)
    return 0 if status == "enabled" else 3


def cmd_record(data, args):
    if args.skill_id not in data["skills"]:
        raise SystemExit(f"unknown skill: {args.skill_id}")
    if args.stage == "failed" and not args.reason:
        raise SystemExit("failed events require --reason")
    data["events"].append({"skill_id": args.skill_id, "timestamp": now(), "stage": args.stage,
                           "host": args.host, "thread": args.thread, "task": args.task,
                           "reason": args.reason, "count": args.count})
    data["skills"][args.skill_id]["observability"] = "observed"
    print("recorded")


def cmd_stats(data, args):
    counts = {}
    observed = set()
    for event in data["events"]:
        key = (event["skill_id"], event["stage"])
        observed.add(key)
        counts[key] = counts.get(key, 0) + event.get("count", 1)
    for item in selected(data, args):
        values = [f"{s}={counts[(item['id'], s)] if (item['id'], s) in observed else 'unknown'}"
                  for s in sorted(STAGES)]
        print(item["id"] + "\t" + "\t".join(values) + f'\tobservability={item["observability"]}')


def cmd_failures(data, args):
    for event in data["events"]:
        if event["stage"] == "failed":
            print(f'{event["timestamp"]}\t{event["skill_id"]}\t{event.get("reason") or "unspecified"}')


def tokens(text):
    return {x for x in re.findall(r"[a-z0-9ก-๙]+", text.lower()) if len(x) > 2}


def cmd_overlaps(data, args):
    rows = selected(data, args)
    for i, left in enumerate(rows):
        a = tokens(left["name"] + " " + left["description"])
        for right in rows[i + 1:]:
            b = tokens(right["name"] + " " + right["description"])
            score = len(a & b) / max(1, len(a | b))
            if score >= args.threshold:
                print(f'{score:.2f}\t{left["id"]}\t{right["id"]}')


def cmd_improve(data, args):
    item = data["skills"].get(args.skill_id)
    if not item:
        raise SystemExit(f"unknown skill: {args.skill_id}")
    missing = sorted(tokens(args.task) - tokens(item["name"] + " " + item["description"]))
    failures = [e.get("reason") for e in data["events"] if e["skill_id"] == args.skill_id and e["stage"] == "failed"]
    result = {"skill_id": args.skill_id, "editable": item["owner"] == "user" and item["writable"],
              "proposal_only": True, "missing_trigger_terms": missing[:12],
              "failure_reasons": sorted({x for x in failures if x}),
              "recommendation": "Expand the description with accurate trigger terms and add recovery steps for recurring failures; validate before applying."}
    print(json.dumps(result, ensure_ascii=False, indent=2))


def parser():
    p = argparse.ArgumentParser(prog="skillctl")
    p.add_argument("--db", type=Path, default=Path(os.environ.get("SKILL_GOVERNANCE_DB", ".skill-governance.json")).expanduser())
    sub = p.add_subparsers(dest="command", required=True)
    s = sub.add_parser("scan"); s.add_argument("roots", nargs="+"); s.add_argument("--user-root", action="append", default=[])
    for name in ("list", "count", "stats"):
        s = sub.add_parser(name); s.add_argument("--group"); s.add_argument("--plugin"); s.add_argument("--root", action="append", default=[]); s.add_argument("--user-root", action="append", default=[])
    for name in ("plugins", "count-plugins"):
        s = sub.add_parser(name); s.add_argument("--root", action="append", default=[]); s.add_argument("--user-root", action="append", default=[])
    for name in ("enable", "disable"):
        s = sub.add_parser(name); s.add_argument("skill_id"); s.add_argument("--reason", default="user policy")
    s = sub.add_parser("check"); s.add_argument("skill_id")
    s = sub.add_parser("record"); s.add_argument("skill_id"); s.add_argument("stage", choices=sorted(STAGES)); s.add_argument("--host", default="manual"); s.add_argument("--thread", default=""); s.add_argument("--task", default=""); s.add_argument("--reason", default=""); s.add_argument("--count", type=int, choices=range(0, 2), default=1)
    sub.add_parser("failures")
    s = sub.add_parser("overlaps"); s.add_argument("--group"); s.add_argument("--plugin"); s.add_argument("--threshold", type=float, default=.35)
    s = sub.add_parser("improve"); s.add_argument("skill_id"); s.add_argument("--task", required=True)
    return p


def main():
    args = parser().parse_args()
    commands = {"scan": cmd_scan, "list": cmd_list, "count": cmd_count, "plugins": cmd_plugins,
                "count-plugins": cmd_count_plugins, "stats": cmd_stats,
                "enable": lambda d, a: cmd_policy(d, a, "enabled"),
                "disable": lambda d, a: cmd_policy(d, a, "disabled"), "check": cmd_check,
                "record": cmd_record, "failures": cmd_failures, "overlaps": cmd_overlaps,
                "improve": cmd_improve}
    read_only = {"list", "count", "plugins", "count-plugins", "stats", "failures", "overlaps", "improve", "check"}
    with registry_lock(args.db):
        data = load(args.db)
        if getattr(args, "root", None):
            cmd_scan(data, argparse.Namespace(roots=args.root, user_root=args.user_root, quiet=True))
        code = commands[args.command](data, args)
        if args.command not in read_only or getattr(args, "root", None):
            save(args.db, data)
    return code or 0


if __name__ == "__main__":
    sys.exit(main())
