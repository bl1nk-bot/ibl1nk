---
name: file-deletion-authority
description: |
  Agent ไม่มีสิทธิลบเอกสารหรือข้อมูลใดๆ — มีแต่ owner ที่ลบได้
  Agent ลบได้เฉพาะ: build artifacts, ไฟล์ซ้ำซ้อนที่สร้างผิดพลาด, junk จาก build
  ก่อนลบอะไรต้องอธิบายให้ owner ฟังก่อน — owner ตัดสินใจ
globs: "**/*"
severity: critical
learned_at: 2026-04-09
trigger_keywords: ["ลบ", "delete", "remove", "clean", "clear", "artifact"]
---

## กฎ

### สิ่งที่ Agent **ห้ามลบเด็ดขาด**
- เอกสารทุกชนิด (`.md`, `.txt`, `.json`, `.yaml`) — **เป็นข้อมูล/สมอง/Context ของโปรเจค**
- ไฟล์ config (`.omg/`, `conductor/`, `.gitignore`, `package.json`)
- ไฟล์ code ที่ทำงานได้ — แม้จะไม่ใช่ของ agent ตัวนี้
- ไฟล์ที่ owner สร้างขึ้น

**เหตุผล:** Owner อ่านโค้ดไม่ออก — ถ้าลบไฟล์ข้อมูล/Context/เอกสาร → Agent ต่อไปจะไม่มีอะไรหา → กลายเป็น "ไอ้เวรที่จำไม่ได้"

### สิ่งที่ Agent **ลบได้** (ต้องอธิบายก่อน)
- Build artifacts (`dist/`, `build/`, `node_modules/`)
- Log files (`.log`, `*.tmp`)
- ไฟล์ที่สร้างผิดพลาด (syntax error, empty file, duplicate ที่สร้างใน session เดียวกัน)
- Cache files (`.cache/`, temporary files)

### สิ่งที่ Agent **ต้องทำก่อนลบ**
1. **อธิบายสิ่งที่ต้องการลบ** — ไฟล์ไหน, ทำไม, สร้างจากอะไร
2. **รอ owner ตัดสินใจ** — "ลบได้ไหม" หรือ "เก็บไว้ก่อน"
3. **ไม่ลบเองโดยพลการ** — แม้จะมั่นใจว่าไม่ใช่

## ตัวอย่างที่ผิด (เกิดขึ้นแล้ว)
- AI สร้าง `packages/plugin-sdk/tests/` โดยไม่มี `src/` → ควรอธิบายว่า "สร้างผิดพลาด ไม่มี src จะลบไหม"
- AI สร้างไฟล์ซ้ำ 2-3 ที่ → ควรบอกว่า "เจอ duplicate ที่ A, B, C จะเก็บที่ไหน"

## เหตุผล

- Owner อ่านโค้ดไม่ออก — ไฟล์ที่ owner สร้าง = ข้อมูลที่ owner ต้องการ
- Agent ไม่รู้ context ทั้งหมด — สิ่งที่ดูเหมือนขยะ อาจเป็นข้อมูลที่ owner กำลังทดสอบ
- ไฟล์ code ลบแล้วสร้างใหม่ได้ — แต่ Context/ความจำ/เอกสาร ลบแล้วหายไปเลย
