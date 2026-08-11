# Theme

## Compact token summary

- CSS: Tailwind CSS v4 via `@import "tailwindcss"`; shadcn-style semantic variables.
- Default theme: light. Dark mode uses `.dark`.
- Primary: Tailwind blue-700; primary foreground blue-50. Sidebar primary: blue-600 light / blue-500 dark.
- Light: background/card/popover white; warm near-black foreground `oklch(0.235 0.015 65)`; gray borders `oklch(0.92 0.004 286.32)`.
- Dark: background `oklch(0.141 0.005 285.823)`; card `oklch(0.21 0.006 285.885)`; foreground `oklch(0.85 0.005 65)`.
- Radius base: `0.65rem`; derived sm = base−4px, md = base−2px, lg = base, xl = base+4px.
- Container: 16px horizontal padding; 24px at 640px; 32px and max-width 1280px at 1024px.
- Charts: blue-300, 500, 600, 700, 800, plus inline theme token `--color-accent-gold: #d4a574` for dashboard highlights/streaks.

## Raw source

The complete raw theme source is `client/src/index.css` (195 lines). It contains `@theme inline`, complete `:root` and `.dark` variable blocks, base rules, and the custom responsive `.container`; pass this full file on every design call because it is below the 900-line threshold.

Theme provider source: `client/src/contexts/ThemeContext.tsx`.
