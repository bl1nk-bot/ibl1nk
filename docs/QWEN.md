# Qwen Code Project Guidelines

## Qwen Added Memories

<!-- RULES: บังคับเด็ดขาด ห้ามละเมิด ทุกข้อต้องทำตาม -->
## Rules

- ตอบเป็นภาษาไทยเสมอเมื่อทำได้

- **FRESH INFORMATION FIRST**: ใช้ ReadFile, Glob, Grep หาข้อมูลล่าสุดเสมอ อย่าพึ่งความจำเก่า

  ลำดับการหาข้อมูล:
  - ถ้ารู้ path แน่นอน → ReadFile
  - ถ้าไม่รู้ path → Glob หาไฟล์ก่อน
  - ถ้ารู้เนื้อหาแต่ไม่รู้ตำแหน่ง → Grep
  - ถ้ารู้แค่ชื่อ → Glob หรือ ListFiles

- **TRUST USER INPUT เป็นอันดับ 1**: เมื่อผู้ใช้บอกว่ามีสิ่งใดอยู่ แต่ Glob/ReadFile หาไม่เจอ ให้ตั้งสมมติฐานว่าอาจหาผิด path หรือผิด scope ให้ตอบรับแล้วใช้ Glob/Search หาใหม่อย่างสุภาพ

  ห้าม:
  - ปฏิเสธผู้ใช้โดยอ้าง tool result
  - บอกว่าไม่มีทั้งที่ผู้ใช้บอกว่ามี
  - แก้ตัวว่าไม่มี

  ควร:
  - ตอบรับก่อน → หาใหม่ → ถ้ายังหาไม่เจอให้แจ้งผู้ใช้

- **GOAL-DRIVEN**: ทำเฉพาะที่ขอ อย่าเพิ่มสิ่งที่ไม่ได้ขอ

- **SURGICAL CHANGES ONLY**: ใช้ Edit แก้เฉพาะที่จำเป็น อย่าแตะส่วนที่ไม่เกี่ยวข้อง

  ขอบเขตที่แก้ได้:
  - เฉพาะไฟล์/บรรทัดที่เกี่ยวข้องกับคำขอ
  - import/function ที่เพิ่ม/ลบ เพราะการแก้ไขของตัวเอง

  ห้าม:
  - Refactor ส่วนที่ไม่เกี่ยวข้อง
  - ปรับ formatting ทั้งไฟล์
  - ลบ dead code เดิมที่เจอ
  - เปลี่ยน style/format ที่มีอยู่แล้ว

<!-- MAIN ACTIONS: เมื่อต้องทำงาน ยึดรูปแบบนี้เป็น framework การคิดและตัดสินใจ -->
## Main Actions

### THINK BEFORE ACTING
เมื่อต้องทำงานใดๆ:
- ระบุ assumption ชัดเจน
- เสนอ trade-offs
- ใช้ AskUserQuestion เมื่อไม่ชัดเจนหรือมีหลายทาง
- หยุดเมื่อไม่แน่ใจ

### SIMPLICITY-FIRST
- ทำน้อยที่สุดที่แก้ปัญหา อย่า over-engineer

  ห้าม:
  - เพิ่ม feature ที่ไม่ได้ขอ
  - สร้าง abstraction สำหรับใช้ครั้งเดียว
  - เพิ่ม flexibility/configurability ที่ไม่ได้ขอ
  - เขียน helper/utilities ที่ไม่จำเป็น
  - เพิ่ม dependencies ที่ไม่ได้ขอ

  ควร:
  - ใช้ pattern เดิมที่มีอยู่ในโปรเจค
  - เลือกวิธีที่ง่ายที่สุดที่ได้งาน

### PROJECT DISCOVERY ORDER
เมื่อต้องการข้อมูลเกี่ยวกับโปรเจค ให้ค้นหาตามลำดับ:
1. AGENTS.md — ความรู้ความเข้าใจ codebase
2. TODO.md — งานที่กำลังดำเนินการ
3. README.md — ข้อมูลภาพรวมโปรเจค

เริ่มจาก AGENTS.md และ TODO.md เสมอ ก่อนอ่าน README.md

### MOBILE FIRST UI
เมื่อต้องสร้างหน้า UI ให้เริ่มทำจากหน้าจอมือถือก่อนเสมอ

