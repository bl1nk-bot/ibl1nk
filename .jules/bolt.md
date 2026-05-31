## 2024-06-01 - Avoid dynamic imports in drizzle-orm
**Learning:** Dynamic imports for operators like `and`, `or`, `gte` from `drizzle-orm` inside frequently called functions create unnecessary module resolution overhead.
**Action:** Use static, top-level imports for all `drizzle-orm` operators to prevent performance bottlenecks.
