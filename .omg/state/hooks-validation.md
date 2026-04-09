# OmG Hook Validation Report

**Date**: 2026-04-09
**Project**: ibl1nk
**Hooks Scanned**: 1 file (`.omg/hooks.json`)
**Profile**: `workflow-lifecycle` (session_start → task_received → task_complete → jsdoc_standards)

---

## Validation Result

- **overall**: fail
- **profile**: `workflow-lifecycle`
- **lifecycle**: sequential (no event-driven hooks) — ✅ deterministic
- **critical**: 0
- **major**: 3
- **minor**: 2

---

## Findings

| Severity | Finding | Evidence | Fix |
| --- | --- | --- | --- |
| **major** | Missing lane tags for all hooks | No `lane` (P0/P1/P2) defined in any hook entry. Cannot determine priority scheduling. | Add `"lane": "P0"` to `on_session_start` and `on_task_received`, `"lane": "P1"` to `on_task_complete` steps 1-2, `"lane": "P2"` to steps 3-6. |
| **major** | No timeout or debounce budgets | `on_task_complete` has 6 sequential steps with no timeout. Long-running steps (lint, test, build) could block indefinitely. | Add `"timeout": 30` to each step; add `"timeout": 10` to `on_session_start` and `on_task_received`. |
| **major** | No team-safety policy | Side-effect hooks (`update_todo`, `lint_and_fix`, `test`, `build`) have no `requiresConfirmation` or `disabledInWorkerSessions` guards. Could execute in delegated sessions without user context. | Add `"requiresConfirmation": false` for read-only steps, `"requiresConfirmation": true` for `build`; add `"disabledInWorkerSessions": true` for `lint_and_fix` and `build`. |
| **minor** | No idempotency keys | `on_task_received` appends to `todo.md` with no dedup. Rapid successive task assignments could create duplicate entries. | Add `"idempotencyKey": "task-${sessionId}-${taskHash}"` to `on_task_received`. |
| **minor** | `jsdoc_standards` is not a lifecycle hook | This entry has no event trigger — it's a coding convention, not a hook. Belongs in rules, not hooks config. | Move to `.omg/rules/jsdoc-standards.md` or remove from hooks.json. |

---

## Hook Lifecycle Analysis

```
Session Start (P0 — proposed)
  ├── read .omg/MEMORY.md    [context load]
  └── read todo.md            [task load]
        ↓
Task Received (P0 — proposed)
  └── append todo.md          [state mutation — idempotent by task content]
        ↓
Agent executes task
        ↓
Task Complete (P1/P2 — proposed)
  ├── Step 1: update_todo     [P1 — state mutation]
  ├── Step 2: verify          [P1 — validation]
  ├── Step 3: lint_and_fix    [P2 — tool execution]
  ├── Step 4: test            [P2 — tool execution]
  ├── Step 5: build           [P2 — tool execution, may block]
  └── Step 6: write_work_log  [P2 — documentation]
        ↓
Terminal outcome: completed (all 6 steps pass) or blocked (step failure)
```

**Lifecycle symmetry**: Sequential pipeline — each task triggers exactly one completion pipeline. ✅
**Cyclic chains**: None detected. Linear progression: session_start → task_received → task_complete. ✅
**Terminal outcomes**: Single terminal path. No double-fire risk. ✅

---

## Ordering Determinism

| Hook Set | Order Deterministic? | Idempotency Key? | Timeout? |
| --- | --- | --- | --- |
| `on_session_start` (2 actions) | ✅ Yes | N/A (read-only) | ❌ No |
| `on_task_received` (1 action) | ✅ Yes | ❌ No | ❌ No |
| `on_task_complete` (6 steps) | ✅ Yes (explicit step order) | ❌ No | ❌ No |
| `jsdoc_standards` (convention) | N/A | N/A | N/A |

---

## Safe-to-Run Decision

- **no** (with caveats)
- **rationale**:
  - No cyclic trigger chains detected. ✅
  - Lifecycle symmetry is correct (linear sequential pipeline). ✅
  - **Blocking issues**: Missing lane tags mean the agent cannot schedule hooks correctly under the priority system.
  - **Blocking issues**: No timeout guards on `on_task_complete` — a stuck lint/test/build step could block agent execution indefinitely.
  - **Blocking issues**: No team-safety policy — state-mutating hooks (`update_todo`, `lint_and_fix`, `build`) could run in delegated sessions without user context.
  - **Caveat**: `jsdoc_standards` is not a lifecycle hook — it's a coding convention that belongs in rules, not hooks config.

---

## Next Command

Update `.omg/hooks.json` to address major findings:

1. Add `"lane"` tags:
   - `on_session_start`: `"lane": "P0"`
   - `on_task_received`: `"lane": "P0"`
   - `on_task_complete` steps 1-2: `"lane": "P1"`
   - `on_task_complete` steps 3-6: `"lane": "P2"`

2. Add timeouts:
   - `on_session_start`: `"timeout": 10`
   - `on_task_received`: `"timeout": 10`
   - `on_task_complete` each step: `"timeout": 30`

3. Add team-safety:
   - `"requiresConfirmation": true` for `build` step
   - `"disabledInWorkerSessions": true` for `lint_and_fix` and `build`

4. Add idempotency:
   - `"idempotencyKey": "task-${sessionId}-${taskHash}"` for `on_task_received`

5. Move `jsdoc_standards` to `.omg/rules/jsdoc-standards.md` (optional cleanup)

- **Recommended**: Apply fixes 1-3 before production use.
- **If proceeding without fixes**: Monitor execution logs for timeouts or unexpected behavior during first runs.

---

*Validation performed by OmG hook validator. Re-run after fixes to verify compliance.*
