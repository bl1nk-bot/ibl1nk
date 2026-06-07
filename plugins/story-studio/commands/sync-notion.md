# Command: sync-notion

คำสั่งนี้ใช้สำหรับซิงค์ข้อมูลทั้งหมดจาก context.json ขึ้น Notion databases เพื่อให้ผู้ใช้มี dashboard พร้อมดูทันที

## การใช้งาน

```
/story-studio:sync-notion
/story-studio:sync-notion --mode push
/story-studio:sync-notion --mode pull
/story-studio:sync-notion --target episodes
```

### Parameters (ทั้งหมด optional)
- `--mode push` — ส่งข้อมูลจาก context.json → Notion (default)
- `--mode pull` — ดึงข้อมูลจาก Notion → context.json
- `--target <database>` — sync เฉพาะ database (episodes / characters / plot_points / marketing_assets)

## ข้อมูลที่ต้องการ

ก่อนใช้คำสั่งนี้ ผู้ใช้ต้องมี:
- **Notion Integration Token** — จาก https://www.notion.so/my-integrations
- **Database IDs** — ทั้ง 4 databases (กรอกใน `notion-schema.json`)

> หากยังไม่ได้กรอก Database IDs ในไฟล์ agent จะถามผู้ใช้ทีละ database

## ขั้นตอนการทำงาน

1. **ตรวจสอบ config** — อ่าน `notion-schema.json` และตรวจสอบว่ามี database IDs ครบ
2. **ถามข้อมูลที่ขาด** — หาก Token หรือ ID ไหนหายไป ให้ถามผู้ใช้ทีละอย่าง
3. **โหลด context** — ให้ **Context Manager** สรุปข้อมูลปัจจุบันจาก `context.json`
4. **sync ผ่าน Notion MCP** — ให้ **notion-sync skill** ดำเนินการ push/pull
5. **รายงานผล** — แสดงสรุปจำนวน pages ที่สร้าง/อัปเดต พร้อม link ไปยัง Notion
6. **อัปเดต context** — บันทึก notion_page_ids ลง `context.json` เพื่อใช้ update ครั้งถัดไป
