# Implementation Plan: db-unit-tests

## Phase 1: Setup & Infrastructure
- [x] Task: Configure Vitest for Mocking
    - [x] Create `server/__tests__/setup.ts` if needed
    - [x] Verify Vitest can correctly mock `drizzle-orm` and `mysql2`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Setup & Infrastructure' (Protocol in workflow.md)

## Phase 2: Database Query Unit Tests (`server/db.ts`)
- [x] Task: Test User and Outline Queries
    - [x] Write unit tests for `upsertUser`, `getUserByOpenId`, `getUserOutlines`, `getOutlineById`
- [ ] Task: Test Content Structure Queries
    - [ ] Write unit tests for Chapters and Scenes queries
- [x] Task: Test Workspace Queries (New P/N/T)
    - [x] Write unit tests for Projects, Notes, Tasks, and Lore queries
    - [x] **Crucial:** Test `userId` scoping for every query
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Database Query Unit Tests' (Protocol in workflow.md)

## Phase 3: Projects Router Unit Tests (`server/routers/projects.ts`)
- [x] Task: Test Router Logic
    - [x] Write unit tests for `list`, `get`, `create`, `update` procedures
    - [x] Mock `db.ts` calls to verify router-to-db interaction
- [x] Task: Test Error Handling and Validation
    - [x] Verify Zod validation fails for invalid inputs
    - [x] Verify `TRPCError` is thrown when resources are not found or unauthorized
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Projects Router Unit Tests' (Protocol in workflow.md)

## Phase 4: Coverage & Finalization
- [x] Task: Coverage Audit
    - [x] Run `npm test -- --coverage`
    - [x] Add missing test cases to reach 90% target
- [x] Task: Cleanup and Documentation
    - [x] Remove any debug code
    - [x] Add comments explaining test setup for future tracks
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Coverage & Finalization' (Protocol in workflow.md)
