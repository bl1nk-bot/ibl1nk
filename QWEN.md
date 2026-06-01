# ibl1nk Project Context

## Project Overview

**ibl1nk** is a **Writing Management Dashboard** — an all-in-one platform for novelists that combines:
- Story outline & chapter management
- Character tracking with relationship maps
- AI-powered content analysis (sentiment, keywords, grammar, hooks)
- External tool sync (Craft.io, Obsidian, Slack)
- Visual dashboards with charts & Mermaid diagrams

**Tech Stack:**
- **Frontend:** React 19, Vite 7, Tailwind CSS 4, shadcn/ui, Radix UI
- **Backend:** Express.js, tRPC 11
- **Database:** MySQL (Drizzle ORM)
- **Auth:** Manus OAuth
- **Build:** esbuild (server), Vite (client)
- **Package Manager:** pnpm

**Architecture:** Monorepo with Express + tRPC backend serving a React SPA via Vite (dev) or static files (prod).

---

## Directory Structure

```
ibl1nk/
├── client/              # React frontend (Vite root)
│   └── src/             # Components, pages, hooks
├── server/              # Express + tRPC backend
│   ├── _core/           # Core server setup (index.ts, oauth, context, vite)
│   ├── routers/         # tRPC routers (API endpoints)
│   └── _core/pluginsdk/ # Plugin SDK implementation (7 files)
├── shared/              # Shared types & utilities
├── drizzle/             # Database schema & migrations
│   ├── schema.ts        # Drizzle schema definitions
│   └── migrations/      # SQL migration files
├── packages/            # Internal packages
│   └── plugin-sdk/      # Plugin SDK package (incomplete — no src/)
├── plugins/             # Built-in plugins
│   ├── command-creator/ # Skill for creating commands
│   ├── ibl1nk/          # Main ibl1nk plugin skill
│   └── ...              # Other plugins
├── conductor/           # Conductor workflow files
│   ├── index.md         # Conductor index
│   ├── standards/       # Plugin architecture standards
│   └── templates/       # Plugin config & component templates
├── tests/               # Test files
│   └── pluginsdk/       # Plugin SDK tests
├── docs/                # Documentation
│   ├── QWEN.md          # Qwen Code guidelines (project-specific)
│   └── work-log.csv     # Task tracking with emoji status
├── .omg/                # OmG extension config
│   ├── MEMORY.md        # Project memory & learned rules
│   ├── hooks.json       # Workflow hooks (session/task lifecycle)
│   └── rules/learned/   # 6 learned behavioral rules
├── resources/           # Config files & schemas
├── scripts/             # Utility scripts
└── skills/              # Available skills
```

---

## Key Commands

### Development
```bash
pnpm install          # Install dependencies
npm run dev           # Start dev server (Vite + Express hot reload)
npm run db:push       # Generate & apply Drizzle migrations
```

### Build & Production
```bash
npm run build         # Build client (Vite) + server (esbuild) → dist/
npm run start         # Run production server
```

### Testing & Quality
```bash
npm run test          # Run tests with Vitest
npm run check         # TypeScript type checking
npm run format        # Format code with Prettier
```

---

## Engineering Standards

### Security
- **IDOR Protection:** All DB queries & tRPC procedures must verify `userId` ownership
- **Error Handling:** Use `TRPCError` with bilingual messages (TH/EN) + error codes
- **Format:** `ไม่พบโปรเจกต์นี้ (30001) / Project not found (30001)`

### Testing
- **TDD approach**, target >80% coverage (focus: DB logic + tRPC routers)
- Tests live in `tests/` directory
- Use Vitest as primary test runner

### Code Organization
- **Single Responsibility Principle** for components
- Custom hooks for state & API calls
- Mobile-first UI design

---

## Workflow & Conventions

### Session Lifecycle (from `.omg/hooks.json`)
1. **Session Start:** Read `.omg/MEMORY.md` → Read `todo.md`
2. **Task Received:** Append to `todo.md` (never overwrite)
3. **Task Complete:** Update todo → Verify → Biome lint → Vitest → Build → Write WORK-LOG

### Work Tracking
- **`docs/work-log.csv`** — CSV with emoji status tracking
  - ⬜ ค้าง (pending) | 🟡 แก้ไข (needs fix) | 🔴 ปัญหา (problem)
  - 🟢 รอดูรีวิว (ready for review) | 🔵 รีวิวแล้ว (reviewed — user sets) | 🟠 Tool error
- **`docs/WORK-LOG.md`** — Markdown summary of completed work
- **`todo.md`** — Current task list (append only)

### JSDoc Standards
- **Incomplete work:** `// TODO: <description>`
- **Completed work:** Full JSDoc with `@module`, `@description`, `@param`, `@returns`, `@done`, `@tested`, `@status`
- Every touched file gets JSDoc header

### Plugin Architecture
- Plugins are built-in (integrated into Manus system)
- Each plugin needs `bl1nk.jsonc` config in its directory
- Plugin SDK lives in `server/_core/pluginsdk/` (7 files)
- Tests in `tests/pluginsdk/` (4 test files)
- **Note:** `packages/plugin-sdk/` is incomplete (tests exist but no `src/` — do not use)

---

## Database Migrations

Naming convention (~3 syllables):
- `001_user_base.sql` — User auth
- `002_writer_core.sql` — Outlines, chapters, scenes, characters
- `003_analysis_log.sql` — Content analysis & stats
- `004_external_sync.sql` — Obsidian & Craft sync
- `005_workspace_mod.sql` — Projects, notes, tasks, lore

---

## Current Status

**Phase 1 (Completed):** ✅ DB schema + Backend API + Dashboard UI + Projects/Notes/Tasks
**Phase 2 (In Progress):** Testing + Bug fixes + UI refinement
**Phase 3-7 (Pending):** Craft/Obsidian sync, AI analysis, Slack, Plugin integration, Deployment

See `todo.md` for detailed task breakdown.

---

## Important Notes for Agents

1. **Output language:** Thai (unless user requests otherwise)
2. **Technical artifacts:** Never translate code, paths, identifiers, or tool output
3. **Before creating files:** Always `glob` to check for existing similar files first
4. **No duplicate structures:** Do not create copies/standalone versions without explicit instruction
5. **Always confirm plan** before starting implementation
6. **Update work-log** after completing any task
7. **Trust user input:** If user says something exists but you can't find it, search more carefully before concluding
