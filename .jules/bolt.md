## 2024-05-24 - Static Imports for Drizzle-ORM Operators

**Learning:** Dynamic imports for `drizzle-orm` operators (`or`, `and`, `gte`) inside frequently called database query functions (like `getCharacterRelationships` and `getWritingProgressForUser`) can create a noticeable performance bottleneck due to module resolution overhead on every query.
**Action:** Avoid dynamic imports for `drizzle-orm` operators in database queries. Use static, top-level imports to ensure these operators are resolved once at startup, which speeds up function execution times and reduces overhead on database queries.
