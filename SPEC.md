# SPEC.md: Unified AI Workspace & Prompt Builder (Rust Engine Core)

## 1. วิสัยทัศน์และเป้าหมาย (Goal)
สร้างแอปพลิเคชันหนึ่งเดียวที่เป็น **Prompt Builder** และ **Agent Orchestrator** (สไตล์ Hermes/OpenClaw) โดยใช้ **Rust (Bams)** เป็นเครื่องยนต์หลักในการจัดการข้อมูลและ Logic ทั้งหมด เพื่อประสิทธิภาพสูงสุดและใช้อินฟราสตรัคเจอร์ที่เบาที่สุด

## 2. การเลือกส่วนประกอบและเทคโนโลยี (Tech Stack Selection)

### 2.1 เครื่องยนต์หลัก (The Engine)
*   **Rust (Bams):** รับหน้าที่เป็น **"จอมบงการ SQL"** จัดการ Raw SQL ทั้งหมด
*   **หน้าที่:** 
    *   จัดการ Sync ข้อมูลระหว่าง **SQLite (Local)** <-> **Postgres (Cloud/Infra)**
    *   เชื่อมต่อและดึงข้อมูลจาก **Convex** มาลงตารางข้อมูล
    *   รัน Agent และประกอบ Context สำหรับ Prompt

### 2.2 หน้าบ้าน (The UI)
*   **ibl1nk (React + Vite):** ใช้เป็นเพียง UI Shell สำหรับแสดงผล
*   **note-taker (Components):** หยิบเฉพาะ Markdown Editor และ Chat UI มาใช้
*   **tRPC:** ใช้เป็นท่อส่งคำสั่งจาก UI ไปหา Rust Engine (ผ่าน IPC หรือ Local HTTP)

### 2.3 สิ่งที่โละทิ้ง (The Cleanup)
*   **Drizzle ORM:** ตัดทิ้งทั้งหมด (ใช้ Raw SQL ใน Rust แทน)
*   **MySQL:** ตัดทิ้ง (ใช้ Postgres ของผู้ใช้)
*   **Next.js / Convex Backend:** ตัดทิ้ง (ใช้เฉพาะข้อมูลจาก Convex)

## 3. สถาปัตยกรรมข้อมูล (Data Architecture)
*   **Local Storage:** SQLite (ไฟล์เดี่ยว) เพื่อความเร็วในการเข้าถึงในเครื่อง
*   **Cloud Storage:** Postgres (Port 5432) เป็นหัวใจหลักของอินฟราสตรัคเจอร์
*   **Data Sync Logic:** เขียนด้วย Rust ในโปรเจกต์ Bams เพื่อความแม่นยำและเสถียร

## 4. แผนการผสาน (Integration Map)
1.  **Engine Consolidation:** ย้ายโค้ด Rust จาก `bams-workspace` เข้าสู่โฟลเดอร์ `engine/` ในโปรเจกต์หลัก
2.  **Raw SQL Implementation:** เขียนฟังก์ชันจัดการข้อมูลด้วย SQL ตรงๆ ใน Rust (ไม่ต้องผ่าน ORM)
3.  **UI Wiring:** ปรับ UI ให้ส่งคำสั่งผ่าน tRPC ไปยัง Rust Engine แทนการเขียน DB เองจากฝั่ง JS

## 5. การตรวจสอบความสำเร็จ (Acceptance Criteria)
1. ข้อมูลใน SQLite (Local) และ Postgres (Cloud) ตรงกันเสมอ
2. สามารถใช้ Prompt Builder คุม Agent ได้อย่างลื่นไหล
3. ไม่มีขยะจาก Drizzle หรือ MySQL หลงเหลือในระบบ
4. ระบบทำงานได้รวดเร็วภายใต้อินฟราสตรัคเจอร์ที่มีจำกัด
