# Taskboard — ibl1nk

**Branch:** `learn-09-04-2026` | **Last Commit:** `509b87b` | **Updated:** 2026-04-10 (synced with team-plan + team-prd)
**Intent:** `Stabilize OmG workspace and clear taskboard` | **Workflow:** team-plan ✅ → team-prd ✅ → taskboard sync ✅ → team-exec ⏳

---

## Board

### Phase 0: Completed (Baseline)

| Task ID | Priority | Status | Owner | Dependency | Worktree | Lane Health | Summary | Evidence |
|---------|----------|--------|-------|------------|----------|-------------|---------|----------|
| T001 | p2 | done | agent | - | root | clean | รวม global QWEN.md → docs/QWEN.md + README link | commit 2f3ed13 |
| T003 | p2 | done | agent | - | .omg/ | clean | สร้าง 6 learned rules + MEMORY.md + hooks.json | commit 2f3ed13 |
| T004 | p2 | done | agent | - | .omg/ | clean | สร้าง hooks.json — 6-step completion pipeline | commit 2f3ed13 |
| T005 | p2 | done | agent | T003 | docs/ | clean | เพิ่ม Hooks & JSDoc section ใน docs/QWEN.md | commit 509b87b |
| T006 | p2 | done | agent | - | external | - | อัพเดต global QWEN.md (อยู่นอก repo) | file write confirmed |
| T007 | p2 | done | agent | T001,T003,T004,T005 | root | clean | Commit ทุกอย่างบน branch learn-09-04-2026 | commit 2f3ed13 |
| T009 | p2 | done | agent | - | docs/ | clean | สร้าง docs/work-log.csv — emoji status tracking | commit 509b87b |
| T010 | p2 | done | agent | T009 | docs/ | clean | เพิ่ม work-log CSV workflow section ใน docs/QWEN.md | commit 509b87b |
| T011 | p2 | done | agent | T006 | external | - | อัพเดต global QWEN.md รอบ 2 | file write confirmed |

### Phase 1: State & Config Stabilization

| Task ID | Priority | Status | Owner | Dependency | Worktree | Lane Health | Summary | Evidence |
|---------|----------|--------|-------|------------|----------|-------------|---------|----------|
| T012a | p0 | **todo** | agent | - | `.omg/state/` | dirty | สร้าง `.omg/state/workspace.json` — valid JSON, 6 lanes, collision_risks, cross_lane_policy | AC1: `jq` validates |
| T012b | p0 | **todo** | agent | T012a | `.omg/state/` | dirty | Track + commit `.omg/state/taskboard.md` → git | AC2: `git status` clean |
| T013a | p1 | **todo** | agent | - | `.omg/rules/` | clean → dirty (add) | สร้าง `.omg/rules/learn.json` — index all 8 learned rules (6 committed + 2 untracked) | AC3: `jq` validates, 8 entries |
| T014a | p2 | **todo** | agent | T012a | `.omg/state/memory/` | dirty | ลบ `.omg/state/memory/` (ว่างเปล่า/ซ้ำซ้อน) หรือ sync จาก `.omg/MEMORY.md` SSoT | AC4: dir removed OR `diff` clean |

### Phase 2: Lane Cleanup

| Task ID | Priority | Status | Owner | Dependency | Worktree | Lane Health | Summary | Evidence |
|---------|----------|--------|-------|------------|----------|-------------|---------|----------|
| T008a | p1 | **todo** | agent | - | root | needs-fix | เพิ่ม `qwen-code-export-*.md` ไปยัง `.gitignore` | AC5: `git status` ไม่แสดง files |
| T008b | p1 | **todo** | agent | T008a | root | needs-fix | ลบ/commit untracked learned rules (`file-deletion-authority.md`, `research-must-document.md`) → `.omg/rules/learned/` | AC5: `git status` clean |
| T015a | p2 | **todo** | agent | T013a | `.omg/` | dirty (refactor) | เพิ่ม `timeout_ms` ให้ hooks.json lanes ที่ขาด — validate ก่อน commit | AC6: `jq` shows all lanes have timeout |

