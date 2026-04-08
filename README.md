# ibl1nk - Writing Management Dashboard

แพลตฟอร์มจัดการงานเขียน all-in-one สำหรับนักเขียนนิยาย ที่รวมการจัดการโครงเรื่อง ตัวละคร การวิเคราะห์เนื้อหาด้วย AI และการซิงค์กับเครื่องมือภายนอก (Craft, Obsidian, Slack) ไว้ในที่เดียว

## 🚀 Getting Started

1. **Setup Environment:**
   ```bash
   cp .env.example .env
   # Update DATABASE_URL and other keys
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Database Migration:**
   ```bash
   npm run db:push
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

## 🏗 Engineering Standards & Best Practices

โครงการนี้ยึดหลักมาตรฐานการพัฒนาที่เข้มงวดเพื่อความปลอดภัยและความยั่งยืนของโค้ด:

### 1. ความปลอดภัย (IDOR Protection)
- ทุก Query ใน Database และ tRPC Router ต้องมีการตรวจสอบสิทธิ์เจ้าของข้อมูลผ่าน `userId` เสมอ
- ห้ามใช้เพียง ID ที่ส่งมาจาก Client ในการเข้าถึงข้อมูลโดยไม่มีการ Verify ความเป็นเจ้าของ

### 2. การจัดการข้อผิดพลาด (Standardized Error Handling)
- ใช้ `TRPCError` พร้อมรหัสข้อผิดพลาดและข้อความแจ้งเตือน 2 ภาษา (ไทย/อังกฤษ)
- รูปแบบ: `ไม่พบโปรเจกต์นี้ (30001) / Project not found (30001)`

### 3. การทดสอบ (Automated Testing)
- ยึดหลัก **Test-Driven Development (TDD)**
- เป้าหมาย Code Coverage >80% (เน้นที่ Database logic และ tRPC Routers)

### 4. โครงสร้างคอมโพเนนต์ (Modularization)
- แยก UI Logic ออกเป็นคอมโพเนนต์ย่อยตามหลัก **Single Responsibility Principle (SRP)**
- ใช้ Custom Hooks สำหรับจัดการ State และ API Calls

## 📂 Project Resources

- [System Settings & Permission Schema](./resources/bl1nk-setting.jsonc) - แหล่งอ้างอิงความจริง (Source of Truth) ของฟีเจอร์และสิทธิ์ในระบบ
- [Security Policy](./SECURITY.md) - นโยบายความปลอดภัยและมาตรฐานการพัฒนา
- [License](./LICENSE) - MIT License

---

## 🛠 Tech Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 4, shadcn/ui
- **Backend:** Express.js, tRPC 11
- **Database:** MySQL (Drizzle ORM)
- **Auth:** Manus OAuth
- **AI:** Vercel AI SDK

## 📋 Status & Roadmap

ดูรายละเอียดความคืบหน้าได้ที่ [todo.md](./todo.md)
