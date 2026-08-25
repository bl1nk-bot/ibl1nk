## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.

## 2026-05-15 - Parallelizing Independent DB Queries
**Learning:** Using `Promise.all` to parallelize database queries in tRPC route handlers can improve response times, but authorization-gated queries (e.g., ownership checks) must be executed first.
**Action:** Always `await` authorization-gated queries first. Only parallelize the subsequent independent read queries (e.g., `SELECT`) to prevent security bypasses and unnecessary database load.

## 2026-05-15 - Fixing SNYK-0005 CI Error
**Learning:** Snyk action fails (SNYK-0005) when `SNYK_TOKEN` is not provided in environment secrets.
**Action:** Ensure jobs that depend on `SNYK_TOKEN` have an `if: ${{ secrets.SNYK_TOKEN != '' }}` condition to bypass execution when the token is missing, rather than using `|| true` which could mask actual security check failures when the token is present.
