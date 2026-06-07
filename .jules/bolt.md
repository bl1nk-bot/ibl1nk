## 2026-06-02 - Avoid Dynamic Imports for Drizzle ORM Operators
**Learning:** Dynamic imports (e.g., `await import("drizzle-orm")`) inside frequently called database query functions create significant performance bottlenecks due to module resolution overhead on every call.
**Action:** Always use top-level static imports for standard `drizzle-orm` operators like `eq`, `or`, `and`, and `gte`.
## 2024-06-06 - Dynamic Import Bottleneck in Drizzle ORM
**Learning:** Frequent queries like `getCharacterRelationships` and `getWritingProgressForUser` were using dynamic imports (`await import("drizzle-orm")`) for query operators (`or`, `and`, `gte`). This causes performance bottlenecks and module resolution overhead, particularly for endpoints accessed often.
**Action:** Always prefer top-level static imports for Drizzle ORM operators (`and`, `or`, `eq`, `gte`, etc.) in frequently called database query functions to eliminate module resolution overhead and optimize response times.
