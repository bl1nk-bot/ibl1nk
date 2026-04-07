# Initial Concept

Claude Writer Dashboard - แพลตฟอร์มจัดการงานเขียนสำหรับนักเขียนนิยาย ที่รวมการจัดการโครงเรื่อง ตัวละคร การวิเคราะห์เนื้อหาด้วย AI และการซิงค์กับเครื่องมือภายนอก (Craft, Obsidian, Slack) ไว้ในที่เดียว

---

# Product Guide

## Vision
แพลตฟอร์มจัดการงานเขียน all-in-one สำหรับนักเขียนนิยาย ที่เปลี่ยนจากการใช้เครื่องมือหลายตัว (Obsidian, Craft, AI chat, task manager) มาอยู่ในที่เดียว พร้อม AI ที่เข้าใจบริบทงานเขียน

## Target Users
- **นักเขียนนิยาย** (solo writers) ที่ต้องการจัดระเบียบงานเขียน ติดตามความคืบหน้า และวิเคราะห์คุณภาพเนื้อหา
- **Editors/Reviewers** ที่ต้องการตรวจสอบและให้ feedback บนงานเขียน
- **Writing Teams** ที่ต้องการ collaborate และแจ้งเตือนความคืบหน้าผ่าน Slack

## Core Features

### 1. Story Structure Management (มีอยู่แล้ว)
- จัดการ **Outlines → Chapters → Scenes** แบบลำดับชั้น
- ติดตามสถานะแต่ละส่วน (planning, writing, reviewing, completed)
- นับจำนวนคำ (word count) อัตโนมัติ
- Story overview stats และ visualization

### 2. Character Tracking (มีอยู่แล้ว)
- ฐานข้อมูลตัวละครพร้อม traits, role, description
- ระบบความสัมพันธ์ระหว่างตัวละคร (relationship map)
- แผนผังความสัมพันธ์แบบ interactive (Mermaid graph)
- หลายมุมมอง: Grid, List, Gallery, Graph View

### 3. Notes & Lore Management (จาก NoteTaskApp)
- **Notes System** - สร้าง/แก้ไข/ดู notes พร้อม rich text
  - `[[WikiLinks]]` syntax เชื่อมโยงระหว่าง notes (คล้าย Obsidian)
  - Categorization และ tagging
  - Version history (เก็บประวัติการแก้ไข)
  - Cover images และ icons
- **Lore/World Building** - จัดการ lore entries สำหรับ worldbuilding
  - Types: Concept, Location, Faction, Magic System, Technology, etc.
  - Character arcana และ relationship mapping
  - Project-scoped lore (แยกตามเรื่อง)
- **Plot Outline Manager** - Tree structure สำหรับ plot points
  - Link ไป notes และ lore entries
  - Hierarchical organization

### 4. Task Management (จาก NoteTaskApp)
- **Tasks + Subtasks** พร้อม priority levels และ due dates
- **AI-Generated Subtasks** - แตก task ย่อยอัตโนมัติผ่าน AI
- **Pomodoro Timer** - จับเวลา writing sessions
  - Configurable work/break intervals
  - Round tracking
- **Writing Progress Logger** - บันทึก daily stats (words, sessions)
- **Task Focus Page** - โหมดโฟกัสสำหรับทำงาน

### 5. AI Writer (จาก NoteTaskApp + ปรับปรุง)
- **Chat-Style AI Assistant** -คุยกับ AI สำหรับเขียน/วิเคราะห์/แนะนำ
- **Multiple Operation Modes** - เขียน, วิเคราะห์, สรุป, rewrite
- **Context-Aware Prompts** - AI เข้าใจบริบทจาก notes/lore/characters/scenes
- **Learned Words Tracking** - ติดตามคำที่ใช้บ่อย
- **Multiple AI Models** - รองรับหลาย providers
- **AI Content Analysis**:
  - Sentiment analysis ของแต่ละ scene
  - Keyword extraction และ density analysis
  - Grammar & spell check
  - Hook detection (passage ที่ดึงดูดความสนใจ)
  - Theme & conflict identification
  - Significance scoring (scene ไหนสำคัญที่สุด)
  - Rewriting suggestions

