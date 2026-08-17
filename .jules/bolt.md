## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.

## 2026-05-16 - Avoid Dynamic Imports for ORM Operators

**Learning:** Using `await import("drizzle-orm")` inside frequently called database query functions causes unnecessary performance bottlenecks due to module resolution overhead on every function call.
**Action:** Use top-level static imports for Drizzle ORM operators (e.g., `import { and, eq, or, gte } from "drizzle-orm"`) to prevent module resolution latency during queries.
