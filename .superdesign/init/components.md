# Shared UI Components

Framework: React 19 + Vite, with shadcn-style Radix primitives and Tailwind CSS v4.

## `client/src/components/ViewToggle.tsx`

Three-state grid/list/gallery view selector. Full source:

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List, ImageIcon } from "lucide-react";

export type ViewType = "grid" | "list" | "gallery";

interface ViewToggleProps {
  value: ViewType;
  onChange: (value: ViewType) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={v => v && onChange(v as ViewType)}
    >
      <ToggleGroupItem value="grid" aria-label="Grid view" title="Grid View">
        <LayoutGrid className="w-4 h-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view" title="List View">
        <List className="w-4 h-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="gallery"
        aria-label="Gallery view"
        title="Gallery View"
      >
        <ImageIcon className="w-4 h-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
```

## UI primitive inventory

Full implementations live in `client/src/components/ui/`: `button.tsx`, `card.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, `badge.tsx`, `tabs.tsx`, `dialog.tsx`, `select.tsx`, `progress.tsx`, `avatar.tsx`, `dropdown-menu.tsx`, `sidebar.tsx`, `tooltip.tsx`, and `sonner.tsx`. These are standard local shadcn/Radix implementations and should be passed directly as context when used by a target page.
