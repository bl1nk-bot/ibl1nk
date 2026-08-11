# Product Guidelines

## UX/UI Principles

### Mobile-First Design

- ออกแบบสำหรับหน้าจอขนาดเล็ก (360px - 414px) เป็นลำดับแรก
- ทุก page/component ต้องใช้งานได้เต็มที่บนมือถือ
- ค่อยขยายเป็น tablet (768px+) และ desktop (1024px+)
- Touch targets อย่างน้อย 44x44px

### Editorial Aesthetic

- **Minimalist & Clean** - โฟกัสที่เนื้อหา ลด distraction
- **Typography-Driven** - ตัวอ่านอ่านง่ายเป็น priority #1
- **Whitespace** - ใช้ช่องว่างให้เป็นประโยชน์ ไม่แออัด
- **Subtle Animations** - นุ่มนวล ไม่รบกวนสมาธิ

### Thai Language Support

- รองรับ Thai fonts: Sarabun, Noto Sans Thai, IBM Plex Thai
- Line height เพียงพอสำหรับวรรณยุกต์ไทย
- Text rendering ไม่ตัดวรรณยุกต์หาย
- UI labels และ messages รองรับภาษาไทย-อังกฤษ

### Writer-Focused UX

- **Distraction-Free Mode** - ซ่อน UI ที่ไม่จำเป็นเมื่อเขียน
- **Auto-Save** - บันทึกอัตโนมัติทุกการเปลี่ยนแปลง
- **Keyboard Shortcuts** - สำหรับ power users
- **Undo/Redo** ทุกที่ - ไม่มีทางเสียงาน
- **Loading States** - แสดง skeleton/progress ชัดเจน
- **Error Recovery** - กู้คืนข้อมูลได้เสมอ

## Branding & Tone

### Voice & Tone

- **Professional but Warm** - เป็นทางการแต่เป็นกันเอง
- **Encouraging** - ให้กำลังใจนักเขียน ไม่ตัดสิน
- **Clear & Concise** - ตรงไปตรงมา ไม่อ้อมค้อม
- **Thai-First** - ตอบกลับและแสดงผลเป็นภาษาไทยก่อน (ถ้าผู้ใช้ใช้ไทย)

### Visual Identity

- **Color Palette:** Editorial tones - cream/paper backgrounds, dark text, accent colors สำหรับ status
- **Dark Mode:** ต้องอ่านสบายตา ไม่สว่าง/มืดเกินไป
- **Icons:** Lucide React - สม่ำเสมอทั้งระบบ
- **No Cartoonish Elements** - ดูเป็นเครื่องมือมืออาชีพ

## Code Quality Standards

### TypeScript Strict Mode

- เปิด `strict: true` ใน tsconfig.json
- หลีกเลี่ยง `any` - ใช้ `unknown` หรือ type ที่ชัดเจน
- Export types จาก `shared/types.ts` เป็น single source of truth

### Component Architecture

- **Atomic Design** - atoms → molecules → organisms → pages
- **Composition over Inheritance** - ใช้ composition patterns
- **Custom Hooks** - แยก logic ออกจาก UI
- **Server/Client Separation** - แยกชัดเจนระหว่าง server components และ client components

### API Design (tRPC)

- **Protected Procedures** ทุก route ที่ต้องการ auth
- **Zod Validation** ทุก input/output
- **Error Handling** ชัดเจน มี error codes และ user-friendly messages
- **Pagination** สำหรับ large datasets

### Database (Drizzle)

- **Relations ชัดเจน** - Foreign keys, cascade deletes
- **Indexes** บนคอลัมน์ที่ query บ่อย (userId, outlineId, characterId)
- **Migrations** เป็นลำดับ ไม่แก้ไข migration ที่มีอยู่
- **Type Safety** ใช้ `$inferSelect` และ `$inferInsert`

### Testing

- **Unit Tests** สำหรับ business logic, utilities, helpers
- **Integration Tests** สำหรับ workflows (create outline → add chapters → sync)
- **E2E Tests** สำหรับ user flows สำคัญ
- **Coverage Target:** >80%

## Performance Guidelines

### Frontend

- **Code Splitting** แยกตาม routes
- **Lazy Loading** components ที่หนัก (graphs, canvas, AI chat)
- **Memoization** ใช้ useMemo/useCallback เมื่อจำเป็น
- **Optimistic Updates** สำหรับ instant feedback

### Backend

- **Query Optimization** - หลีกเลี่ยง N+1 queries
- **Caching** - cache analysis results (1hr), dashboard data (30min), character relationships (5min)
- **Batch Operations** - รวม queries ที่เกี่ยวข้องกัน

## Accessibility

- **Semantic HTML** - ใช้ correct elements (button, nav, main, article)
- **ARIA Labels** - สำหรับ interactive elements ที่ไม่ชัดเจน
- **Color Contrast** - WCAG AA minimum
- **Keyboard Navigation** - ใช้งานได้ทั้งหมด tanpa mouse
- **Screen Reader** - ทดสอบกับ VoiceOver/TalkBack

## Security

- **No Secrets in Client** - API keys, credentials อยู่ server เท่านั้น
- **Input Sanitization** - ป้องกัน XSS ใน rich text content
- **CSRF Protection** - ทุก mutation ต้องมี CSRF token
- **Rate Limiting** - ป้องกัน abuse บน AI endpoints
- **Data Isolation** - ผู้ใช้เห็นเฉพาะข้อมูลของตัวเอง (userId scoping)

## Internationalization (i18n)

- **Thai + English Support** - bilingual
- **String Externalization** - ไม่ hardcode strings ใน components
- **Date/Time Formatting** - ใช้ locale-appropriate formats
- **Number Formatting** - รองรับทั้งไทยและอังกฤษ
