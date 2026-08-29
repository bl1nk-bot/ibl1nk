## 2026-05-15 - Reusing DOM Nodes for HTML Parsing

**Learning:** Using `DOMParser` prevents security issues from executing scripts. Using `.innerHTML` on a created `div` does not escape meta-characters and leaves the code vulnerable to XSS.
**Action:** Use `new DOMParser().parseFromString(html, "text/html")` instead of `element.innerHTML` when extracting text securely.

**Learning:** Calling `document.createElement('div')` repeatedly inside loop callbacks (like `.map`, `.filter`, or Fuse.js indexing `getFn`) is highly expensive and creates significant performance bottlenecks due to repeated DOM allocation. Furthermore, misusing the comma operator directly in `getFn` can result in empty strings.
**Action:** When extracting plain text from HTML, allocate a single `document.createElement('div')` outside of loops and re-use it (e.g., modifying its `innerHTML` and reading `textContent`) rather than constantly instantiating new elements.
## 2026-05-15 - Parallelize DB Queries in tRPC Handlers
**Learning:** Sequential database queries after an authorization guard can introduce unnecessary latency. Running them concurrently with `Promise.all` is a safe, low-risk optimization.
**Action:** Always check if multiple independent read queries in a route handler can be parallelized after authorization checks.
## 2026-05-15 - Fixing CI Workflow Secrets on Forks
**Learning:** GitHub Actions do not expose the `secrets` context in job-level `if` conditionals. Thus, if a workflow step relies on a missing token (like `SNYK_TOKEN` on forks), the pipeline fails.
**Action:** Map the necessary secrets to a job-level `env` variable and use a step-level conditional like `if: ${{ env.SNYK_TOKEN != '' }}` to gracefully bypass the step when the token is missing.
