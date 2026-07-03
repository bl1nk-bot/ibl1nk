## 2024-05-30 - Avoid dynamic imports in hot path DB operations
**Learning:** Dynamic imports for operators like `or`, `and`, `gte` inside frequent database query functions (e.g., `getCharacterRelationships`, `getWritingProgressForUser`) can create measurable overhead due to module resolution in hot paths.
**Action:** Always prefer static top-level imports for database query operators in files handling core database operations.
## 2024-06-04 - Avoid dynamic imports in frequently called DB query functions
**Learning:** Using dynamic imports (e.g. `const { and } = await import("drizzle-orm");`) inside query functions like `getCharacterRelationships` creates unnecessary module resolution overhead and slows down database query execution.
**Action:** Always prefer top-level static imports for ORM query builder operators to avoid the overhead of dynamically resolving the import on every query execution.
## 2024-06-06 - Dynamic Import Bottleneck in Drizzle ORM
**Learning:** Frequent queries like `getCharacterRelationships` and `getWritingProgressForUser` were using dynamic imports (`await import("drizzle-orm")`) for query operators (`or`, `and`, `gte`). This causes performance bottlenecks and module resolution overhead, particularly for endpoints accessed often.
**Action:** Always prefer top-level static imports for Drizzle ORM operators (`and`, `or`, `eq`, `gte`, etc.) in frequently called database query functions to eliminate module resolution overhead and optimize response times.
## 2024-07-03 - Parallelize Independent DB Queries in Route Handlers
**Learning:** Sequential database queries inside tRPC route handlers (like `storyOverview`) that don't depend on each other cause unnecessary latency by summing the execution time of each query.
**Action:** Use `Promise.all` to execute independent database read operations (e.g. `SELECT` queries for outline, chapters, and characters) concurrently, which reduces overall response time to the duration of the slowest query.
