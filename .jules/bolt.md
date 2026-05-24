## 2024-05-24 - Dynamic imports bottleneck in DB queries

**Learning:** Dynamic imports for `drizzle-orm` operators (`await import("drizzle-orm")`) inside frequently called database query functions create module resolution overhead and performance bottlenecks.
**Action:** Always prefer top-level static imports for Drizzle ORM operators to prevent runtime resolution delays.
