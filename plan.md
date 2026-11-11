1. **Optimize `storyOverview` endpoint in `server/routers/outlines.ts`**
   - Use `Promise.all` to run `getChaptersByOutlineId` and `getCharactersByOutlineId` concurrently after the authorization step (`getOutlineByIdForUser`). This will reduce database latency.
2. **Optimize `agentsRouter.run` endpoint in `server/routers/agents.ts`**
   - The dynamic import `await import("axios")` inside the live LLM call is executed inside a frequently called mutation. Move the import to the top level to avoid module resolution overhead on every call.
3. **Run testing & linting**
   - Run `pnpm run check && pnpm test` to verify changes.
4. **Complete pre-commit steps**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
5. **Submit the PR**
   - Use `submit` to push the changes.
