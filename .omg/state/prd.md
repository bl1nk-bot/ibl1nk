# Product Requirements Document (PRD) - ibl1nk REST API & Advanced Tooling
**Status:** LOCKED
**Version:** 1.2

## 1. Objective
พัฒนาและติดตั้งระบบ **RESTful API v1**, **Native Skill System**, **Text Editor Tool**, และ **Memory Tool** สำหรับโปรเจกต์ `ibl1nk` โดยอ้างอิงมาตรฐาน Anthropic API เพื่อรองรับการจัดการเนื้อหา (Story Management) และการขยายความสามารถผ่าน AI Agents ที่รันใน Sandbox ได้อย่างปลอดภัยและมีประสิทธิภาพ

## 2. Acceptance Criteria
### Core API & Auth
- [ ] Endpoint `GET/POST/PATCH/DELETE` สำหรับ `projects`, `outlines`, `chapters`, `scenes` ทำงานร่วมกับ Drizzle ORM
- [ ] ระบบ Auth รองรับทั้ง `Bearer JWT` และ `X-API-Key` (สำหรับ External/Plugins)
- [ ] Error Response มีโครงสร้างมาตรฐาน (`code`, `message`, `request_id`)

### Advanced Editor & Memory Tools (Anthropic-Compatible)
- [ ] **Text Editor Tool (`str_replace_based_edit_tool`):**
    - ติดตั้ง Command: `view`, `str_replace`, `create`, `insert`
    - `str_replace` ต้องเป็น Unique Match เท่านั้น (สกัดกั้นการแก้ไขผิดตำแหน่ง)
    - `view` ต้องคืนค่าบรรทัด (Line numbers) เพื่อความแม่นยำ
- [ ] **Memory Tool:**
    - ติดตั้ง Command: `view`, `create`, `str_replace`, `insert`, `delete`, `rename`
    - จำกัดขอบเขตการทำงานเฉพาะในไดเรกทอรี `/memories` และมีการป้องกัน Path Traversal
- [ ] **Skill System:**
    - `POST /v1/skills`: สร้าง Skill จากชุดไฟล์ (ต้องมี `SKILL.md`)
    - **Sandbox Execution:** รันโค้ดในสภาพแวดล้อมจำกัด (Isolated VM) พร้อมระบบ Timeout และ Memory Limit

## 3. Non-goals
- การสร้าง Web UI สำหรับจัดการความจำ (Memory Visualization) ในเฟสนี้
- การทำ Marketplace สำหรับ Skills (เน้น Local/Manual Deployment)

## 4. Constraints
- **Stack:** Express.js, Drizzle ORM (MySQL), Node `vm2` หรือ `worker_threads` สำหรับ Sandbox
- **Security:** ปฏิบัติตามหลัก Zero Data Retention (ZDR) readiness
- **Resource Limit:** Sandbox จำกัด Memory 128MB / Time 30s

## 5. Risk Factors
- **Sandbox Breakout:** ความเสี่ยงในการเจาะระบบจากภายใน Sandbox (ต้องใช้ Library ที่ Security-Hardened)
- **Concurrency:** การเข้าถึงไฟล์ซ้ำซ้อนจากหลาย Editor/Memory calls (ต้องมี File Locking หรือ Queue)

## 6. Verification Method
- **Skill/Editor Integration Test:** รันชุดคำสั่งจำลองการสร้าง Skill -> แก้ไขไฟล์ -> รันโค้ดใน Sandbox และตรวจสอบผลลัพธ์
- **Isolation Test:** ทดสอบรันโค้ดประสงค์ร้ายใน Sandbox และต้องถูกสกัดกั้น
- **API Functional Test:** ใช้ `vitest` ตรวจสอบความถูกต้องของทุก Endpoints หลัก