### Phase 3: Plugin SDK Resolution

| Task ID | Priority | Status | Owner | Dependency | Worktree | Lane Health | Summary | Evidence |
|---------|----------|--------|-------|------------|----------|-------------|---------|----------|
| T002-decision | p1 | **blocked** | **user** | - | `packages/plugin-sdk/` | untrusted | **รอ user ตัดสินใจ:** ลบ `packages/plugin-sdk/` หรือสร้าง `src/`? | Decision recorded |
| T002a | p1 | **todo** | agent | T002-decision | isolated | untrusted → removed | (ถ้าลบ) ลบ `packages/plugin-sdk/` + `tests/pluginsdk/` duplication | AC7: `ls` fails, collision_risks cleared |
| T002b | p1 | **todo** | agent | T002-decision | isolated | untrusted → clean | (ถ้าสร้าง src) สร้าง `packages/plugin-sdk/src/` — re-export จาก `server/_core/pluginsdk/` | AC7: package builds, tests pass |

### Phase 4: Verification & Handoff

| Task ID | Priority | Status | Owner | Dependency | Worktree | Lane Health | Summary | Evidence |
|---------|----------|--------|-------|------------|----------|-------------|---------|----------|
| V001 | p0 | **todo** | agent | T012a, T012b, T013a, T014a | `.omg/state/`, `.omg/rules/` | dirty → clean | Verify Phase 1: state anchors loaded, JSON valid, all AC1-AC4 pass | AC pass report |
| V002 | p1 | **todo** | agent | T008a, T008b, T015a | root, `.omg/` | dirty → clean | Verify Phase 2: all lanes clean, git status ≤2 modified, AC5-AC6 pass | AC pass report |
| V003 | p1 | **todo** | agent | T002a or T002b | `packages/` | untrusted → clean | Verify Phase 3: Plugin SDK resolved, collision_risks empty, AC7 pass | AC pass report |
| H001 | p2 | **todo** | agent | V001, V002, V003 | `.omg/state/` | clean | Final handoff: taskboard shows 0 pending/blocked, all committed, workspace.json clean | AC8-AC10 pass |

---

## Board Summary

| Status | Count | IDs |
|--------|-------|-----|
| ✅ done | 9 | T001, T003-T007, T009-T011 |
| 📋 todo | 12 | T012a, T012b, T013a, T014a, T008a, T008b, T015a, T002a, T002b, V001-V003, H001 |
| 🚫 blocked | 1 | T002-decision (รอ user) |
| 🔍 verify | 4 | V001, V002, V003, H001 (pending execution) |

**By Phase:**
| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 0 (Baseline) | 9 | ✅ done |
| Phase 1 (State) | 4 | 📋 todo |
| Phase 2 (Cleanup) | 3 | 📋 todo |
| Phase 3 (Plugin SDK) | 3 | 🚫 blocked (user decision) |
| Phase 4 (Verify) | 4 | 🔍 pending |

---

## Priority Queue (Dependency-Ready, Lane-Safe First)

| Priority | Task ID | Summary | Lane Health | Path Type |
|----------|---------|---------|-------------|-----------|
| **p0** | T012a | สร้าง workspace.json | dirty (trusted) | critical-path |
| **p0** | T012b | Track + commit taskboard.md | dirty (trusted) | critical-path |
| **p0** | V001 | Verify Phase 1 | dirty → clean target | critical-path |
| **p1** | T013a | สร้าง learn.json | clean → dirty (add) | critical-path |
| **p1** | T008a | เพิ่ม gitignore pattern | needs-fix (trusted) | critical-path |
| **p1** | T008b | ลบ/commit untracked learned rules | needs-fix (trusted) | sequential |
| **p1** | T002a/b | Plugin SDK resolution | untrusted → clean/resolved | critical-path (blocked) |
| **p1** | V002 | Verify Phase 2 | dirty → clean target | critical-path |
| **p1** | V003 | Verify Phase 3 | untrusted → clean target | critical-path |
| **p2** | T014a | ลบ/sync MEMORY.md ซ้ำซ้อน | dirty (trusted) | sidecar-parallelizable |
| **p2** | T015a | เพิ่ม lane metadata hooks.json | dirty (refactor) | sidecar-parallelizable |
| **p2** | H001 | Final handoff + commit all | clean target | critical-path |

