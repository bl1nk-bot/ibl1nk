---
name: notion-sync
description: "ซิงค์ข้อมูล context.json กับ Notion databases ผ่าน Notion MCP — รองรับ push ตอนใหม่, อัปเดตตัวละคร, บันทึก marketing assets และดึงข้อมูลย้อนกลับ ใช้สำหรับ: /sync-notion, การ push episode หลัง write-episodes เสร็จ, การดู dashboard บน Notion"
---

# Notion Sync Skill

สกิลนี้เชื่อม Story Studio กับ Notion เพื่อให้ผู้ใช้มี dashboard พร้อมใช้บน Notion โดยไม่ต้องกรอกข้อมูลเอง

## Prerequisites

ก่อนใช้งาน ผู้ใช้ต้องเตรียม:
1. **Notion Integration Token** — สร้างที่ https://www.notion.so/my-integrations
2. **Database IDs** — 4 databases ตาม `notion-schema.json`:
   - Episodes Database ID
   - Characters Database ID
   - Plot Points Database ID
   - Marketing Assets Database ID
3. **Share databases กับ Integration** — ใน Notion ให้กด Share > Invite > เลือก integration ที่สร้าง

> 💡 **หมายเหตุ**: Database ID คือส่วนของ URL หลัง notion.so/ เช่น  
> `https://notion.so/abc123def456...` → ID คือ `abc123def456...`

## Workflow

### Push (context.json → Notion)

1. **อ่าน context.json** — โหลดข้อมูลปัจจุบัน
2. **อ่าน notion-schema.json** — โหลด mapping และ database IDs
3. **ตรวจสอบ database** — ยืนยันว่า databases พร้อมใช้งาน
4. **แมพข้อมูล** — แปลง fields จาก context.json ให้ตรงกับ Notion properties
5. **Push ข้อมูล** — สร้างหรืออัปเดต pages ใน Notion ผ่าน MCP
6. **รายงานผล** — สรุปจำนวน pages ที่สร้าง/อัปเดต

### Pull (Notion → context.json)

1. **Query database** — ดึงข้อมูลจาก Notion
2. **แมพกลับ** — แปลง Notion properties กลับเป็น context.json format
3. **Merge** — รวมกับ context.json ที่มีอยู่ (ไม่เขียนทับ)
4. **บันทึก** — อัปเดต context.json

## Sync Rules (จาก notion-schema.json)

| Event                  | Databases ที่ sync                    |
|------------------------|---------------------------------------|
| `/sync-notion` (full)  | ทุก databases                         |
| หลัง write-episodes    | episodes + plot_points                |
| หลัง start-project     | characters + marketing_assets         |
| หลัง marketing-assets  | marketing_assets                      |
| หลัง update-context    | characters + plot_points              |

## Output Format

```
✅ Notion Sync เสร็จสมบูรณ์
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📺 Episodes    : สร้าง 5 / อัปเดต 0
🧑 Characters  : สร้าง 3 / อัปเดต 1
🎯 Plot Points : สร้าง 8 / อัปเดต 0
📣 Marketing   : สร้าง 0 / อัปเดต 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 ดู Dashboard: [Notion Link]
```

## Error Handling

- **Token ไม่ถูกต้อง** → แจ้งให้ผู้ใช้ตรวจสอบ NOTION_TOKEN
- **Database ID ผิด** → ระบุว่า database ไหนมีปัญหาและแนะนำวิธีหา ID
- **Notion API rate limit** → รอและ retry อัตโนมัติ
- **ข้อมูลขัดแย้ง** → แจ้ง conflict และถามผู้ใช้ก่อน overwrite
