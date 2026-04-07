# Implementation Plan: ibl1nk Integration

## Phase 1: Project Rename & Cleanup
- [x] Task: Rename Project to `ibl1nk`
    - [x] Update `package.json` and `pnpm-lock.yaml`
    - [x] Update `vite.config.ts` and `vitest.config.ts`
    - [x] Search and replace `claude-writer` with `ibl1nk` in imports, comments, and strings
- [x] Task: Remove Firebase Dependencies
    - [x] Uninstall `firebase`, `firebase-admin`, and related packages
    - [x] Remove all Firebase configuration files and imports from the codebase
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Project Rename & Cleanup' (Protocol in workflow.md)

## Phase 2: Database Schema & Backend Routers
- [ ] Task: Extend Database Schema
    - [ ] Add `projects` table (isolated context for notes/tasks/lore)
    - [ ] Add `notes` table (linked to `projects` and optionally `outlines`)
    - [ ] Add `tasks` table (linked to `projects` and `outlines`)
    - [ ] Add `loreEntries` table (linked to `projects`)
    - [ ] Add `plotOutlineNodes` table (linked to `outlines`)
    - [ ] Update `drizzle/relations.ts` to reflect new connections
- [ ] Task: Implement Backend Routers (TDD)
    - [ ] Write unit tests for `projectsRouter`
    - [ ] Implement `projectsRouter` CRUD operations
    - [ ] Write unit tests for `notesRouter` (including search and link parsing)
    - [ ] Implement `notesRouter`
    - [ ] Write unit tests for `tasksRouter` (including subtasks and AI generation)
    - [ ] Implement `tasksRouter`
    - [ ] Write unit tests for `loreRouter` (including relationships)
    - [ ] Implement `loreRouter`
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Database Schema & Backend Routers' (Protocol in workflow.md)

## Phase 3: Frontend Integration & NoteTaskApp Migration
- [ ] Task: Migrate `NoteTaskApp` to Dashboard Page
    - [ ] Move `NoteTaskApp.tsx` logic to `client/src/pages/NoteTaskApp.tsx` (using existing components)
    - [ ] Integrate the new page into `DashboardLayout.tsx`
    - [ ] Update Routing in `client/src/App.tsx`
- [ ] Task: Connect `NoteTaskApp` to tRPC
    - [ ] Replace all LocalStorage and Firebase logic with tRPC hooks
    - [ ] Implement global project switching and isolation logic
- [ ] Task: Enhance AI Chat Box
    - [ ] Connect `AIChatBox.tsx` to the backend via tRPC
    - [ ] Update the AI service to inject scene, character, and lore context from the dashboard
- [ ] Task: Mobile-First UI/UX Audit & Refinement
    - [ ] Audit all new and migrated pages for mobile responsiveness
    - [ ] Refine layouts, touch targets, and navigation for small screens
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Frontend Integration & NoteTaskApp Migration' (Protocol in workflow.md)
