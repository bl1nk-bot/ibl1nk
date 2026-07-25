---
name: jsdoc-standards
description: |
  มาตรฐาน JSDoc ที่ต้องเขียนในโค้ดทุกไฟล์ที่แตะ
  ใช้ TODO: สำหรับงานค้าง, @done สำหรับงานเสร็จ
  อธิบาย module, function, @param, @returns, @throws, logic, API contract
globs: "**/*.ts"
severity: standard
learned_at: 2026-04-09
---

## กฎ

- ใช้ `TODO: <รายละเอียด>` สำหรับงานที่ทำยังไม่เสร็จ
- ใช้ JSDoc มาตรฐานสำหรับงานเสร็จ:
  - `@module` — ชื่อ module
  - `@description` — อธิบายว่าไฟล์นี้ทำอะไร
  - `@param` — พารามิเตอร์แต่ละตัว (ถ้ามี)
  - `@returns` — ค่าที่ส่งกลับ (ถ้ามี)
  - `@throws` — error ที่โยน (ถ้ามี)
  - `@done` — วันที่ + สรุปสิ่งที่ทำ (ถ้าเสร็จ)
- ทุกไฟล์ที่แตะ → ต้องมี JSDoc header ด้านบนสุด
