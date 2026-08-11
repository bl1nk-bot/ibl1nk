# แผนสถาปัตยกรรมและบูรณาการ Claude Writer Plugin

## 1. บทนำ

เอกสารนี้เสนอแผนสถาปัตยกรรมและบูรณาการสำหรับ Claude Writer Plugin ซึ่งเป็นส่วนขยายที่ออกแบบมาเพื่อช่วยนักเขียนในการจัดการเนื้อหา ติดตามตัวละคร และปรับปรุงคุณภาพงานเขียน โดยผสานรวมความสามารถของ Craft.io, Obsidian, เครื่องมือวิเคราะห์เนื้อหาที่ขับเคลื่อนด้วย AI, Visual Dashboard และการเชื่อมต่อกับ Slack

## 2. สถาปัตยกรรมโดยรวม

Claude Writer Plugin จะทำงานเป็นส่วนเสริมภายในสภาพแวดล้อมของ Claude Code โดยใช้ประโยชน์จาก Craft API สำหรับการจัดการข้อมูลหลัก และใช้ AI สำหรับการวิเคราะห์เนื้อหาขั้นสูง Visual Dashboard จะถูกสร้างขึ้นเป็นหน้า HTML แบบสแตนด์อโลนเพื่อแสดงข้อมูลเชิงลึก และ Slack Integration จะช่วยให้มีการแจ้งเตือนและการสั่งงานผ่านคำสั่ง

```mermaid
graph TD
    A[Claude Code Environment] --> B(Claude Writer Plugin)
    B --> C{Craft.io API}
    B --> D[Obsidian File System Access]
    B --> E[AI/LLM Services]
    B --> F[Visual Dashboard (HTML)]
    B --> G{Slack API}

    C -- จัดการเอกสาร, คอลเลกชัน --> H[Craft.io Data (Documents, Collections)]
    D -- อ่าน/ซิงค์ Markdown --> I[Obsidian Vault (Markdown Files)]
    E -- วิเคราะห์เนื้อหา, ตรวจสอบไวยากรณ์ --> J[Writing Analysis Results]
    F -- แสดงผลข้อมูลเชิงลึก --> K[User Interface (Browser)]
    G -- แจ้งเตือน, คำสั่ง Slash --> L[Slack Workspace]
```

## 3. รายละเอียดคุณสมบัติและการนำไปใช้งาน

### 3.1 การติดตามเนื้อหา (Outline, Characters)

- **โครงสร้างเนื้อหา (Outline Tracking):**
  - **Craft Collections:** สร้าง Collection ใน Craft สำหรับเก็บโครงสร้างเรื่อง (เช่น Chapters, Scenes) โดยแต่ละ Item ใน Collection จะมีฟิลด์สำหรับชื่อเรื่อง, สรุป, สถานะ, และลิงก์ไปยัง Craft Document ที่เกี่ยวข้อง
  - **การวิเคราะห์ Markdown:** Plugin จะสามารถอ่านไฟล์ Markdown จาก Obsidian หรือ Craft Document และสร้าง Outline โดยการแยก Heading (H1, H2, H3) เพื่อแสดงโครงสร้างของเรื่อง
- **การติดตามตัวละคร (Character Tracking):**
  - **Craft Collection:** สร้าง Collection ชื่อ `Characters` ใน Craft โดยแต่ละ Item จะแทนตัวละครหนึ่งตัว มีฟิลด์สำหรับ:
    - `Name` (ชื่อตัวละคร)
    - `Description` (คำอธิบาย)
    - `Traits` (ลักษณะนิสัย - อาจเป็น Multi-select หรือ Text)
    - `Relationships` (ความสัมพันธ์กับตัวละครอื่น - อาจเป็น Link to other Character Items)
    - `Key_Events` (เหตุการณ์สำคัญที่เกี่ยวข้องกับตัวละคร)
  - **การเชื่อมโยงกับเนื้อหา:** เมื่อวิเคราะห์เนื้อหา Plugin จะสามารถระบุการกล่าวถึงตัวละครและเชื่อมโยงกลับไปยัง Character Collection ได้

### 3.2 การบูรณาการกับ Obsidian

