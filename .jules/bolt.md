## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.

## 2026-05-16 - Dynamic Imports Bottleneck

**Learning:** Using dynamic imports (e.g., `await import("drizzle-orm")` or `await import("axios")`) inside frequently called route handlers or database query functions creates significant performance bottlenecks and module resolution overhead, especially in serverless or hot paths.
**Action:** Use top-level static imports for dependencies like `drizzle-orm` or `axios` in files where they are frequently used, instead of importing them dynamically inside function bodies.
