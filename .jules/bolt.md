## 2024-06-01 - Avoid dynamic imports in drizzle-orm
**Learning:** Dynamic imports for operators like `and`, `or`, `gte` from `drizzle-orm` inside frequently called functions create unnecessary module resolution overhead.
**Action:** Use static, top-level imports for all `drizzle-orm` operators to prevent performance bottlenecks.
## 2024-06-04 - Avoid dynamic imports in frequently called DB query functions
**Learning:** Using dynamic imports (e.g. `const { and } = await import("drizzle-orm");`) inside query functions like `getCharacterRelationships` creates unnecessary module resolution overhead and slows down database query execution.
**Action:** Always prefer top-level static imports for ORM query builder operators to avoid the overhead of dynamically resolving the import on every query execution.
## 2024-06-06 - Dynamic Import Bottleneck in Drizzle ORM
**Learning:** Frequent queries like `getCharacterRelationships` and `getWritingProgressForUser` were using dynamic imports (`await import("drizzle-orm")`) for query operators (`or`, `and`, `gte`). This causes performance bottlenecks and module resolution overhead, particularly for endpoints accessed often.
**Action:** Always prefer top-level static imports for Drizzle ORM operators (`and`, `or`, `eq`, `gte`, etc.) in frequently called database query functions to eliminate module resolution overhead and optimize response times.
