## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.

## 2026-05-18 - Parallelizing Independent DB Queries After Auth

**Learning:** When using `Promise.all` to parallelize database queries in tRPC route handlers to prevent waterfall latency, authorization-gated queries (like ownership checks) must still be awaited first and independently to ensure security bypasses don't occur.
**Action:** Always `await` the authorization/ownership check first. Only parallelize the subsequent independent read queries (e.g. fetching chapters and characters).
