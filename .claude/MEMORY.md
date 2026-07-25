# Project Memory — ibl1nk

## Learned Rules (Critical)

ไฟล์ rules ใน `.omg/rules/learned/` คือกฎที่ต้องทำตามทุกครั้ง:

| Rule | Severity | สรุป |
|------|----------|------|
| [glob-before-create](./rules/learned/glob-before-create.md) | critical | สร้างไฟล์ต้อง glob หาของเดิมก่อน — ไม่สร้างทับ |
| [jsdoc-evidence](./rules/learned/jsdoc-evidence.md) | critical | ทุกไฟล์ที่แตะต้องมี JSDoc @done + timestamp — evidence อ่านได้ |
| [work-log-on-complete](./rules/learned/work-log-on-complete.md) | critical | จบงานต้องเขียน docs/WORK-LOG.md — session ต่อไปอ่านได้ |
| [plan-then-confirm](./rules/learned/plan-then-confirm.md) | critical | บอกแผน → รอ confirm → ทำ — ไม่เริ่มเอง ไม่เกิน scope |
| [no-duplicate-structure](./rules/learned/no-duplicate-structure.md) | critical | ห้ามสร้าง structure ซ้ำ — tests ซ้ำ, package ไม่มี src |
| [thai-output-technical-unchanged](./rules/learned/thai-output-technical-unchanged.md) | standard | ตอบไทย — technical artifacts คงเดิม |
| [research-must-document](./rules/learned/research-must-document.md) | critical | ทุก research ต้องบันทึกผลเป็นเอกสาร — ไม่เช่นนั้น session ต่อไปไม่มีหลักฐาน |
| [file-deletion-authority](./rules/learned/file-deletion-authority.md) | critical | Agent ห้ามลบเอกสาร/ข้อมูล/Context — ลบได้เฉพาะ build artifacts + junk + ไฟล์ผิดพลาด (ต้องอธิบายก่อน) |

## Architecture Notes

- Implementation จริง: `server/_core/pluginsdk/` (7 files)
- Tests: `tests/pluginsdk/` (4 files)
- ~~`packages/plugin-sdk/`~~ — ลบแล้ว (tests ซ้ำ, ไม่มี src)

## Work Log

ดู `docs/WORK-LOG.md` สำหรับความคืบหน้าล่าสุด