- **การเข้าถึงไฟล์:** Plugin จะต้องมีสิทธิ์เข้าถึงไฟล์ในระบบ (ผ่าน `shell` tool) เพื่ออ่านไฟล์ Markdown จาก Obsidian vault ที่ผู้ใช้กำหนด
- **การซิงโครไนซ์:**
  - **Manual Sync:** ผู้ใช้สามารถสั่งให้ Plugin ซิงโครไนซ์ไฟล์จาก Obsidian ไปยัง Craft Document หรือเพื่อการวิเคราะห์ได้ตามต้องการ
  - **File Watcher (อนาคต):** อาจพิจารณาใช้ `inotify-tools` หรือ Node.js `fs.watch` เพื่อตรวจจับการเปลี่ยนแปลงไฟล์ใน Obsidian vault และทริกเกอร์การซิงโครไนซ์อัตโนมัติ (ต้องพิจารณาเรื่องประสิทธิภาพและทรัพยากร)

### 3.3 เครื่องมือเขียนขั้นสูง (AI-powered)

คุณสมบัติเหล่านี้จะใช้ LLM (Large Language Model) ที่เชื่อมต่อผ่าน Claude Code Environment เพื่อประมวลผลและวิเคราะห์ข้อความ

- **การค้นหา (Keyword, Text Search):**
  - **Craft Search API:** ใช้ `CraftApiClient.search()` สำหรับการค้นหาใน Craft Documents
  - **สำหรับ Obsidian:** อาจต้องสร้าง Indexing ชั่วคราว หรือใช้ `grep` ผ่าน `shell` tool เพื่อค้นหาในไฟล์ Markdown
- **การค้นหาตัวละคร (Character Search):**
  - ค้นหาใน `Characters` Collection ของ Craft โดยใช้ชื่อตัวละครหรือคำอธิบาย
  - สามารถค้นหาการกล่าวถึงตัวละครในเนื้อเรื่องและแสดงบริบทได้
- **การหาความสำคัญและการวิเคราะห์เนื้อหา (Significance Finding, Content Analysis):**
  - ส่งส่วนของเนื้อหาไปยัง LLM พร้อม Prompt เพื่อวิเคราะห์หาประเด็นสำคัญ, ธีม, หรือความขัดแย้ง
  - สามารถระบุจุดที่เนื้อเรื่องมีการเปลี่ยนแปลงสำคัญ หรือจุดที่ตัวละครมีการพัฒนา
- **การหาคำผิด, การรีไรท์, การแก้ไขไวยากรณ์ (Spell Check, Rewrite, Grammar Correction):**
  - ส่งข้อความไปยัง LLM เพื่อทำการตรวจสอบและแก้ไขคำผิด, ไวยากรณ์, หรือเสนอการรีไรท์ประโยคให้กระชับและน่าสนใจยิ่งขึ้น
- **การตรวจจับเนื้อหาและ Hook/Impact ของเรื่อง:**
  - ใช้ LLM เพื่อวิเคราะห์โครงสร้างการเล่าเรื่องและระบุจุดที่สร้างความตื่นเต้น (Hooks) หรือผลกระทบทางอารมณ์ (Impact) ในแต่ละส่วนของเรื่อง
  - สามารถให้คำแนะนำในการปรับปรุงเพื่อเพิ่มความน่าสนใจของเรื่อง

### 3.4 Visual Dashboard (ใช้ `visual-explainer`)

Dashboard จะถูกสร้างเป็นไฟล์ HTML แบบสแตนด์อโลนที่สวยงามและโต้ตอบได้ โดยใช้ `visual-explainer` skill

- **องค์ประกอบของ Dashboard:**
  - **Writing Progress:** กราฟแสดงจำนวนคำที่เขียนต่อวัน/สัปดาห์, ความคืบหน้าเทียบกับเป้าหมาย (Chart.js)
  - **Story Outline Visualization:** แผนผังโครงสร้างเรื่อง (Mermaid Flowchart หรือ CSS Grid cards) แสดง Chapter, Scene และสถานะ
  - **Character Relationship Map:** แผนผังความสัมพันธ์ของตัวละคร (Mermaid Graph) แสดงการเชื่อมโยงระหว่างตัวละครหลัก
  - **Content Analysis Summary:** สรุปผลการวิเคราะห์เนื้อหา เช่น Sentiment Score, Keyword Density, จุดเด่น/จุดด้อยของเรื่อง
  - **Error/Correction Statistics:** สถิติการแก้ไขคำผิด, ไวยากรณ์, และการรีไรท์ที่แนะนำโดย AI
