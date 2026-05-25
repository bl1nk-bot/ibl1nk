## 2024-03-24 - [Avoid dynamic imports for drizzle-orm operators]

**Learning:** In frequently called database query functions, using dynamic imports for `drizzle-orm` operators (like `or`, `and`, `gte`) introduces unnecessary module resolution overhead which acts as a performance bottleneck.
**Action:** Always prefer top-level static imports for `drizzle-orm` operators to prevent this performance degradation, especially since the operators are pure functions and don't contribute significantly to bundle size when statically imported.
