import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MoreVertical } from "lucide-react";

export interface GridItem {
  id: string | number;
  title: string;
  description?: string;
  image?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  tags?: string[];
  stats?: { label: string; value: string | number }[];
  onEdit?: () => void;
  onDelete?: () => void;
}

interface GridViewProps {
  items: GridItem[];
  columns?: 1 | 2 | 3 | 4;
  onItemClick?: (item: GridItem) => void;
}

export function GridView({ items, columns = 3, onItemClick }: GridViewProps) {
  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridColsClass[columns]} gap-4`}>
      {items.map(item => (
        <Card
          key={item.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onItemClick?.(item)}
        >
          <CardContent className="p-4 space-y-3">
            {/* Image */}
            {item.image && (
              <div className="w-full h-32 bg-muted rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.title}</h3>
                {item.badge && (
                  <Badge
                    variant={item.badgeVariant || "secondary"}
                    className="mt-1 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={e => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}

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

            {/* Stats */}
            {item.stats && item.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                {item.stats.map(stat => (
                  <div key={stat.label}>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="font-semibold text-sm">{stat.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            {(item.onEdit || item.onDelete) && (
              <div className="flex gap-2 pt-2 border-t">
                {item.onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={e => {
                      e.stopPropagation();
                      item.onEdit?.();
                    }}
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                )}
                {item.onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={e => {
                      e.stopPropagation();
                      item.onDelete?.();
                    }}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
