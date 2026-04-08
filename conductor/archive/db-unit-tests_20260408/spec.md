# Track Specification: db-unit-tests

## Overview
Implement comprehensive unit tests for all core database query functions in `server/db.ts` and the `projectsRouter` tRPC router. This ensures reliability, prevents regressions, and validates security scoping (IDOR protection).

## Functional Requirements
- **Database Logic Testing:**
    - Test all CRUD operations in `server/db.ts` (Users, Outlines, Chapters, Scenes, Characters, Projects, Notes, Tasks, Lore).
    - Validate `userId` scoping for all queries to ensure data isolation.
- **Router Testing:**
    - Test `projectsRouter` endpoints (list, get, create, update).
    - Validate input validation (Zod) and error handling (TRPCError).
    - Ensure `userId` is correctly passed from context to DB functions.

## Non-Functional Requirements
- **Testing Methodology:**
    - Use **Vitest** as the test runner.
    - Implement a **Mocking Layer** for database responses using `vi.mock` or similar. No real database should be required.
- **Coverage Target:**
    - Achieve at least **90% code coverage** for `server/db.ts` and `server/routers/projects.ts`.

## Acceptance Criteria
- [ ] All tests pass in the local environment (`npm test`).
- [ ] Code coverage reports confirm >90% coverage for target files.
- [ ] IDOR protection scenarios (unauthorized access attempts) are explicitly tested and verified to fail.
- [ ] Mocks are clean and do not leak state between tests.

## Out of Scope
- Integration tests requiring a live database.
- Testing other tRPC routers not mentioned (unless time permits).