- **การสร้าง:** Plugin จะรวบรวมข้อมูลจาก Craft และผลการวิเคราะห์จาก AI แล้วนำมาสร้างเป็นไฟล์ HTML โดยใช้เทมเพลตของ `visual-explainer`
- **การแสดงผล:** ไฟล์ HTML จะถูกเปิดในเบราว์เซอร์เพื่อให้ผู้ใช้สามารถดู Dashboard ได้

### 3.5 Vercel Deployment

- **Dashboard Hosting:** Visual Dashboard ที่สร้างขึ้นสามารถ Deploy ไปยัง Vercel ได้ เพื่อให้สามารถเข้าถึงได้ผ่าน URL และแชร์ได้ง่าย
- **CI/CD:** สามารถตั้งค่า Vercel เพื่อ Deploy Dashboard อัตโนมัติเมื่อมีการเปลี่ยนแปลงข้อมูลสำคัญ หรือเมื่อผู้ใช้สั่งให้สร้าง Dashboard ใหม่

### 3.6 Slack Integration

- **Slack App:** สร้าง Slack App ที่มีสิทธิ์ในการส่งข้อความ, สร้าง Slash Commands และเข้าถึงข้อมูล Channel
- **Slackbot:**
  - **การแจ้งเตือน:** ส่งการแจ้งเตือนอัตโนมัติ เช่น สรุปความคืบหน้าการเขียนประจำวัน, แจ้งเตือนเมื่อพบปัญหาในงานเขียน, หรือแจ้งเตือนเมื่อถึงกำหนดส่งงาน
  - **การตอบคำถาม:** สามารถตอบคำถามง่ายๆ เกี่ยวกับสถานะงานเขียน หรือข้อมูลตัวละครได้
- **Slack Slash Command:**
  - **`/claude-writer analyze [document_id]`:** สั่งให้ Plugin วิเคราะห์เอกสารที่ระบุและส่งสรุปผลกลับมาใน Slack
  - **`/claude-writer character [name]`:** ค้นหาข้อมูลตัวละครที่ระบุและแสดงรายละเอียดใน Slack
  - **`/claude-writer dashboard`:** สร้างและส่งลิงก์ไปยัง Visual Dashboard ล่าสุด
- **Sup-Agent Workflow Canvas:**
  - ใช้ Slack Workflow Builder เพื่อสร้าง Workflow ที่ซับซ้อนขึ้น เช่น การอนุมัติการแก้ไข, การขอรีวิวจากเพื่อนร่วมงาน, หรือการจัดการ Task ที่เกี่ยวข้องกับการเขียน
  - Plugin จะทำหน้าที่เป็น Backend สำหรับ Workflow เหล่านี้ โดยรับคำสั่งจาก Workflow และส่งผลลัพธ์กลับไป

## 4. โครงสร้าง Claude Plugin (SKILL.md)

Claude Writer Plugin จะประกอบด้วย Skills ย่อยหลายตัวที่แต่ละตัวรับผิดชอบคุณสมบัติเฉพาะ เพื่อให้โมเดลสามารถเรียกใช้ได้อย่างมีประสิทธิภาพ

ตัวอย่างโครงสร้าง `SKILL.md` สำหรับบางคุณสมบัติ:

- **`claude-writer/analyze-content`:**

  ```markdown
  ---
  name: analyze-content
  description: วิเคราะห์เนื้อหาที่ให้มาเพื่อหาประเด็นสำคัญ, ธีม, ความขัดแย้ง, จุดเด่น/จุดด้อย, และเสนอแนะการปรับปรุง. ใช้เมื่อต้องการวิเคราะห์งานเขียน.
  ---

  # Analyze Content

  วิเคราะห์ข้อความที่ให้มาเพื่อระบุประเด็นสำคัญ, ธีม, ความขัดแย้ง, จุดเด่นและจุดด้อยของเนื้อหา. สามารถใช้เพื่อประเมินคุณภาพงานเขียนและรับคำแนะนำในการปรับปรุง.

  **Input:**

  - `text`: ข้อความที่ต้องการวิเคราะห์
  - `document_id` (optional): ID ของ Craft Document ที่ต้องการวิเคราะห์

  **Output:**

  - สรุปผลการวิเคราะห์ (ประเด็นสำคัญ, ธีม, ความขัดแย้ง)
  - คำแนะนำในการปรับปรุง
  - Sentiment Score (ถ้ามี)
  ```

