# Page Dependency Trees

## `/` Home

Entry: `client/src/pages/Home.tsx`

- `client/src/_core/hooks/useAuth.ts`
- `client/src/components/ui/button.tsx`
  - `client/src/lib/utils.ts`

## `/dashboard`

Entry: `client/src/pages/DashboardMobile.tsx`

- `client/src/_core/hooks/useAuth.ts`
- `client/src/components/ui/button.tsx`
- `client/src/components/ui/card.tsx`
- `client/src/components/ui/progress.tsx`
- `client/src/components/ui/tabs.tsx`
- `client/src/lib/trpc.ts`

## `/outlines`

Entry: `client/src/pages/Outlines.tsx`

- `client/src/_core/hooks/useAuth.ts`
- `client/src/components/ui/button.tsx`
- `client/src/components/ui/card.tsx`
- `client/src/components/ui/dialog.tsx`
- `client/src/components/ui/input.tsx`
- `client/src/components/ui/label.tsx`
- `client/src/components/ui/textarea.tsx`
- `client/src/components/ui/badge.tsx`
- `client/src/components/ui/tabs.tsx`
- `client/src/lib/utils.ts`

## `/characters`

Entry: `client/src/pages/CharactersWithViews.tsx`

- `client/src/_core/hooks/useAuth.ts`
- `client/src/components/ViewToggle.tsx`
- `client/src/components/GridView.tsx`
- `client/src/components/ListView.tsx`
- `client/src/components/GalleryView.tsx`
- `client/src/components/ui/button.tsx`
- `client/src/components/ui/card.tsx`
- `client/src/components/ui/dialog.tsx`
- `client/src/components/ui/input.tsx`
- `client/src/components/ui/label.tsx`
- `client/src/components/ui/textarea.tsx`
- `client/src/components/ui/badge.tsx`
- `client/src/components/ui/tabs.tsx`
- `client/src/lib/utils.ts`

## `/settings`

Entry: `client/src/pages/Settings.tsx`

- `client/src/_core/hooks/useAuth.ts`
- `client/src/components/ui/button.tsx`
- `client/src/components/ui/card.tsx`
- `client/src/components/ui/input.tsx`
- `client/src/components/ui/label.tsx`
- `client/src/components/ui/tabs.tsx`
- `client/src/components/ui/badge.tsx`
- `client/src/lib/utils.ts`

Every design call should additionally include `client/src/index.css`, `.superdesign/design-system.md`, and the relevant root/layout source.
