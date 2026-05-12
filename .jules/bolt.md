## 2024-05-18 - Replacing Sequential DB Fetching with Promise.all
**Learning:** In trpc procedures (like `storyOverview`), sequentially `await`ing independent database queries (e.g., getting outline, chapters, and characters) causes unnecessary blocking, compounding request time.
**Action:** Always fetch independent datasets concurrently using `Promise.all` to reduce overall latency and execute queries in parallel.