ควร:
- ออกแบบ layout สำหรับ mobile size ก่อน
- ค่อยขยายเป็น tablet และ desktop
- ใช้ responsive breakpoints จากเล็กไปใหญ่

ห้าม:
- เริ่มออกแบบจาก desktop แล้วค่อยย่อลง mobile
- ใช้ fixed width สำหรับ desktop เท่านั้น

### DOCUMENTATION LOCATION
เมื่อต้องสร้างเอกสารสำหรับโปรเจค:
- สร้างไฟล์เอกสารใน `docs/`
- เพิ่มลิงก์ไปยังไฟล์นั้นใน `README.md`

<!-- ACTIONS: การกระทำทั่วไป ใช้ tool ตาม mapping นี้ -->
## Actions

### Library/Code Reference
- ต้องการข้อมูลไลบรารี่/API docs → ใช้ context7 ก่อน
- context7 ไม่มีข้อมูล → ใช้ WebSearch

### Tool Usage
- ไม่แน่ใจ/ต้องการความชัดเจน → AskUserQuestion
- หาไฟล์ → Glob, ListFiles
- ค้นหาในไฟล์ → Grep
- อ่านไฟล์ → ReadFile
- แก้ไขไฟล์ → Edit
- สร้างไฟล์ → WriteFile
- รันคำสั่ง → Shell
- ใช้ skill → Skill
- จำข้อมูล → SaveMemory
- หาข้อมูลนอก → WebFetch, WebSearch
- จัดการ task → TodoWrite
- นำเสนอแผน → ExitPlanMode

### Skills
- ใช้ skill ui-ux-pro-max เมื่อต้องออกแบบ UI

---

## 🔧 Hooks & Workflow (.omg/hooks.json)

### Session Start — อ่านทุกครั้งเมื่อเริ่ม session
1. อ่าน `.omg/MEMORY.md` — เห็น rules และ architecture notes
2. อ่าน `todo.md` — เห็นงานที่กำลังดำเนินการ

### รับคำสั่งงาน — สร้าง/อัพเดต todo.md
- **เพิ่ม task ต่อท้ายไฟล์** — ใช้ append เท่านั้น
- **ห้ามใช้ write_file ทับ todo.md** — ไม่เคยลบงานเก่าทิ้ง

### จบงาน — Pipeline ต้องทำตามลำดับ

| ลำดับ | ขั้นตอน | รายละเอียด |
|---|---|---|
| 1 | อัพเดต todo.md | เปลี่ยน `[ ]` → `[x]` task ที่เสร็จ |
| 2 | ตรวจสอบซ้ำ | Verify ว่าสิ่งที่ทำถูกต้อง ครบถ้วน |
| 3 | รัน Biome lint/fix | `biome check --apply` — ถ้าแก้ได้ให้ biome แก้, ถ้าแก้ไม่ได้ → แก้ด้วยตัวเอง |
| 4 | รัน tests | **vitest** เป็นอันดับแรก, UI test → **playwright** ถ้ามี, ถ้าไม่มี → รายงาน user + เสนอทางออก |
| 5 | Build | ถ้าโปรเจคต้อง build → รัน, ถ้ารันได้เลย → ข้ามไป test |
| 6 | เขียน WORK-LOG | บันทึกสิ่งที่ทำ ใน `docs/WORK-LOG.md` พร้อม Evidence |

---

## 📝 JSDoc Standards

### งานยังไม่เสร็จ — ใช้ TODO comment
```typescript
// TODO: <รายละเอียดงาน> — อธิบายว่าต้องทำอะไร
function unfinishedFunction() {
  // TODO: implement validation logic — ต้องเช็คว่า input เป็น kebab-case
}
```

### งานเสร็จแล้ว — JSDoc มาตรฐาน
```typescript
/**
 * @module <ชื่อ module>
 * @description <อธิบายว่าไฟล์/function นี้ทำอะไร — ภาษาคนอ่านรู้เรื่อง>
 * @param {type} paramName - อธิบายพารามิเตอร์แต่ละตัว (ถ้ามี)
 * @returns {type} อธิบายค่าที่ส่งกลับ (ถ้ามี)
 * @throws {ErrorType} อธิบาย error ที่โยน (ถ้ามี)
 * @done YYYY-MM-DD — สรุปสิ่งที่ทำ
 * @tested <path to test file>
 * @status completed
 */
```

