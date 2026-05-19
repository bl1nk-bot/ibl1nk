import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

export interface GalleryItem {
  id: string | number;
  title: string;
  description?: string;
  image: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  tags?: string[];
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

interface GalleryViewProps {
  items: GalleryItem[];
  columns?: 2 | 3 | 4;
  onItemClick?: (item: GalleryItem) => void;
}

export function GalleryView({
  items,
  columns = 3,
  onItemClick,
}: GalleryViewProps) {
  const gridColsClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridColsClass[columns]} gap-4`}>
      {items.map(item => (
        <Card
          key={item.id}
          className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
          onClick={() => onItemClick?.(item) || item.onClick?.()}
        >
          {/* Image Container */}
          <div className="relative w-full h-48 bg-muted overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              {item.onEdit && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={e => {
                    e.stopPropagation();
                    item.onEdit?.();
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
              {item.onDelete && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={e => {
                    e.stopPropagation();
                    item.onDelete?.();
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Badge */}
            {item.badge && (
              <div className="absolute top-2 right-2">
                <Badge
                  variant={item.badgeVariant || "secondary"}
                  className="text-xs"
                >
                  {item.badge}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="p-3 space-y-2">
            <div>
              <h3 className="font-semibold line-clamp-2">{item.title}</h3>
              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {item.description}
                </p>
              )}
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
