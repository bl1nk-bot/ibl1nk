# Skill Governance Context

## Identity

- Plugin ID: `skill-governance`
- Native host: ibl1nk via `bl1nk.jsonc`
- Codex adapter: `.codex-plugin/plugin.json` and `.mcp.json`
- App adapter: `opencode.json` using OpenCode V2 local MCP format
- Purpose: apply one inventory, policy, telemetry, and diagnostic model to every discoverable skill.

## Components

- `skills/skill-governance/SKILL.md`: agent operating procedure and trigger contract.
- `scripts/skillctl.py`: portable CLI and JSON registry.
- `mcp/server.py`: Codex/ChatGPT-compatible MCP tool surface.
- `.codex-plugin/plugin.json`: Codex plugin manifest.
- `.mcp.json`: local stdio MCP registration.
- `opencode.json`: app/OpenCode-compatible local MCP registration.

## Mandatory behavior

Before answering inventory or count questions, scan every accessible root supplied by the host.
Before loading a governed skill, call `skill_check`; a disabled result blocks that individual skill,
not its containing plugin. Emit separate lifecycle events for matching, context loading, invocation,
success, and failure. Failure events always include a reason. Never infer a zero from missing host
telemetry. User-owned writable skills may receive a validated improvement proposal; external or
read-only skills remain proposal-only.

## Default roots for this repository

- `../../skills`
- `../` (built-in plugin skills)
- Optional configured user roots such as `~/.agents/skills` and `~/.codex/skills`

## State

Set `SKILL_GOVERNANCE_DB` to choose a shared registry. Agents use their existing host session;
this plugin does not request a model API key. The MCP server otherwise uses
`~/.local/state/skill-governance/registry.json`; the CLI accepts `--db` explicitly.
