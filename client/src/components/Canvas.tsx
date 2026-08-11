import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Copy } from "lucide-react";

export interface CanvasEntry {
  id: string;
  title: string;
  type: "character" | "scene" | "plot" | "theme" | "note";
  tags: string[];
  x: number;
  y: number;
  color?: string;
}

interface CanvasProps {
  entries: CanvasEntry[];
  onEntriesChange: (entries: CanvasEntry[]) => void;
  onAddEntry?: (type: CanvasEntry["type"]) => void;
  title?: string;
  description?: string;
}

const typeColors: Record<CanvasEntry["type"], string> = {
  character: "bg-blue-100 border-blue-300",
  scene: "bg-green-100 border-green-300",
  plot: "bg-purple-100 border-purple-300",
  theme: "bg-yellow-100 border-yellow-300",
  note: "bg-gray-100 border-gray-300",
};

const typeLabels: Record<CanvasEntry["type"], string> = {
  character: "Character",
  scene: "Scene",
  plot: "Plot",
  theme: "Theme",
  note: "Note",
};

export function Canvas({
  entries,
  onEntriesChange,
  onAddEntry,
  title = "Story Canvas",
  description = "Drag and arrange your story elements",
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedEntry, setDraggedEntry] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, entryId: string) => {
    if ((e.target as HTMLElement).closest("button")) return;

    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    setDraggedEntry(entryId);
    setOffset({
      x: e.clientX - entry.x,
      y: e.clientY - entry.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedEntry || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const newX = Math.max(
        0,
        Math.min(e.clientX - rect.left - offset.x, rect.width - 200)
      );
      const newY = Math.max(
        0,
        Math.min(e.clientY - rect.top - offset.y, rect.height - 100)
      );

      onEntriesChange(
        entries.map(entry =>
          entry.id === draggedEntry ? { ...entry, x: newX, y: newY } : entry
        )
      );
    };

    const handleMouseUp = () => {
      setDraggedEntry(null);
    };

    if (draggedEntry) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedEntry, offset, entries, onEntriesChange]);

  const handleDelete = (id: string) => {
    onEntriesChange(entries.filter(e => e.id !== id));
  };

  const handleDuplicate = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    const newEntry: CanvasEntry = {
      ...entry,
      id: `${entry.id}-copy-${Date.now()}`,
      x: entry.x + 20,
      y: entry.y + 20,
    };
    onEntriesChange([...entries, newEntry]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            {(["character", "scene", "plot", "theme", "note"] as const).map(
              type => (
                <Button
                  key={type}
                  size="sm"
                  variant="outline"
                  onClick={() => onAddEntry?.(type)}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {typeLabels[type]}
                </Button>
              )
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={canvasRef}
          className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden"
        >
          {/* Grid background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Canvas entries */}
          {entries.map(entry => (
            <div
              key={entry.id}
              className={`absolute w-48 p-3 rounded-lg border-2 cursor-move transition-shadow hover:shadow-lg ${typeColors[entry.type]} ${
                draggedEntry === entry.id ? "shadow-xl z-50" : "z-10"
              }`}
              style={{
                left: `${entry.x}px`,
                top: `${entry.y}px`,
                userSelect: "none",
              }}
              onMouseDown={e => handleMouseDown(e, entry.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  {typeLabels[entry.type]}
                </Badge>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleDuplicate(entry.id)}
                    className="p-1 hover:bg-white/50 rounded"
                    title="Duplicate"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1 hover:bg-red-200 rounded"
                    title="Delete"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                {entry.title}
              </h4>

              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Empty state */}
          {entries.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
              <div className="text-gray-400">
                <p className="text-lg font-semibold mb-2">Empty Canvas</p>
                <p className="text-sm">
                  Click the buttons above to add story elements
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Canvas info */}
        <div className="mt-3 text-xs text-muted-foreground">
          {entries.length} element{entries.length !== 1 ? "s" : ""} • Drag to
          move • Right-click for options
        </div>
      </CardContent>
    </Card>
  );
}
