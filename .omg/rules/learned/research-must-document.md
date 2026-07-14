---
name: research-must-document
description: |
  ทุกครั้งที่ทำ research, survey, comparison, analysis — ต้องบันทึกผลเป็นเอกสาร
  ไม่อย่างนั้น session ต่อไปจะไม่มีหลักฐานว่าเคยทำอะไร
  "ไม่มีการ research ที่ไม่ทิ้งหลักฐาน"
globs: "**/*.md"
severity: critical
learned_at: 2026-04-09
trigger_keywords: ["research", "survey", "compare", "analyze", "หาข้อมูล", "สำรวจ", "เปรียบเทียบ"]
---

## กฎ

1. **วิจัยอะไร → เขียนลงไฟล์ทันที** — ไม่ใช่แค่พูดใน chat
2. **เอกสารต้องอยู่ใน repo** — `conductor/research/` หรือ `docs/research/`
3. **ต้องมีวันที่ + แหล่งข้อมูล** — บอกว่าหาจากไหน, เมื่อไหร่, สรุปอะไรได้
4. **ไม่เสร็จ → เขียน draft ได้** — ดีกว่าไม่เขียนเลย

## ตัวอย่าง

```markdown
# Research: Plugin Ecosystems Comparison

**Date**: 2026-04-08
**Requested by**: User (owner)
**Purpose**: หา plugin architecture patterns จาก AI code editors อื่นๆ

## Sources
- Claude Code plugin architecture
- Gemini CLI extension format
- OpenCode plugin system
- Codex plugin design
- Cursor plugin system

## Findings
(บันทึกสิ่งที่พบ — pattern, structure, best practices)
```

## เหตุผล

Session นี้เกิดปัญหา:
- AI ตัวที่ทำ research → ไม่บันทึกผล
- AI ตัวต่อมา (ฉัน) → ไม่มีหลักฐาน → หาไม่เจอ → บอก user ว่า "ไม่มี"
- ผู้ใช้ต้องจำเองว่าเคยสั่งอะไร → AI ทุกตัวกลายเป็น "ไอ้เวรที่จำไม่ได้"

**ไม่ให้เกิดอีก — ทุก research ต้องทิ้งเอกสาร**
