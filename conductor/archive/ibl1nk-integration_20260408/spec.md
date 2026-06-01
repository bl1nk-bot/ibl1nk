# Track Specification: ibl1nk-integration_20260408

## Overview
ปรับปรุง `NoteTaskApp.tsx` และ `AIChatBox.tsx` ให้ integrate กับ Claude Writer Dashboard (ปัจจุบันเป็น outlines/characters/scenes) และเปลี่ยนชื่อโปรเจคเป็น **ibl1nk**

## Objectives
1. เปลี่ยนชื่อโปรเจคจาก `claude-writer-dashboard` เป็น `ibl1nk` ทุกที่ที่เกี่ยวข้อง
2. เชื่อมต่อ NoteTaskApp เข้ากับระบบ outlines/characters/scenes ที่มีอยู่
3. ปรับ AI Chat Box ให้ใช้ tRPC และ context จาก dashboard
4. สร้าง database schema สำหรับ notes, tasks, lore ที่เชื่อมกับ outlines
5. สร้าง tRPC routers สำหรับ notes, tasks, lore CRUD
6. ลบ Firebase dependencies ที่ไม่ใช้แล้ว
7. ปรับ UI/UX ให้เป็น mobile-first เหมือนหน้าอื่นๆ

## Scope

### In Scope
- Rename project: package.json, vite.config.ts, imports, comments
- Database: เพิ่ม tables สำหรับ notes, tasks, lore, plotOutlines (เชื่อมกับ outlines/characters)
- Backend: tRPC routers สำหรับ notes, tasks, lore, projects
- Frontend: ปรับ NoteTaskApp ให้เป็น page ใน dashboard (ไม่ใช่ standalone app)
- AI Chat Box: เชื่อมกับ tRPC procedures และ scene/character context
- ลบ Firebase imports และ dependencies
- Mobile-first responsive design

### Out of Scope
- Craft API integration (จะทำใน track ต่อไป)
- Obsidian sync (จะทำใน track ต่อไป)
- Slack integration (จะทำใน track ต่อไป)
- Vercel AI SDK setup (จะทำใน track แยก)

## Technical Approach

### Database Changes
```
เพิ่ม tables:
- notes (เชื่อมกับ userId, outlineId)
- tasks (เชื่อมกับ userId, outlineId)
- loreEntries (เชื่อมกับ userId, outlineId)
- projects (แยกต่างหาก, outlines เชื่อมได้)
- plotOutlineNodes (เชื่อมกับ outlineId)
- userTemplates (เชื่อมกับ userId)
```

### Backend Changes
```
เพิ่ม tRPC routers:
- notesRouter (CRUD + search + link parsing)
- tasksRouter (CRUD + subtasks + AI generation)
- loreRouter (CRUD + relationships)
- projectsRouter (CRUD + stats)
```

### Frontend Changes
```
- แปลง NoteTaskApp จาก standalone app เป็น page component
- ปรับ routing ให้เข้ากับ dashboard layout
- เชื่อม tRPC procedures แทน localStorage
- ลบ Firebase config และ imports
- ปรับให้เป็น mobile-first
```

## Success Criteria
- [ ] Project rename สำเร็จ ทุกที่เปลี่ยนเป็น ibl1nk
- [ ] Notes สร้าง/อ่าน/แก้ไข/ลบ ได้ผ่าน tRPC
- [ ] Tasks สร้าง/แก้ไข/ลบ ได้ พร้อม subtasks
- [ ] Lore entries สร้าง/แก้ไข/ลบ ได้
- [ ] AI Chat Box ใช้งานได้ พร้อม context จาก scenes/characters
- [ ] ไม่มี Firebase imports เหลืออยู่
- [ ] Mobile responsive ทุกหน้า
- [ ] Tests ผ่าน >80% coverage
