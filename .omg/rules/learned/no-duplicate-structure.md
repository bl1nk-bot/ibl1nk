---
name: no-duplicate-structure
description: |
  ห้ามสร้างโครงสร้างที่ซ้ำซ้อนกับของเดิม — tests ซ้ำ, package ไม่มี src, implementation คนละที่
  ถ้าต้องการ standalone package → ต้องมี src/, exports, build script ครบ
  ถ้าไม่พร้อม → ไม่สร้าง wrapper เปล่า
globs: "packages/**/*, tests/**/*, server/**/*"
severity: critical
learned_at: 2026-04-09
trigger_keywords: ["package", "sdk", "standalone", "duplicate", "ซ้ำ"]
---

## กฎ

1. ก่อนสร้าง package/SDK → ตรวจสอบว่า:
   - มี `src/` directory พร้อม implementation จริง
   - มี `package.json` exports ชี้ถูกที่
   - มี build script ที่ใช้ได้
2. ถ้าไม่มี → ไม่สร้าง tests หรือ config wrapper เปล่า
3. Implementation เดิมอยู่ที่ไหน → ใช้ที่นั่น → ไม่ copy เพื่อทำ "standalone version" โดยไม่ย้ายของจริง
4. Tests ต้องชี้ไป implementation จริง — ไม่ใช่ชี้ไป `../src/` ที่ไม่มีอยู่

## ตัวอย่างผิดพลาดที่เคยเกิด

```
packages/plugin-sdk/
├── tests/          ← copy มาจาก tests/pluginsdk/ แก้ import เป็น ../src/
├── package.json    ← exports: ./dist/index.js
└── tsconfig.json   ← แต่ไม่มี src/ directory!
```

Implementation จริงอยู่ `server/_core/pluginsdk/` — package ไม่มีอะไรเลย

## วิธีตรวจสอบ

```bash
# ก่อนสร้าง package
glob packages/<name>/src/**/*  # ต้องมี
glob packages/<name>/tests/**/*  # ถ้ามี tests → src ต้องมีก่อน
```
