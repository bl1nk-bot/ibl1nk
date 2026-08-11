# Workflow

## Development Workflow

### Test-Driven Development (TDD)

- **เขียน tests ก่อน** implementation สำหรับทุก feature ใหม่
- **Coverage Requirement:** >80% test code coverage
- **Test Types:**
  - Unit tests สำหรับ utilities, helpers, business logic
  - Integration tests สำหรับ workflows
  - E2E tests สำหรับ user flows สำคัญ

### Git Workflow

- **Feature Branches** - แยก branch สำหรับแต่ละ feature/task
- **Commit per Task** - commit เมื่อเสร็จแต่ละ task
- **Conventional Commits:**
  - `feat:` - feature ใหม่
  - `fix:` - bug fix
  - `refactor:` - refactor โดยไม่เปลี่ยน behavior
  - `docs:` - documentation
  - `test:` - เพิ่มหรือแก้ tests
  - `chore:` - maintenance tasks
- **Commit Messages:** ใช้ imperative mood ("add", "fix", "update" ไม่ใช่ "added", "fixed")

### Phase Completion Verification and Checkpointing Protocol

เมื่อเสร็จแต่ละ phase:

1. **รัน tests ทั้งหมด** - ต้องผ่าน 100%
2. **Type check** - `tsc --noEmit` ไม่มี errors
3. **Lint/format** - `prettier --write .` แล้วไม่มี issues
4. **Build check** - `npm run build` สำเร็จ
5. **Manual verification** - ทดสอบ feature ใน browser
6. **Commit with summary** - commit พร้อมระบุสิ่งที่ทำใน phase
7. **Update plan.md** - tick tasks ที่เสร็จแล้ว

### Code Review Checklist

ก่อน merge ทุกครั้ง:

- [ ] Tests ผ่านทั้งหมด
- [ ] Type checking ไม่มี errors
- [ ] Code formatted ถูกต้อง
- [ ] No console.log หรือ debug code
- [ ] No hardcoded secrets/API keys
- [ ] Error handling ครบถ้วน
- [ ] User-facing messages เป็นภาษาไทย (ถ้ามี)
- [ ] Mobile responsive
- [ ] Accessibility basics ตรวจสอบแล้ว

## Project Structure Conventions

```
client/src/
├── components/     # Reusable UI components
├── pages/          # Route-level pages
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── contexts/       # React contexts
└── _core/          # Core app setup

server/
├── _core/          # Server setup (Express, tRPC, auth)
├── routers/        # tRPC routers (แยกตาม domain)
└── lib/            # Server utilities

shared/
├── _core/          # Shared utilities
├── types.ts        # Type exports (single source)
└── const.ts        # Shared constants

drizzle/
├── schema.ts       # Database schema
├── migrations/     # SQL migrations
└── relations.ts    # Table relationships
```

## File Naming Conventions

- **Components:** PascalCase (e.g., `CharacterGraphView.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useCharacterRelationships.ts`)
- **Utilities:** camelCase (e.g., `formatDate.ts`, `parseNoteLinks.ts`)
- **Types:** PascalCase (e.g., `AppNote`, `CharacterRelationship`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_CHAT_EXCHANGES`)
- **Database tables:** camelCase (Drizzle convention)

## API Conventions

- **tRPC Procedures:** ใช้ `protectedProcedure` สำหรับ routes ที่ต้องการ auth
- **Validation:** Zod schema ทุก input/output
- **Error Messages:** User-friendly เป็นภาษาไทยหรืออังกฤษที่เข้าใจง่าย
- **Error Codes:** Numeric codes สำหรับ programmatic handling (เช่น 10001 = not authenticated)

## Documentation

- **Code Comments:** อธิบาย "ทำไม" ไม่ใช่ "ทำอะไร"
- **Thai Educational Comments:** เพิ่ม comments ภาษาไทยสำหรับ beginners ในไฟล์ที่ซับซ้อน
- **README:** อัปเดตเมื่อมี feature ใหม่หรือเปลี่ยน architecture
