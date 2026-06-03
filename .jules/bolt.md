## 2024-06-03 - Dynamic Import Overhead in Database Queries
**Learning:** Using dynamic imports (e.g., `await import("drizzle-orm")`) inside frequently called database query functions creates unnecessary module resolution overhead and slows down database operations.
**Action:** Always prefer top-level static imports for ORM operators (like `eq`, `or`, `and`, `gte`) in database files to prevent these performance bottlenecks.
