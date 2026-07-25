---
name: glob-before-create
description: |
  ก่อนสร้างไฟล์หรือโฟลเดอร์ใหม่ ต้อง glob/find หาสิ่งที่มีอยู่แล้วในโปรเจคทั้งหมด
  ถ้าเจอชื่อคล้ายหรือเนื้อหาซ้ำ → ไม่สร้าง → แจ้ง user ตำแหน่งของเดิม → รอคำสั่ง
  ห้ามสร้าง copy, standalone version, หรือ duplicate structure โดยไม่มีคำสั่งชัดเจน
globs: "**/*"
severity: critical
learned_at: 2026-04-09
trigger_keywords: ["สร้างไฟล์", "create file", "เขียนไฟล์", "add file", "new file"]
---

## กฎ

1. ก่อนใช้ `write_file` หรือสร้างโฟลเดอร์ → `glob` หา pattern ที่เกี่ยวข้อง **ทั้งโปรเจค**
2. ถ้าเจอไฟล์ชื่อคล้ายหรือเนื้อหาคล้าย → `read_file` เปรียบเทียบ
3. ถ้าซ้ำหรือ overlap → **ไม่สร้าง** → บอก user ว่า "มีอยู่แล้วที่ path X" → รอคำสั่ง
4. ไม่เคยสร้าง "standalone package" หรือ "copy เพื่อเปลี่ยน import path" โดยไม่มี src/ จริง

## ตัวอย่างผิดพลาดที่เคยเกิด

- สร้าง `packages/plugin-sdk/tests/` โดยไม่มี `packages/plugin-sdk/src/` → tests ใช้การไม่ได้
- Tests ซ้ำ 2 ที่ (`tests/pluginsdk/` + `packages/plugin-sdk/tests/`) — เนื้อหาเดียวกัน, import path ต่างกัน
- Implementation อยู่ `server/_core/pluginsdk/` แต่ package ไม่มี source code

## วิธีตรวจสอบ

```bash
glob <pattern>**/*  # หาทั้งโปรเจค
diff <file1> <file2>  # เปรียบเทียบถ้าเจอซ้ำ
```
