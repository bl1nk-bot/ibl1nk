import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Edit2, Trash2, ChevronRight } from "lucide-react";

export interface ListItem {
  id: string | number;
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  tags?: string[];
  progress?: number;
  stats?: { label: string; value: string | number }[];
  metadata?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

interface ListViewProps {
  items: ListItem[];
  onItemClick?: (item: ListItem) => void;
}

export function ListView({ items, onItemClick }: ListViewProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card
          key={item.id}
          className="cursor-pointer hover:bg-muted transition-colors"
          onClick={() => onItemClick?.(item) || item.onClick?.()}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{item.title}</h3>
                  {item.badge && (
                    <Badge variant={item.badgeVariant || "secondary"} className="text-xs flex-shrink-0">
                      {item.badge}
                    </Badge>
                  )}
                </div>

                {item.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                    {item.description}
                  </p>
                )}

                {/* Progress Bar */}
                {item.progress !== undefined && (
                  <div className="mb-2">
                    <Progress value={item.progress} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">{item.progress}% complete</p>
                  </div>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.length - 4}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Stats */}
                {item.stats && item.stats.length > 0 && (
                  <div className="flex gap-4 text-xs">
                    {item.stats.map((stat) => (
                      <div key={stat.label}>
                        <span className="text-muted-foreground">{stat.label}:</span>
                        <span className="font-semibold ml-1">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Metadata */}
                {item.metadata && (
                  <p className="text-xs text-muted-foreground mt-1">{item.metadata}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {item.onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onEdit?.();
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
                {item.onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onDelete?.();
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
