---
name: miro-board
description: "สร้างและอัปเดต Miro board จากข้อมูลใน context.json ผ่าน Miro MCP — รองรับ 3 รูปแบบ: Storyboard (timeline ตามตอน), Corkboard (cluster ตัวละคร/สถานที่/plot), Word Count Tracker (Kanban สถานะคำ) ใช้สำหรับ: /create-board, การ visualize ความคืบหน้า, storyboard review"
---

# Miro Board Skill

สกิลนี้สร้าง Miro board อัตโนมัติจากข้อมูลใน context.json เพื่อให้ผู้ใช้เห็นภาพรวมของโปรเจกต์ได้ทันที

## Board Types

### 1. 🎬 Storyboard
Timeline แนวนอน แบ่งเป็น 4 Acts ตามช่วงตอน แต่ละตอนเป็น card แสดง: หมายเลขตอน, ชื่อตอน, word count badge, สถานะ, hook
**เหมาะสำหรับ**: ดูความคืบหน้าทั้งเรื่องในมุมมอง timeline

### 2. 📌 Corkboard
Cluster แบบ freeform แยกหมวดหมู่: ตัวละคร, สถานที่, Plot Points สำคัญ, Marketing Assets
**เหมาะสำหรับ**: brainstorm, วางแผน, และ review ข้อมูลเรื่อง

### 3. 📊 Word Count Tracker
Kanban 3 คอลัมน์: สั้นเกิน / ผ่าน / ยาวเกิน แต่ละ card คือหนึ่งตอน
**เหมาะสำหรับ**: ตรวจสอบ word count และหาตอนที่ต้องแก้ไข

## Workflow

1. **เลือก board type** — ถามผู้ใช้หรือรับจาก parameter
2. **อ่าน context.json** — โหลดข้อมูลปัจจุบัน
3. **อ่าน miro-board-template.json** — โหลด layout และ color scheme
4. **สร้าง board ผ่าน Miro MCP** — สร้าง frame, sections, cards
5. **รายงานผล** — แสดง link ไปยัง board

## Color Coding

| สถานะ   | สี      | Hex Code  |
|---------|---------|-----------|
| Draft   | เหลือง  | `#FFD700` |
| Edited  | ฟ้าอ่อน | `#87CEEB` |
| Final   | เขียว   | `#90EE90` |

| Word Count | สี     |
|-----------|--------|
| ✅ ผ่าน    | เขียว  |
| ⚠️ สั้น   | ส้ม    |
| ⚠️ ยาว    | แดง    |

## Update vs Create

- **สร้างใหม่** (`/create-board`) — สร้าง board ใหม่ทั้งหมด บันทึก board_id ลง context.json
- **อัปเดต** (หลัง write-episodes) — อัปเดต cards ที่เกี่ยวข้องใน board เดิม ไม่สร้าง board ซ้ำ

## Output Format

```
✅ Miro Board พร้อมใช้งาน
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ประเภท  : Storyboard / Corkboard / Word Count Tracker
Cards   : X cards สร้างแล้ว
🔗 เปิด Board: [Miro Link]
```

## Notes

- ต้องมี Miro MCP ติดตั้งและ authorized แล้ว
- board_id จะถูกบันทึกลง context.json เพื่อใช้ในการ update ครั้งถัดไป
- สามารถสร้าง board ได้หลายประเภทพร้อมกันในโปรเจกต์เดียว
