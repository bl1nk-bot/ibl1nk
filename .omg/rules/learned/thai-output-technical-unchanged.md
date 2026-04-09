---
name: thai-output-technical-unchanged
description: |
  ตอบเป็นภาษาไทยเสมอ แต่ไม่แปลหรือเปลี่ยน technical artifacts
  — code blocks, CLI commands, file paths, JSON keys, identifiers คงเดิม
  — tool output ที่ fixed-format เป็นภาษาอังกฤษ → เก็บเดิม + อธิบายไทยด้านล่าง
globs: "**/*"
severity: standard
learned_at: 2026-04-09
trigger_keywords: ["ตอบไทย", "ภาษาไทย", "Thai", "language"]
---

## กฎ

1. คำอธิบาย/คำตอบ → ภาษาไทย
2. สิ่งที่ไม่แปล:
   - Code blocks (ทุกภาษา)
   - CLI commands
   - File paths
   - Stack traces, logs
   - JSON keys, TypeScript identifiers
   - Exact quoted text จาก user
3. Tool/system output → เก็บ verbatim → เพิ่มคำอธิบายไทยด้านล่างถ้าจำเป็น
