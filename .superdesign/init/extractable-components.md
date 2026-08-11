# Extractable Components

## DashboardLayout

- Source: `client/src/components/DashboardLayout.tsx`
- Category: layout
- Description: Authenticated resizable/collapsible sidebar shell with profile controls and mobile header.
- Extractable props: `activeItem` (string), `sidebarCollapsed` (boolean)
- Hardcoded: nav icon types, account control structure, Tailwind classes

## ViewToggle

- Source: `client/src/components/ViewToggle.tsx`
- Category: basic
- Description: Grid/list/gallery segmented icon control.
- Extractable props: `value` (`grid | list | gallery`)
- Hardcoded: lucide icon names and button styling

## GridView

- Source: `client/src/components/GridView.tsx`
- Category: basic
- Description: Responsive card grid with badges, tags, stats, edit/delete actions.
- Extractable props: items
- Hardcoded: card composition and action icons

## ListView

- Source: `client/src/components/ListView.tsx`
- Category: basic
- Description: Dense vertical list representation of the same entity model.
- Extractable props: items
- Hardcoded: row composition and action icons

## GalleryView

- Source: `client/src/components/GalleryView.tsx`
- Category: basic
- Description: Image-forward gallery cards for characters or other entities.
- Extractable props: items
- Hardcoded: image/card treatment and action icons
