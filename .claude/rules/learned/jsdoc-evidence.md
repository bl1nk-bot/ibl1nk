---
name: jsdoc-evidence
description: |
  ทุกไฟล์ที่แตะต้องเพิ่ม JSDoc header พร้อม @done + timestamp + @tested
  เพื่อให้ user อ่านได้จริงว่าทำอะไรไปแล้ว ไม่ใช่แค่คำพูดว่า "เรียบร้อย"
  Evidence ต้องดูได้จากไฟล์ ไม่ใช่จากคำตอบของ agent
globs: "**/*.ts"
severity: critical
learned_at: 2026-04-09
trigger_keywords: ["แก้โค้ด", "แก้ไข", "add JSDoc", "document", "implement"]
---

## กฎ

1. ทุก `.ts` file ที่แตะ → เพิ่ม JSDoc header ด้านบนสุด
2. Format:
```typescript
/**
 * @module <module-name>
 * @description <สิ่งที่ไฟล์นี้ทำ>
 * @done YYYY-MM-DD — <อธิบายสั้นๆว่าทำอะไร>
 * @tested <path to test file>
 * @status completed | partial | not-started
 */
```
3. Function สำคัญ → เพิ่ม `@param`, `@returns`, `@throws`
4. ยังไม่ได้ทำ → ใช้ `@todo` แทน `@done`

## ตัวอย่าง

```typescript
/**
 * @module pluginsdk/paths
 * @description Resolve file paths for plugin components
 * @done 2026-04-09 — Added full JSDoc headers to all functions
 * @tested tests/pluginsdk/paths.test.ts
 * @status completed
 */
```

## เหตุผล

User อ่านโค้ดไม่เป็น → ต้องเห็น status ชัดเจนจากไฟล์ว่าทำอะไรไปแล้ว
"Tests passed" ≠ "Logic ถูกต้อง" → JSDoc บอก scope และสถานะจริง
