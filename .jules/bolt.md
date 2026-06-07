## 2024-10-24 - Avoid dynamic imports for drizzle-orm operators
**Learning:** Using dynamic imports (e.g., `const { or } = await import("drizzle-orm");`) inside frequently called database query functions causes module resolution overhead and creates a performance bottleneck.
**Action:** Always prefer top-level static imports for drizzle-orm operators (`import { eq, or, and, gte } from "drizzle-orm";`) to ensure queries run as efficiently as possible.
## 2024-06-06 - Dynamic Import Bottleneck in Drizzle ORM
**Learning:** Frequent queries like `getCharacterRelationships` and `getWritingProgressForUser` were using dynamic imports (`await import("drizzle-orm")`) for query operators (`or`, `and`, `gte`). This causes performance bottlenecks and module resolution overhead, particularly for endpoints accessed often.
**Action:** Always prefer top-level static imports for Drizzle ORM operators (`and`, `or`, `eq`, `gte`, etc.) in frequently called database query functions to eliminate module resolution overhead and optimize response times.
