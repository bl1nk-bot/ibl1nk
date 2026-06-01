## 2024-10-24 - Avoid dynamic imports for drizzle-orm operators
**Learning:** Using dynamic imports (e.g., `const { or } = await import("drizzle-orm");`) inside frequently called database query functions causes module resolution overhead and creates a performance bottleneck.
**Action:** Always prefer top-level static imports for drizzle-orm operators (`import { eq, or, and, gte } from "drizzle-orm";`) to ensure queries run as efficiently as possible.