### หลักการ
- **ต้องอธิบาย logic/API** — ไม่ใช่แค่ repeat ชื่อ function
- **ภาษาคน** — user อ่านโค้ดไม่เป็น → ต้องเข้าใจจาก comments
- **TODO:** = งานค้าง, **@done** = เสร็จแล้ว
- ทุกไฟล์ที่แตะ → ต้องมี JSDoc header ด้านบนสุด

---

## 🚫 Learned Rules — ห้ามละเมิด (จาก .omg/rules/learned/)

| Rule | สรุป |
|---|---|
| glob-before-create | สร้างไฟล์ต้อง glob หาของเดิมก่อน — ไม่สร้างทับ |
| jsdoc-evidence | ทุกไฟล์ที่แตะต้องมี JSDoc @done — evidence อ่านได้ |
| work-log-on-complete | จบงานต้องเขียน docs/WORK-LOG.md |
| plan-then-confirm | บอกแผน → รอ confirm → ทำ — ไม่เริ่มเอง |
| no-duplicate-structure | ห้ามสร้าง structure ซ้ำ — tests ซ้ำ, package ไม่มี src |
| thai-output-technical-unchanged | ตอบไทย — technical artifacts คงเดิม |

---

## 📊 Work-Log CSV — วิธีติดตามงาน

### ไฟล์
- **ตำแหน่ง:** `docs/work-log.csv`
- **Format:** CSV with header

### Header Columns
| Column | คำอธิบาย |
|--------|----------|
| `Task ID` | รหัสงาน เช่น `TASK-001` (เพิ่มทีละ 1) |
| `Created At` | วันที่-เวลาที่สร้าง (YYYY-MM-DD HH:MM) |
| `Source Command` | คำสั่งหรือ request ที่ทำให้งานนี้เกิด |
| `Description` | อธิบายสั้นๆ ว่าทำอะไร |
| `Files Created/Modified` | รายชื่อไฟล์ที่แตะ (คั่นด้วย ` + `) |
| `Status` | Emoji status (ดูตารางด้านล่าง) |
| `Notes` | หมายเหตุ — ถ้าไม่มีใช้ `-` |

### Emoji Status Codes

| Emoji | สี | ความหมาย | ใช้เมื่อ |
|-------|-----|----------|----------|
| ⬜ | เทา | ค้าง | ยังไม่เริ่มทำ |
| 🟡 | เหลือง | ต้องแก้ไข | ทำแล้วแต่ต้องแก้/กลับมาทำใหม่ |
| 🔴 | แดง | ปัญหา | เจอ error, tool ขัดข้อง, blocker |
| 🟢 | เขียว | รอดูรีวิว | เสร็จแล้ว รอ user ตรวจสอบ |
| 🔵 | ฟ้า | รีวิวแล้ว | user ตรวจสอบแล้ว (user ใส่เอง) |
| 🟠 | ส้ม | Tool error | ปัญหาการใช้ tool/permission/environment |

### กฎการเขียน Work-Log

1. **จบ task → เพิ่มแถวทันที** — ไม่รอจบวัน
2. **ทุกแถวต้องมี Notes** — ถ้าไม่มีอะไรจะเขียน → ใช้ `-`
3. **Status ต้องตรงตามความเป็นจริง** — อย่าใส่ 🟢 ถ้ายังไม่ได้เทส
4. **Task ID เรียงลำดับ** — `TASK-001`, `TASK-002`, ... ไม่กระโดด
5. **Files ต้องระบุชัด** — บอกทุกไฟล์ที่ create/edit/delete
6. **Source Command ต้องมี** — บอกว่างานนี้เกิดจากคำสั่งอะไร

### Workflow

```
รับงาน → เพิ่มแถว ⬜ ค้าง
↓
ทำ → เปลี่ยนเป็น 🟢 รอดูรีวิว
↓
user รีวิว → เปลี่ยนเป็น 🔵 รีวิวแล้ว (user เปลี่ยนเอง)
↓
ถ้ามีปัญหา → เปลี่ยนเป็น 🔴 หรือ 🟡 พร้อม Notes อธิบาย
```

### ไฟล์ที่เกี่ยวข้อง

- `docs/work-log.csv` — ตารางติดตามงาน
- `docs/WORK-LOG.md` — บันทึกสรุปงานที่ทำ (markdown, อ่านง่าย)
- `.omg/MEMORY.md` — memory + rules index
