## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.
## 2023-10-27 - Static vs Dynamic Imports in DB Queries & Safe Parallelization
**Learning:** Dynamic imports (e.g., `await import("drizzle-orm")`) inside frequently called database functions introduce significant module resolution overhead (up to ~300x slower in tight loops). Also, indiscriminately using `Promise.all` can bypass existence/authorization checks, wasting resources and risking IDOR.
**Action:** Always use top-level static imports for ORM operators. When parallelizing queries, strictly await authorization/existence checks first, then use `Promise.all` for independent subsequent reads.
