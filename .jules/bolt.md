## 2026-05-29 - [Drizzle-ORM Imports Optimization]
**Learning:** Dynamic imports for `drizzle-orm` operators inside frequently called database query functions cause performance bottlenecks and module resolution overhead.
**Action:** Avoid dynamic imports for `drizzle-orm` operators; prefer top-level static imports to prevent performance bottlenecks.