- **`claude-writer/track-character`:**

  ```markdown
  ---
  name: track-character
  description: จัดการและค้นหาข้อมูลตัวละครใน Craft Collection. ใช้เมื่อต้องการเพิ่ม, แก้ไข, หรือค้นหาข้อมูลตัวละคร.
  ---

  # Track Character

  จัดการข้อมูลตัวละครใน Craft Collection 'Characters'. สามารถเพิ่มตัวละครใหม่, อัปเดตข้อมูลที่มีอยู่, หรือค้นหาข้อมูลตัวละครตามชื่อ.

  **Input:**

  - `action`: 'add', 'update', 'search'
  - `name`: ชื่อตัวละคร
  - `description` (optional): คำอธิบายตัวละคร (สำหรับ 'add', 'update')
  - `traits` (optional): ลักษณะนิสัย (สำหรับ 'add', 'update')
  - `relationships` (optional): ความสัมพันธ์กับตัวละครอื่น (สำหรับ 'add', 'update')

  **Output:**

  - ข้อมูลตัวละครที่เพิ่ม/แก้ไข/ค้นหา
  - ข้อความยืนยันการดำเนินการ
  ```

- **`claude-writer/generate-dashboard`:**

  ```markdown
  ---
  name: generate-dashboard
  description: สร้าง Visual Dashboard ในรูปแบบ HTML เพื่อแสดงผลข้อมูลเชิงลึกของงานเขียน. ใช้เมื่อต้องการดูภาพรวมของความคืบหน้าและผลการวิเคราะห์.
  ---

  # Generate Visual Dashboard

  รวบรวมข้อมูลจาก Craft และผลการวิเคราะห์จาก AI เพื่อสร้าง Visual Dashboard ในรูปแบบ HTML. Dashboard จะแสดงความคืบหน้าการเขียน, แผนผังโครงสร้างเรื่อง, แผนผังความสัมพันธ์ตัวละคร, และสรุปผลการวิเคราะห์เนื้อหา.

  **Output:**

  - Path ไปยังไฟล์ HTML ของ Dashboard ที่สร้างขึ้น
  - URL สำหรับเข้าถึง Dashboard (ถ้า Deploy บน Vercel)
  ```

## 5. การเชื่อมต่อและผสานการทำงาน

- **Claude Plugin <-> Craft API:** ใช้ `CraftApiClient` ที่มีอยู่ในเทมเพลต `craft-portfolio-page` เพื่อ CRUD (Create, Read, Update, Delete) Blocks, Documents, Collections และ Collection Items
- **Claude Plugin <-> Obsidian:** ใช้ `shell` tool เพื่ออ่านไฟล์ Markdown จาก Obsidian vault. อาจใช้ `rsync` หรือ `cp` เพื่อซิงค์ไฟล์ไปยังพื้นที่ทำงานของ Plugin ชั่วคราวเพื่อการประมวลผล
- **Claude Plugin <-> AI/LLM:** ส่งข้อความไปยัง LLM ผ่าน API (เช่น `OPENAI_API_KEY` ที่มีอยู่) สำหรับการวิเคราะห์, ตรวจสอบ, และรีไรท์
- **Claude Plugin <-> Visual Explainer:** Plugin จะรวบรวมข้อมูลและสร้างโครงสร้างข้อมูลที่ `visual-explainer` ต้องการ จากนั้นใช้ `visual-explainer` เพื่อสร้างไฟล์ HTML Dashboard
- **Claude Plugin <-> Slack:**
  - **Incoming Webhooks:** สำหรับการส่งการแจ้งเตือนจาก Plugin ไปยัง Slack
  - **Events API:** สำหรับรับ Event จาก Slack (เช่น เมื่อมีข้อความใหม่ หรือมีการเรียกใช้ Slash Command)
  - **OAuth:** สำหรับการยืนยันตัวตนและขอสิทธิ์จากผู้ใช้ Slack

## 6. สรุป

แผนนี้ให้ภาพรวมที่ครอบคลุมของ Claude Writer Plugin ที่จะพัฒนาขึ้น โดยใช้ประโยชน์จากเทมเพลต `craft-portfolio-page` เป็นฐาน และผสานรวมความสามารถของ AI, Visual Dashboard และ Slack เพื่อสร้างเครื่องมือที่มีประสิทธิภาพสำหรับนักเขียน. ขั้นตอนต่อไปคือการเริ่มพัฒนาโครงสร้าง Plugin และ Skills ย่อยตามที่ได้วางแผนไว้.
