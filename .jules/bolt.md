## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.
## 2026-05-15 - Parallelizing DB Queries with Promise.all in tRPC

**Learning:** In tRPC routes (e.g., `server/routers/outlines.ts`), independent read queries (like `getChaptersByOutlineId` and `getCharactersByOutlineId`) were being executed sequentially after authorization checks, unnecessarily increasing total request latency.
**Action:** When multiple independent database queries are required in a route, use `await Promise.all([query1(), query2()])` to parallelize them after the initial authorization check (like `getOutlineByIdForUser`) to improve endpoint response time.
## 2026-05-15 - GitHub Actions Snyk Missing Secret on Forks

**Learning:** Snyk workflow tasks (like `snyk code test`) fail with `SNYK-0005` (Authentication error) when the `SNYK_TOKEN` secret is empty (which happens automatically on forks for security reasons). Appending `|| true` to the step command bypasses the check but compromises security for authorized builds.
**Action:** Map the `SNYK_TOKEN` secret to a job-level `env` variable in the workflow file, and append the conditional `if: ${{ env.SNYK_TOKEN != '' }}` to all Snyk-related steps. This ensures the steps run safely in authorized environments and skip cleanly on forks without breaking the pipeline.
