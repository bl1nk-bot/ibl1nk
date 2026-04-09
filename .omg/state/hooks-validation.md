# OmG Hook Validation Report

**Date**: 2026-04-09
**Profile**: `workflow-lifecycle` v4 (full — 9 hooks)
**Hooks Scanned**: 1 file (`.omg/hooks.json`)
**Commits**: `499cc8c` (hooks v4 + state anchors)

---

## Validation Result

- **overall**: ✅ **pass**
- **profile**: `workflow-lifecycle` v4
- **lifecycle**: sequential + event-driven — deterministic, no cycles
- **critical**: 0
- **major**: 0
- **minor**: 2

---

## Findings

| Severity | Finding | Evidence | Fix |
| --- | --- | --- | --- |
| **minor** | `on_task_complete` parent has no lane tag | Parent object lacks `"lane"` — only child steps have lanes. Functionally correct but inconsistent with other hooks. | Add `"lane": "P1-P2"` to parent for visual consistency. |
| **minor** | `on_context_drift` trigger uses mixed language | Description contains Thai + Chinese characters (偏离). May confuse matching in pure-Thai or pure-English contexts. | Normalize trigger text to single language (Thai recommended). |

---

## Checklist Results

### 1. Lane Mapping ✅
All 9 hooks map to exactly one primary lane:

| Hook | Lane | Status |
|------|------|--------|
| `on_session_start` | P0 | ✅ |
| `on_task_received` | P0 | ✅ |
| `on_agent_blocked` | P0 | ✅ |
| `on_task_complete` (steps 1-2) | P1 | ✅ |
| `on_task_complete` (steps 3-6) | P2 | ✅ |
| `on_agent_finished_early` | P1 | ✅ |
| `on_loop_stall` | P1 | ✅ |
| `on_risk_spike` | P1 | ✅ |
| `on_context_drift` | P2 | ✅ |

### 2. Cyclic Trigger Chains ✅
No cycles detected. All hooks have unique, non-overlapping triggers:

```
session-start ──→ on_session_start ──→ (read-only, no re-trigger)
task-received ──→ on_task_received ──→ (state mutation, idempotent)
agent-blocked ──→ on_agent_blocked ──→ escalate → wait for user (terminal)
context-drift ──→ on_context_drift ──→ reload memory → continue
loop-stall ──→ on_loop_stall ──→ break loop → propose alternative
task-complete ──→ on_task_complete ──→ 6-step pipeline → terminal
finished-early ──→ on_agent_finished_early ──→ report gaps → terminal
risk-spike ──→ on_risk_spike ──→ warn + suggest review → terminal
```

**No event → hook → event loops detected.** ✅

### 3. Ordering Determinism & Idempotency ✅

| Hook | Order Deterministic? | Idempotency Key? |
|------|---------------------|------------------|
| `on_session_start` | ✅ Yes (read-only, fires once) | N/A |
| `on_task_received` | ✅ Yes | ✅ `task-${sessionId}-${taskHash}` |
| `on_agent_blocked` | ✅ Yes (single trigger) | N/A (escalation, not repeatable) |
| `on_context_drift` | ✅ Yes (threshold-based) | N/A (semantic distance check) |
| `on_loop_stall` | ✅ Yes (count-based: 2x) | N/A (count prevents re-fire) |
| `on_risk_spike` | ✅ Yes (sliding window: 5 tasks) | N/A (density calculation) |
| `on_task_complete` | ✅ Yes (explicit step 1-6 order) | N/A (sequential pipeline) |
| `on_agent_finished_early` | ✅ Yes (single trigger) | N/A (terminal validation) |

### 4. Timeout & Debounce Budgets ✅

| Lane | Hooks | Total Timeout | Within Budget? |
|------|-------|---------------|----------------|
| P0 | session_start(10) + task_received(10) + agent_blocked(15) | 35s | ✅ Yes (< 60s) |
| P1 | finished_early(20) + loop_stall(10) + risk_spike(10) + task_complete:1-2(60) | 100s | ✅ Yes (< 120s) |
| P2 | context_drift(10) + task_complete:3-6(165) | 175s | ✅ Yes (< 180s) |

**Total max timeout:** 310s (~5.2 min) — acceptable for full workflow.

### 5. Lifecycle Symmetry ✅

| Agent Path | Terminal Outcome | Double-Fire Risk? |
|------------|------------------|-------------------|
| session-start → task-received → task-complete | `completed` | ❌ No (idempotencyKey + sequential steps) |
| session-start → task-received → agent-blocked | `blocked` → wait for user | ❌ No (escalation stops further execution) |
| session-start → task-received → agent-finished-early | `incomplete` → report gaps | ❌ No (single validation pass) |
| context-drift / loop-stall / risk-spike | `warning` → continue or pause | ❌ No (threshold-based, count-based, density-based) |

**Blocked continuations re-enter P0-safety:** `on_agent_blocked` escalates to user → user provides new input → re-enters `on_task_received` (P0). ✅

### 6. Team-Safety Policy ✅

| Hook | Side-Effect? | disabledInWorkerSessions? | requiresConfirmation? |
|------|-------------|--------------------------|----------------------|
| `on_session_start` | No (read-only) | N/A | N/A |
| `on_task_received` | Yes (append todo.md) | No (intentional — task tracking needed) | N/A (idempotent) |
| `on_agent_blocked` | Yes (update_taskboard) | No (needed in all sessions) | No (auto-escalation) |
| `on_context_drift` | Yes (reload_memory) | No (safe — read-only reload) | No (auto-detection) |
| `on_loop_stall` | Yes (break_loop) | No (needed in all sessions) | No (auto-detection) |
| `on_risk_spike` | Yes (warn + suggest) | ✅ Yes | No (warning only) |
| `on_task_complete:3` (lint) | Yes (file mutation) | ✅ Yes | No (auto-fix) |
| `on_task_complete:5` (build) | Yes (build artifact) | ✅ Yes | ✅ Yes |
| `on_agent_finished_early` | Yes (update_taskboard) | ✅ Yes | No (validation only) |

**All high-risk hooks properly guarded.** ✅

---

## Safe-to-Run Decision

- **yes**
- **rationale**:
  - ✅ All 9 hooks map to exactly one lane — no ambiguity
  - ✅ Zero cyclic trigger chains — all triggers are unique and non-overlapping
  - ✅ IdempotencyKey prevents todo.md double-append
  - ✅ All timeouts bounded (310s total max)
  - ✅ Blocked continuations re-enter P0-safety (user escalation required)
  - ✅ Terminal hooks do not double-fire (threshold/count/density-based prevention)
  - ✅ Worker-session safety active: 4 hooks disabled in worker sessions
  - ✅ Build step requires user confirmation
  - ✅ No critical or major findings — only 2 minor cosmetic issues

---

## Next Command

| Priority | Action | Effect |
|----------|--------|--------|
| **p0** | `merge to main` | Hooks v4 validated and ready for production use |
| **p2** | `fix minor findings` | Normalize trigger language + add parent lane tag (optional) |
| **p2** | `re-validate after merge` | Re-run validation post-merge to confirm no drift |