---

## Ready Tasks (No Dependencies, Lane-Safe)

| Task ID | Priority | Summary | Lane Health | AC |
|---------|----------|---------|-------------|----|
| T012a | p0 | สร้าง workspace.json | dirty (trusted) | AC1 |
| T013a | p1 | สร้าง learn.json | clean (trusted) | AC3 |
| T008a | p1 | เพิ่ม gitignore pattern | needs-fix (trusted) | AC5 |
| T014a | p2 | ลบ/sync MEMORY.md | dirty (trusted) | AC4 |

---

## Blocked Tasks

| Task ID | Blocking Reason | Resolution |
|---------|-----------------|------------|
| T002-decision | รอ user ตัดสินใจ: ลบ `packages/plugin-sdk/` หรือสร้าง `src/`? | User ต้องตอบตัวเลือก A/B/C |
| T002a | Depends on T002-decision | รอ user เลือก "ลบ" |
| T002b | Depends on T002-decision | รอ user เลือก "สร้าง src" |
| V003 | Depends on T002a or T002b | รอ Phase 3 เสร็จ |

---

## Verification Queue

| Task ID | Status | Evidence Pointer | AC |
|---------|--------|------------------|----|
| V001 | pending | T012a, T012b, T013a, T014a completion | AC1-AC4 |
| V002 | pending | T008a, T008b, T015a completion | AC5-AC6, AC8-AC9 |
| V003 | pending | T002a or T002b completion | AC7 |
| H001 | pending | V001, V002, V003 all pass | AC8-AC10 |

---

## Lane Health Notes

| Lane | Status | Issue | Target |
|------|--------|-------|--------|
| `.omg/state/` | 🟡 **dirty** | ไม่มี workspace.json, taskboard.md untracked | T012a, T012b → clean |
| `.omg/rules/` | 🟢 **clean** | ไม่มี learn.json index | T013a → clean (add) |
| `packages/plugin-sdk/` | 🔴 **untrusted** | Tests ซ้ำ, ไม่มี src — collision risk HIGH | T002-decision → removed หรือ clean |
| `server/_core/pluginsdk/` | 🟢 **clean** | 7 files — source of truth | Read-only, no changes |
| `tests/pluginsdk/` | 🟡 **needs-review** | Duplicate of server tests | T002a → removed (if delete path) |
| `root` (.gitignore) | 🟡 **needs-fix** | 2 untracked learned rules | T008a, T008b → clean |
| `.omg/` (hooks.json) | 🟡 **dirty (refactor)** | 311 lines changed — not validated | T015a → validate + commit |
| `docs/` | 🟢 **clean** | Committed, no issues | Read-only, no changes |

---

## Next Command

**พร้อมเริ่ม Phase 1:**

```
/omg:team-exec --intent="Stabilize OmG workspace and clear taskboard"
```

**ลำดับ execution:**
1. **T012a** (p0) → สร้าง workspace.json
2. **T012b** (p0) → Commit taskboard.md
3. **T013a** (p1) → สร้าง learn.json
4. **T008a** (p1) → เพิ่ม gitignore
5. **T008b** (p1) → ลบ/commit untracked files
6. **T014a** (p2) → ลบ MEMORY.md ซ้ำซ้อน (sidecar — ทำคู่กับ T013a ได้)
7. **T015a** (p2) → เพิ่ม lane metadata hooks.json

**⚠️ Blocker:** ตอบตัวเลือก **T002** ก่อนเริ่ม Phase 3:
- **A:** ลบ `packages/plugin-sdk/` + `tests/pluginsdk/` (แนะนำ)
- **B:** สร้าง `packages/plugin-sdk/src/` — re-export จาก `server/_core/`
- **C:** เก็บไว้ก่อน — mark `won't-fix`
