# Taskboard — ibl1nk

**Branch:** `learn-09-04-2026` | **Last Commit:** `509b87b` | **Updated:** 2026-04-09 17:15

## Board

| Task ID | Priority | Status | Owner | Dependency | Worktree | Lane Health | Summary | Evidence |
|---------|----------|--------|-------|------------|----------|-------------|---------|----------|
| T001 | p2 | done | agent | - | root | clean | รวม global QWEN.md → docs/QWEN.md + README link | commit 2f3ed13 |
| T002 | p1 | blocked | - | - | packages/ | **needs-review** | Plugin SDK structure ซ้ำ 3 ที่ (server/tests/packages) — tests ซ้ำ, package ไม่มี src | git diff HEAD, glob results |
| T003 | p2 | done | agent | - | .omg/ | clean | สร้าง 6 learned rules + MEMORY.md + hooks.json | commit 2f3ed13 |
| T004 | p2 | done | agent | - | .omg/ | clean | สร้าง hooks.json — 6-step completion pipeline | commit 2f3ed13 |
| T005 | p2 | done | agent | T003 | docs/ | clean | เพิ่ม Hooks & JSDoc section ใน docs/QWEN.md | commit 509b87b |
| T006 | p2 | done | agent | - | external | - | อัพเดต global QWEN.md (อยู่นอก repo) | file write confirmed |
| T007 | p2 | done | agent | T001,T003,T004,T005 | root | clean | Commit ทุกอย่างบน branch learn-09-04-2026 | commit 2f3ed13 |
| T008 | p1 | **ready** | - | T007 | root | **needs-fix** | qwen-code-export file ติด commit — ต้องเพิ่ม .gitignore หรือลบออก | git show 2f3ed13 --stat |
| T009 | p2 | done | agent | - | docs/ | clean | สร้าง docs/work-log.csv — emoji status tracking | commit 509b87b |
| T010 | p2 | done | agent | T009 | docs/ | clean | เพิ่ม work-log CSV workflow section ใน docs/QWEN.md | commit 509b87b |
| T011 | p2 | done | agent | T006 | external | - | อัพเดต global QWEN.md รอบ 2 | file write confirmed |
| T012 | p0 | **todo** | - | - | .omg/state/ | **dirty** | สร้าง state anchors: taskboard.md, workspace.json | cache audit findings |
| T013 | p1 | **todo** | - | - | .omg/rules/ | **dirty** | สร้าง learn.json — rule index for agent | cache audit findings |
| T014 | p2 | **todo** | - | - | .omg/state/memory/ | **dirty** | Sync หรือลบ MEMORY.md ที่ซ้ำซ้อน | cache audit findings |
| T015 | p2 | **todo** | - | - | .omg/ | **dirty** | เพิ่ม lane/timeout ให้ hooks.json | cache audit findings |

## Board Summary

| Status | Count | IDs |
|--------|-------|-----|
| ✅ done | 9 | T001, T003-T007, T009-T011 |
| 🔧 ready | 1 | T008 (needs-fix) |
| 📋 todo | 4 | T012-T015 |
| 🚫 blocked | 1 | T002 (รอคำสั่ง user) |

## Priority Queue (Dependency-Ready)

| Priority | Task ID | Summary | Lane Health |
|----------|---------|---------|-------------|
| **p0** | T012 | สร้าง state anchors (taskboard.md, workspace.json) | dirty |
| **p1** | T008 | ลบ qwen-code-export จาก commit / เพิ่ม gitignore | needs-fix |
| **p1** | T013 | สร้าง learn.json rule index | dirty |
| **p2** | T014 | Sync/ลบ MEMORY.md ซ้ำซ้อน | dirty |
| **p2** | T015 | เพิ่ม lane/timeout ให้ hooks.json | dirty |

## Ready Tasks

| Task ID | Priority | Summary | Lane Health |
|---------|----------|---------|-------------|
| T008 | p1 | Fix qwen-code-export in commit | needs-fix |
| T012 | p0 | สร้าง state anchors | dirty |
| T013 | p1 | สร้าง learn.json | dirty |

## Blocked Tasks

| Task ID | Blocking Reason |
|---------|-----------------|
| T002 | รอ user ตัดสินใจ: ลบ packages/plugin-sdk/ หรือสร้าง src/ — ยังไม่ได้รับคำสั่ง |

## Verification Queue

| Task ID | Status | Evidence Pointer |
|---------|--------|------------------|
| T001 | pending verify | commit 2f3ed13 |
| T003 | pending verify | commit 2f3ed13 |
| T005 | pending verify | commit 509b87b |
| T008 | pending fix | git show 2f3ed13 --stat |

## Lane Health Notes

| Lane | Status | Issue |
|------|--------|-------|
| `.omg/state/` | **dirty** | ไม่มี taskboard.md, workspace.json — cache miss risk |
| `.omg/rules/` | **dirty** | ไม่มี learn.json index — agent อาจไม่โหลด rules |
| `packages/plugin-sdk/` | **needs-review** | Tests ซ้ำ, ไม่มี src/ — ใช้การไม่ได้ |
| `.omg/state/memory/` | **dirty** | MEMORY.md ว่างเปล่า — ซ้ำกับ .omg/MEMORY.md |
| `root` | clean | Git branch แยกชัดเจน, commits ถูกต้อง |

## Next Command

เลือกคำสั่ง:
- **`fix T008`** — เพิ่ม gitignore สำหรับ qwen-code-export หรือลบออกจาก commit
- **`create T012`** — สร้าง `.omg/state/taskboard.md` + `workspace.json`
- **`create T013`** — สร้าง `.omg/rules/learn.json`
- **`resolve T002`** — ตัดสินใจเรื่อง packages/plugin-sdk (ลบ หรือ สร้าง src/)
- **`status`** — ดู taskboard อีกครั้ง
