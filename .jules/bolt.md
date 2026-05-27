## 2024-05-27 - Avoid dynamic imports for database operators
**Learning:** Dynamic imports of simple `drizzle-orm` operators like `or`, `and`, `gte` inside highly-frequent query functions cause unnecessary module resolution overhead and blocking. In extreme cases this can lead to performance bottlenecks.
**Action:** Always prefer top-level static imports for `drizzle-orm` operators unless lazy loading a genuinely large and non-critical piece of code.
