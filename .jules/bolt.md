## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.

## 2026-05-15 - Optimizing tRPC Sequential Queries

**Learning:** When dealing with tRPC procedures that fetch multiple independent sets of data related to the same core entity (like fetching chapters and characters for an outline), sequential `await` calls introduce unnecessary database wait times and increase API latency.
**Action:** Use `Promise.all` to fetch independent queries concurrently. However, always run the authorization/guard queries (e.g., `getOutlineByIdForUser`) sequentially *before* the `Promise.all` block to ensure security checks are passed before placing load on the database.
