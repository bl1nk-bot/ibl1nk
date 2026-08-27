## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.

## 2024-10-31 - Parallelizing Independent Read Queries after Auth
**Learning:** In tRPC route handlers (like `storyOverview`), executing independent queries (e.g., fetching chapters and characters) sequentially introduces unnecessary latency. However, authorization-gated queries (like `getOutlineByIdForUser`) must remain strictly sequential before any parallelization to prevent security bypasses.
**Action:** Always `await` ownership/authorization queries first, then use `Promise.all` to batch the remaining independent read operations.
