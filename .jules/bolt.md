## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.

## 2026-05-15 - Parallelizing Independent DB Queries after Auth

**Learning:** Sequential await calls for independent database reads (like fetching chapters and characters separately) unnecessarily increase request latency. However, authorization-gated queries must be awaited sequentially before independent reads.
**Action:** When querying multiple independent data models in a single route handler, always use `Promise.all` to parallelize them, but only *after* completing any necessary authorization checks to prevent security bypasses and reduce total database load time.
