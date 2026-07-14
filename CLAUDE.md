# Design System Rules (ibl1nk)

## Component Organization
- **UI Components:** Place base UI components (like buttons, dialogs) in `client/src/components/ui/`.
- **Feature Components:** Place feature-specific components in `client/src/components/`.
- **Naming Convention:** Use **PascalCase** for both component names and filenames (e.g., `AIChatBox.tsx`).
- **Export Pattern:** Use named exports for all components.

## Styling Rules
- **Framework:** Use **Tailwind CSS v4** for styling.
- **Utility Helper:** Always use the `cn()` utility from `@/lib/utils` to merge class names.
- **Design Tokens:** 
  - Reference CSS variables defined in `client/src/index.css` via Tailwind classes (e.g., `bg-primary`, `text-muted-foreground`).
  - IMPORTANT: Never hardcode hex or OKLCH colors directly in components.
- **Dark Mode:** Use the `dark:` variant for dark mode overrides.
- **Component Pattern:** Use `class-variance-authority` (CVA) for components with multiple variants and sizes (refer to `client/src/components/ui/button.tsx`).

## Figma MCP Integration Rules
These rules define the mandatory workflow for translating Figma designs into code.

### Required Flow (Do Not Skip)
1. **Analyze:** Run `get_design_context` first to fetch the structured representation of the node(s).
2. **Visualize:** Run `get_screenshot` for a visual reference of the design variant.
3. **Implement:** Translate the Figma design into React + Tailwind v4 components, following this project's conventions.
4. **Validate:** Compare the final implementation against the Figma screenshot for 1:1 visual and behavioral parity.

### Implementation Guidelines
- **Tokens Mapping:** Map Figma colors, typography, and spacing to the existing design tokens in `index.css`.
- **Component Reuse:** Check for existing UI components in `client/src/components/ui/` before creating new ones.
- **Responsive Design:** Implement mobile-first designs as per project policy. Use Tailwind breakpoints for scaling.

## Asset Handling
- **Figma Assets:** Use the Figma MCP server assets endpoint for images and SVGs.
- **Localhost Sources:** If a localhost source is provided by the server, use it directly.
- **Storage:** Save downloaded static assets in `client/public/` if persistent storage is needed.
- **Icons:** Prefer using existing icons from the design system or Lucide React if already integrated.

## Project-Specific Conventions
- **Routing:** Use `wouter` for client-side routing.
- **Data Fetching:** Use tRPC for all backend communications.
- **Types:** Use TypeScript for all new code. Define clear interfaces/types for component props.
