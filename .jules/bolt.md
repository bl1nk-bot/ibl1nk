## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.

## 2023-10-27 - Awaiting Auth Queries Before Promise.all

**Learning:** When using `Promise.all` to parallelize database queries in tRPC route handlers, you must always `await` authorization-gated queries (like ownership checks) first. Parallelizing the auth check alongside the data fetching queries can lead to unnecessary database load and potential security bypasses if the auth check fails but the other queries still execute.
**Action:** Always extract the authorization/ownership check (e.g., `getOutlineByIdForUser`) and `await` it sequentially before executing any independent data fetching queries with `Promise.all`.
