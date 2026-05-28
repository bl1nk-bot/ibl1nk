## 2026-05-28 - Drizzle ORM Dynamic Imports
**Learning:** The codebase previously used dynamic imports for `drizzle-orm` operators (like `or`, `and`, `gte`) within individual database query functions. This is an anti-pattern as it introduces unnecessary module resolution overhead on every query execution.
**Action:** Always use top-level static imports for `drizzle-orm` operators, as they are lightweight and moving them out of function bodies improves performance without impacting initial load times significantly.
