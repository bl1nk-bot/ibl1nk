---
name: skill-governance
description: Inventory and govern plugins and skills across local or imported catalogs; answer counts and usage questions; enable or disable individual skills; audit context loads, invocations, and failures; detect overlaps; and propose safe improvements to user-owned skills.
---

# Skill Governance

Use this skill when the user asks what plugins or skills exist, how many belong to a group, which
ones were loaded or invoked, why an invocation failed, which capabilities overlap, or asks to
disable only one skill without disabling its plugin.

## Operating contract

1. Run `python3 scripts/skillctl.py scan <roots...>` before answering inventory questions when the
   registry may be stale. Include each accessible local skill root. Imported/cloud inventories must
   be supplied as local snapshots; never claim an inaccessible service was scanned.
2. Run `plugins`, `count-plugins`, `list`, `count`, `stats`, `failures`, or `overlaps` as appropriate and report exact output.
3. Use `disable` or `enable` for skill-level policy. This creates governance policy; hosts must call
   `check` before loading a skill for enforcement. Never claim a host enforced the policy unless it
   actually integrates that check.
4. Record only observed events with `record`. Valid stages are `matched`, `context_loaded`,
   `invoked`, `succeeded`, and `failed`. A failed event requires a reason.
5. Use `improve` to generate a proposal for a user-owned skill. Do not automatically edit a skill
   from another publisher, installed cache, or read-only source. Apply edits only after ordinary
   change authorization and validation.
6. Preserve three distinct values in answers: `0`, `unknown`, and `unobservable`. Never convert
   unavailable GPT Work/Codex telemetry into a zero.

## Common commands

```bash
python3 scripts/skillctl.py --db .skill-governance.json scan ../../skills ../ ~/.agents/skills ~/.codex/skills --user-root ../../skills
python3 scripts/skillctl.py --db .skill-governance.json list --group productivity
python3 scripts/skillctl.py --db .skill-governance.json plugins
python3 scripts/skillctl.py --db .skill-governance.json count-plugins
python3 scripts/skillctl.py --db .skill-governance.json count --group productivity
python3 scripts/skillctl.py --db .skill-governance.json stats
python3 scripts/skillctl.py --db .skill-governance.json failures
python3 scripts/skillctl.py --db .skill-governance.json disable <skill-id-from-list> --reason "overlaps canonical skill"
python3 scripts/skillctl.py --db .skill-governance.json check <skill-id-from-list>
python3 scripts/skillctl.py --db .skill-governance.json record <skill-id-from-list> failed --reason "missing dependency"
python3 scripts/skillctl.py --db .skill-governance.json overlaps
python3 scripts/skillctl.py --db .skill-governance.json improve <skill-id-from-list> --task "the unmatched task"
```

Read `references/standard.md` before integrating a new host or cloud catalog.
