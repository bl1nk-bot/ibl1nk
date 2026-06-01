# ibl1nk Development Work Log

## 2026-04-10 — REST API Foundation & Project CRUD

### สิ่งที่ทำ (Done)
- ✅ **API Foundation:** ติดตั้ง `/v1` Router ใน `server/_core/index.ts` และ `server/v1_router.ts`
- ✅ **Authentication:** Middleware รองรับทั้ง Session (sdk.authenticateRequest) และ API Key (ENV.apiAuthSecret)
- ✅ **Environment & Config:** สร้าง `resources/api-v1-config.jsonc` และอัปเดต `server/_core/env.ts`
- ✅ **Project API:** CRUD สำหรับจัดการ Workspace พร้อม User Isolation ใน `server/v1/projects.ts`
- ✅ **Modal Integration:** สร้าง `server/_core/modal.ts` สำหรับรัน Cloud Sandboxes

### สิ่งที่พักไว้ (Paused/Non-goals)
- ❌ **Legacy Content API:** ยกเลิกการทำ REST สำหรับ Outline/Chapter/Scene แบบตาราง (จะเปลี่ยนเป็น Block-based JSON แทน)

### สิ่งที่ต้องทำต่อไป (Next Steps)
- 🚀 **UI Implementation:** เริ่มออกแบบหน้าจอ Mobile-first สำหรับ Project Dashboard หรือ Block-based Editor
- 🏗️ **Block Engine:** พัฒนาตัวจัดการ JSON Schema สำหรับเนื้อหาที่แสดงผลแบบ Obsidian

### Evidence
- Config: `resources/api-v1-config.jsonc`
- Router: `server/v1_router.ts`
- Project API: `server/v1/projects.ts`
- Modal: `server/_core/modal.ts`
