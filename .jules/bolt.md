## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.

## 2024-05-16 - Parallelizing Database Queries in tRPC Handlers safely
**Learning:** When using `Promise.all` to parallelize database queries in tRPC route handlers, it is critical to `await` authorization-gated queries (e.g., ownership checks) first. Parallelizing them together can lead to security bypasses and unnecessary database load if the authorization fails.
**Action:** Always `await` authorization-gated queries first. Only parallelize the subsequent independent queries.
