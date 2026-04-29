# Claude Writer Dashboard

A full-stack writing management platform for novelists and creative writers, built as a Manus Built-in Plugin.

## Architecture

- **Frontend:** React 19 + Vite 7 + Tailwind CSS 4 + shadcn/ui components
- **Backend:** Express.js 4 with tRPC 11 for end-to-end type safety
- **Database:** MySQL (via Drizzle ORM + mysql2) — optional, app runs without DB
- **Auth:** Manus OAuth integration (requires VITE_APP_ID and VITE_OAUTH_PORTAL_URL)
- **AI:** Vercel AI SDK with multi-provider support (OpenAI, Anthropic, Google)
- **Package Manager:** pnpm 10.4.1

## Development

The app runs as a single Express server that serves both the API and the React frontend via Vite middleware in development mode.

```bash
pnpm run dev   # Starts on port 5000
```

## Project Layout

- `client/` — React frontend (entry: `client/src/main.tsx`)
- `server/` — Express backend (entry: `server/_core/index.ts`)
  - `_core/` — OAuth, tRPC context, Vite middleware, env config
  - `routers/` — tRPC API routers
  - `db.ts` — Database queries (lazy, optional)
- `shared/` — Shared types and constants
- `drizzle/` — DB schema and migrations
- `conductor/` — Product specs and tech stack docs
- `skills/` — Manus skill sub-plugins

## Environment Variables

- `PORT` — Server port (set to 5000)
- `JWT_SECRET` — Session cookie signing key
- `DATABASE_URL` — MySQL connection string (optional; app runs without DB)
- `VITE_APP_ID` — Manus App ID for OAuth (optional in Replit)
- `VITE_OAUTH_PORTAL_URL` — Manus OAuth portal URL (optional in Replit)
- `OAUTH_SERVER_URL` — Backend OAuth server URL
- `OWNER_OPEN_ID` — Manus open ID of the app owner

## Deployment

- **Target:** Autoscale
- **Build:** `pnpm run build`
- **Run:** `node dist/index.js`
