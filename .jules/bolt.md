## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.

## 2024-08-20 - Parallelizing tRPC Database Queries
**Learning:** Attempting to parallelize all database queries in a tRPC handler can lead to security bypasses or unnecessary database load if authorization checks (like `getOutlineByIdForUser`) are not awaited first.
**Action:** Always `await` ownership/authorization queries first. Only use `Promise.all` for subsequent independent read operations (like fetching characters and chapters) to improve performance safely.
