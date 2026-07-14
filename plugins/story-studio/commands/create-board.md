# Command: create-board

คำสั่งนี้ใช้สำหรับสร้าง Miro board จากข้อมูลใน context.json เพื่อให้ผู้ใช้เห็นภาพรวมโปรเจกต์ได้ทันที

## การใช้งาน

```
/story-studio:create-board
/story-studio:create-board --type storyboard
/story-studio:create-board --type corkboard
/story-studio:create-board --type word_count
/story-studio:create-board --type all
```

### Parameters (ทั้งหมด optional)
- `--type storyboard` — Timeline ตามตอน แบ่ง 4 Acts
- `--type corkboard` — Cluster ตัวละคร / สถานที่ / Plot Points / Marketing
- `--type word_count` — Kanban สถานะ word count ต่อตอน
- `--type all` — สร้างทั้ง 3 board ในครั้งเดียว (default)

## ขั้นตอนการทำงาน

1. **ตรวจสอบ context** — ให้ **Context Manager** โหลดข้อมูลจาก `context.json`
2. **เลือก board type** — หากไม่ระบุ ให้ถามผู้ใช้ว่าต้องการแบบไหน
3. **ตรวจสอบ board เดิม** — หากมี `miro_board_ids` ใน context.json ให้ถามว่าจะสร้างใหม่หรืออัปเดต
4. **สร้าง board ผ่าน Miro MCP** — ให้ **miro-board skill** สร้าง frame, sections, cards ตาม template
5. **บันทึก board IDs** — บันทึก `miro_board_ids` ลง `context.json`
6. **รายงานผล** — แสดง link ไปยัง board พร้อมสรุปจำนวน cards ที่สร้าง

## Auto-Update

หลังจากสร้าง board แล้ว board จะถูกอัปเดตอัตโนมัติเมื่อ:
- `/write-episodes` เสร็จ → อัปเดต Storyboard และ Word Count Tracker
- `/update-context` → อัปเดต Corkboard
- `/marketing-assets` → อัปเดต Marketing cluster ใน Corkboard
