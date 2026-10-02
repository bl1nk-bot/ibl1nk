1. **Fix top-level imports in `server/db.ts`**
   - Replace dynamic imports of `drizzle-orm` operators with static top-level imports to remove the module resolution overhead and improve database query execution speed in frequently called paths.
2. **Verify changes and format**
   - Run `npx prettier --write server/db.ts` to format the file after the changes. Use `git diff --staged server/db.ts` to verify the exact replacements.
3. **Run CI/tests**
   - Run `pnpm lint` and `pnpm test` (or the equivalent check scripts `pnpm run check`) to ensure no type or test regressions occurred.
4. **Complete pre-commit steps**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
5. **Submit pull request**
   - Submit the branch with title `⚡ Bolt: Replace dynamic drizzle-orm imports with static imports in db.ts` and describe the optimization, impact, and measurement.
