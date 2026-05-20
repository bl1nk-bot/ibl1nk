## 2024-05-20 - Avoid dynamic imports in loops and frequently called queries
**Learning:** We observed performance bottlenecks due to the usage of `await import("drizzle-orm")` directly inside query functions. Node.js takes a measurable amount of time to resolve and return dynamically imported modules, and when these functions are called frequently or inside a loop, the delay accumulates rapidly.
**Action:** Always prefer top-level static imports for required modules (like operators `eq`, `and`, `or`, `gte` from `drizzle-orm`) to avoid repeated module resolution overhead during execution.