### 6. Canvas & Whiteboard (มีอยู่แล้ว)
- Drag-and-drop canvas สำหรับจัดเรียงไอเดีย
- Undo/Redo support
- Save to Craft, Export/Import JSON

### 7. External Integrations (pending)
- **Craft.io:** ซิงค์โครงเรื่องและเนื้อหาไปยัง Craft Collections/Documents
- **Obsidian:** อ่านและซิงค์ Markdown files จาก Obsidian vault แบบ bidirectional
- **Slack:** แจ้งเตือนความคืบหน้า, slash commands (`/ibl1nk analyze`, `/dashboard`)
- **S3 Storage:** backup อัตโนมัติ, export dashboard/story เป็น HTML/PDF

### 8. Visual Dashboard (มีอยู่แล้ว + เพิ่ม)
- Writing progress chart (words/day, weekly stats, streak)
- Story overview stats
- Character relationship map
- Content analysis summary cards
- Error/correction statistics
- **Project Dashboard** (จาก NoteTaskApp) - analytics ในระดับ project
- **Content Analytics** - วิเคราะห์แนวโน้มและ patterns

### 9. Projects (จาก NoteTaskApp)
- จัดการหลาย projects พร้อมกัน
- Active project switching
- Project isolation สำหรับ notes/tasks/lore
- Project summary และ stats

### 10. Settings & Preferences
- Theme selection (dark/light themes)
- Font selection (Thai font support - Sarabun, etc.)
- Notification preferences
- AI writer preferences (provider, model, API keys)
- Export templates
- Integration settings (Craft, Obsidian, Slack)

## Technical Architecture

### Current Stack
```
Frontend: React 19 + Vite 7 + TypeScript (strict)
UI: Tailwind CSS 4 + shadcn/ui (Radix UI)
State: tRPC + React Query
Backend: Express.js + tRPC routers
Database: MySQL (Drizzle ORM)
Auth: Manus OAuth
Storage: AWS S3
Testing: Vitest
Package Manager: pnpm
```

### AI Architecture (ใหม่)
```
Frontend AI Chat
    ↕
Vercel AI SDK (ai package)
    ↕
Vercel AI Gateway
    ↕
┌──────────┬──────────┬─────────────┐
│ OpenAI   │ Gemini   │ Anthropic   │ (และ providers อื่นๆ)
└──────────┴──────────┴─────────────┘
```

### Storage
- **Primary:** MySQL (Drizzle ORM) - ข้อมูลทั้งหมด
- **Backup:** AWS S3 - backups, exports, snapshots
- **No Firebase** - ใช้ระบบเดิมทั้งหมด

## Design Guidelines
- **Mobile-first** ออกแบบสำหรับมือถือก่อน แล้วค่อยขยายเป็น tablet/desktop
- **Editorial/Minimalist style** เรียบง่าย โฟกัสที่เนื้อหา
- **Responsive** รองรับหน้าจอทุกขนาด
- **Dark/Light mode** ผ่าน next-themes + custom themes
- **Thai Font Support** - Sarabun, Noto Sans Thai, etc.

## Current Status

### ✅ มีอยู่แล้ว ( implemented)
- Database schema ครบถ้วน (10 tables)
- tRPC routers สำหรับ outlines และ characters
- Frontend pages พื้นฐาน (Dashboard, Outlines, Characters, Settings)
- Multiple view modes (Grid, List, Gallery, Graph, Canvas)
- NoteTaskApp component (notes, tasks, AI writer, lore, projects, plot outlines)
- AI Chat Box component

### ⏳ ยังไม่มี (pending)
- Craft API integration (OAuth + sync)
- Obsidian vault sync
- Slack integration + notifications
- Search functionality (full-text)
- S3 backup/export
- Vercel AI SDK integration + AI gateway
- Content analysis features (sentiment, grammar, hooks)
- Writing progress tracking UI
- Publishing Hub
- Graph View สำหรับ note linking
- API Key management UI
