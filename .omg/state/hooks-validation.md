# OmG Hook Validation Report

**Date**: 2026-04-08
**Project**: ibl1nk
**Hooks Scanned**: 2 files (pickle-rick-extension, story-studio)

---

## Validation Result

- **overall**: fail
- **profile**: `default` (no custom profile detected)
- **lifecycle**: mixed — Pickle Rick: symmetrical ✅ | Story Studio: post-only ⚠️
- **critical**: 0
- **major**: 3
- **minor**: 4

---

## Findings

| Severity | Finding | Evidence | Fix |
| --- | --- | --- | --- |
| **major** | Missing timeout budgets per lane | Neither `hooks.json` specifies timeout or debounce configs. Long-running hooks (e.g., `dispatch_hook.py`) could block agent execution indefinitely. | Add `"timeout": 30` and `"debounce": 5` to each hook entry. |
| **major** | No team-safety policy | Side-effect hooks (`increment-iteration`, `pickle-rick-loop`) have no `requiresConfirmation` or `workerSession` guards. Could execute in delegated sessions without user context. | Add `"requiresConfirmation": true` for state-mutating hooks; add `"disabledInWorkerSessions": true` where appropriate. |
| **major** | No explicit lane (P0/P1/P2) mappings | Hooks are not tagged with priority lanes. BeforeAgent hooks should be P0, PostToolUse notifications should be P2. | Add `"lane": "P0"` or `"lane": "P1/P2"` to each hook entry. |
| **minor** | Missing idempotency keys | `increment-iteration` and `check-limit` fire on every agent/model call with no dedup. Rapid successive calls could double-increment. | Add `"idempotencyKey": "iteration-${sessionId}"` to prevent double-fires. |
| **minor** | Story Studio lifecycle asymmetry | Only `PostToolUse` hooks defined. No `PreToolUse` for validation or rollback. Acceptable for notifications but limits future extensibility. | Add `PreToolUse` hooks if validation/rollback becomes needed. |
| **minor** | Wildcard matcher over-broad in Pickle Rick | `matcher: "*"` fires on every agent invocation. Could be narrowed to specific command patterns. | Consider `"matcher": "/pickle*"` or similar scope restriction. |
| **minor** | Inline Python in Story Studio hooks | `PostToolUse` uses inline `python3 -c "..."` which is hard to maintain and test. Should be extracted to a script file. | Extract inline code to `scripts/post-tool-check.py` and reference by path. |

---

## Hook Lifecycle Analysis

### Pickle Rick Extension — Symmetrical ✅

```
BeforeAgent (P0)
  ├── increment-iteration      [state mutation]
  └── reinforce-pickle-persona [context injection]
        ↓
Agent executes
        ↓
BeforeModel (P0)
  └── check-limit              [guard: may stop execution]
        ↓
Model responds
        ↓
AfterAgent (P0)
  └── pickle-rick-loop         [terminal: completed/blocked/stopped]
```

**Lifecycle symmetry**: Each agent-entry path has one terminal outcome via `AfterAgent`. ✅
**Cyclic chains**: None detected. Linear progression: BeforeAgent → BeforeModel → AfterAgent. ✅

### Story Studio — Post-Only ⚠️

```
PostToolUse (P2)
  └── matcher: Write|Edit → context check notification

PostToolUse:notion_sync (P2)
  └── matcher: mcp__notion → echo notification

PostToolUse:miro_update (P2)
  └── matcher: mcp__miro → echo notification
```

**Lifecycle symmetry**: No PreToolUse defined. Post-only is acceptable for notifications. ⚠️
**Cyclic chains**: None detected. Fire-and-forget notifications. ✅
**Terminal outcomes**: All hooks are informational (no terminal state management).

---

## Ordering Determinism

| Hook Set | Order Deterministic? | Idempotency Key? |
| --- | --- | --- |
| Pickle Rick BeforeAgent (2 hooks) | ✅ Yes (defined order in array) | ❌ No |
| Pickle Rick BeforeModel (1 hook) | ✅ Yes (single hook) | N/A |
| Pickle Rick AfterAgent (1 hook) | ✅ Yes (single hook) | ❌ No |
| Story Studio PostToolUse (3 events) | ✅ Yes (different matchers, no overlap) | ❌ No |

---

## Safe-to-Run Decision

- **yes**: Hooks are structurally sound with no critical issues.
- **rationale**: 
  - No cyclic trigger chains detected.
  - Lifecycle symmetry is acceptable (Pickle Rick: full; Story Studio: post-only notifications).
  - Major issues (timeouts, team-safety, lane mappings) are configuration gaps, not runtime hazards.
  - All hooks use `"type": "command"` with deterministic execution paths.
  - **Caveat**: Running without timeout guards means a stuck hook could block agent execution. Monitor first execution carefully.

---

## Next Command

- **Recommended**: Update `hooks.json` files to address major findings before production use:
  1. Add `"lane"` tags (P0 for Pickle Rick, P2 for Story Studio)
  2. Add `"timeout": 30` to all hooks
  3. Add `"requiresConfirmation": true` for state-mutating hooks
  4. Extract inline Python to script files
- **If proceeding without fixes**: Monitor execution logs for timeouts or double-fires during first run.

---

*Validation performed by OmG hook validator. Re-run after fixes to verify compliance.*
