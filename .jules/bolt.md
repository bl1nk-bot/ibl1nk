## 2024-06-03 - Dynamic Import Overhead in Database Queries
**Learning:** Using dynamic imports (e.g., `await import("drizzle-orm")`) inside frequently called database query functions creates unnecessary module resolution overhead and slows down database operations.
**Action:** Always prefer top-level static imports for ORM operators (like `eq`, `or`, `and`, `gte`) in database files to prevent these performance bottlenecks.
## 2024-06-06 - Dynamic Import Bottleneck in Drizzle ORM
**Learning:** Frequent queries like `getCharacterRelationships` and `getWritingProgressForUser` were using dynamic imports (`await import("drizzle-orm")`) for query operators (`or`, `and`, `gte`). This causes performance bottlenecks and module resolution overhead, particularly for endpoints accessed often.
**Action:** Always prefer top-level static imports for Drizzle ORM operators (`and`, `or`, `eq`, `gte`, etc.) in frequently called database query functions to eliminate module resolution overhead and optimize response times.
