## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.

## 2026-05-15 - Dynamic imports inside query execution
**Learning:** Using `await import(...)` inside frequently executed database functions (like queries returning `drizzle-orm` operators) creates an unnecessary module resolution overhead on every query. This acts as a performance bottleneck due to the cost of repeatedly resolving modules inside the execution path.
**Action:** Use static top-level imports for operators like `and`, `or`, and `gte` rather than dynamic imports within the query function block to avoid repetitive module loading overhead in hot paths.
