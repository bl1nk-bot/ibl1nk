# Skill Governance

One registry and policy model for local skills and imported catalog snapshots. It answers inventory,
group counts, per-skill status, observed load/invocation counts, and recorded failure reasons. It can
disable one skill without disabling its containing plugin when the host integrates the `check` gate.

## Honest boundary

This plugin cannot force proprietary GPT Work or Codex hosts to expose telemetry they do not expose.
It distinguishes `unknown` and `unobservable` from zero. Full automatic enforcement and usage
tracking require each host to call the CLI gate and lifecycle recorder, or expose an equivalent MCP/API
adapter. Improvement is proposal-first and limited to user-owned writable skills.

## Host adapters

- Codex loads `.codex-plugin/plugin.json`, which registers the stdio server through `.mcp.json`.
- The ibl1nk app loads `opencode.json`, using the OpenCode V2 `mcp.servers` local-server shape.
- The MCP process uses the agent host's existing session. It has no model-provider API-key setting.


## Quick test

```bash
python3 scripts/skillctl.py --db /tmp/skill-governance.json scan ../../skills ./skills
python3 scripts/skillctl.py --db /tmp/skill-governance.json list
python3 scripts/skillctl.py --db /tmp/skill-governance.json stats
```
