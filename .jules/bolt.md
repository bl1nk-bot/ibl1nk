## 2026-06-02 - Avoid Dynamic Imports for Drizzle ORM Operators
**Learning:** Dynamic imports (e.g., `await import("drizzle-orm")`) inside frequently called database query functions create significant performance bottlenecks due to module resolution overhead on every call.
**Action:** Always use top-level static imports for standard `drizzle-orm` operators like `eq`, `or`, `and`, and `gte`.
