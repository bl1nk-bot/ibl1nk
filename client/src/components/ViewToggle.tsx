import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List, ImageIcon } from "lucide-react";

export type ViewType = "grid" | "list" | "gallery";

interface ViewToggleProps {
  value: ViewType;
  onChange: (value: ViewType) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <ToggleGroup type="single" value={value} onValueChange={(v) => v && onChange(v as ViewType)}>
      <ToggleGroupItem value="grid" aria-label="Grid view" title="Grid View">
        <LayoutGrid className="w-4 h-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view" title="List View">
        <List className="w-4 h-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="gallery" aria-label="Gallery view" title="Gallery View">
        <ImageIcon className="w-4 h-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
