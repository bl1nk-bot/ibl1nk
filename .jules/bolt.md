## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.

## 2026-05-15 - Dynamic Import Overhead in Critical Paths

**Learning:** Using dynamic imports (`await import('...')`) inside frequently called database query functions or route handlers (like `getCharacterRelationships` or API requests) creates a massive performance bottleneck. Node.js must repeatedly execute module resolution logic, adding multiple seconds of overhead for operations that should take sub-milliseconds.
**Action:** Always use static top-level imports for commonly used libraries (like `drizzle-orm` or `axios`) rather than lazy-loading them dynamically within hot code paths.
