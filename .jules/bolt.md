## 2024-05-22 - Avoid Dynamic Imports for ORM Operators

**Learning:** In frequently called database query functions, using dynamic imports for `drizzle-orm` operators (`or`, `gte`, `and`) adds unnecessary module resolution overhead on every call.
**Action:** Always prefer top-level static imports for ORM query operators to prevent this performance bottleneck.
