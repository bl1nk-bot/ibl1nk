# Codebase Rules & Design System (Unified Workspace)

## 1. Design System Structure

### Token Definitions
- **Location:** `client/src/index.css`
- **Format:** Tailwind CSS v4 `@theme` block using CSS variables with OKLCH colors.
- **Key Tokens:**
  ```css
  @theme inline {
    --color-primary: var(--primary);
    --color-background: var(--background);
    /* ... shadcn-compatible tokens ... */
  }
  :root {
    --background: oklch(1 0 0);
    --primary: var(--color-blue-700);
    --radius: 0.65rem;
  }
  ```

### Component Library
- **Core Primitives:** `client/src/components/ui/` (Radix-based, Shadcn style).
- **V2 Components (Improved):** `client/src/components/v2/` (High-fidelity Editor & AI panels).
- **Architecture:** Atomic components with composition. Components use `cn()` utility for tailwind classes.
- **Upcoming Transition:** Migrating from custom UI primitives to **Lobe UI** (`@lobehub/ui`) for a more polished AI-centric workspace.

## 2. Frameworks & Libraries
- **Frontend:** React 19, Vite 7, Tailwind CSS 4.
- **Icons:** Transitioning from `lucide-react` to **Lobe Icons** (`@lobehub/icons`).
- **Data Flow:** tRPC 11 for Client-Server communication.
- **Engine:** Standalone Rust Service (`engine/`) for Raw SQL and Agent Orchestration.

## 3. Asset Management
- **Static Assets:** `client/public/` (referenced via absolute paths `/asset.png`).
- **Icons:** Imported from `@lobehub/icons`.
  ```tsx
  import { LucideIcon } from '@lobehub/icons'; // Pattern for migration
  ```

## 4. Styling Approach
- **Methodology:** Utility-first CSS using Tailwind 4.
- **Responsiveness:** Mobile-first approach using standard Tailwind breakpoints (`sm:`, `md:`, `lg:`).
- **Global Styles:** Managed in `client/src/index.css`.
- **Animations:** Powered by `tw-animate-css` and `framer-motion`.

## 5. Project Organization
```text
.
├── client/          # React Frontend (Vite)
│   ├── src/_core/   # Core logic & providers
│   ├── src/components/
│   │   ├── ui/      # Shared UI primitives
│   │   └── v2/      # Imported high-fidelity components
│   └── src/pages/   # Application views
├── server/          # Node.js Backend (tRPC)
├── engine/          # Rust Engine (Bams) - Raw SQL, Sync, Agents
├── shared/          # Shared TS types & Constants
└── drizzle/         # SQL Migrations (Legacy/Reference)
```

## 6. Coding Standards
- **SQL:** No ORMs in the new engine. Use **Raw SQL** in Rust for maximum performance and SQLite/Postgres compatibility.
- **Naming:** CamelCase for variables/functions, PascalCase for components.
- **Safety:** Always verify ownership via `userId` in every SQL query.
- **Cleanliness:** Remove unused dependencies (e.g., `mysql2`, `drizzle-orm` once migration is complete).

## 7. Figma Integration (MCP)
- Use Figma design tokens to map directly to CSS variables in `index.css`.
- Components should be mapped to the `@lobehub/ui` equivalents where possible during the transition.
