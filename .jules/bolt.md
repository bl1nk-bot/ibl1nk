## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.
## 2026-05-15 - Module Import Overhead in Frequently Called Functions

**Learning:** Dynamic imports (e.g., `await import('drizzle-orm')` or `await import('axios')`) inside frequently called database query functions or route handlers cause performance bottlenecks and module resolution overhead, even on modern bundlers, due to resolving and loading modules at runtime repeatedly.
**Action:** Use top-level static imports instead of dynamic imports in critical code paths unless lazy loading a massive module that is rarely executed.
