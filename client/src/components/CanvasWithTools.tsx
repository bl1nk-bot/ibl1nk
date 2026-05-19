import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  X,
  Plus,
  Copy,
  Undo2,
  Redo2,
  Save,
  Download,
  Upload,
  Share2,
} from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { Canvas, CanvasEntry } from "./Canvas";

interface CanvasWithToolsProps {
  title?: string;
  description?: string;
  onSaveToCraft?: (entries: CanvasEntry[]) => Promise<void>;
}

export function CanvasWithTools({
  title = "Story Canvas",
  description = "Drag and arrange your story elements",
  onSaveToCraft,
}: CanvasWithToolsProps) {
  const {
    state: entries,
    setState: setEntries,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory<CanvasEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleAddEntry = (type: CanvasEntry["type"]) => {
    const newEntry: CanvasEntry = {
      id: `entry-${Date.now()}`,
      title: `New ${type}`,
      type,
      tags: [],
      x: Math.random() * 200,
      y: Math.random() * 200,
      color: getColorForType(type),
    };
    setEntries([...entries, newEntry]);
  };

  const handleSaveToCraft = async () => {
    if (!onSaveToCraft) return;
    setIsSaving(true);
    try {
      await onSaveToCraft(entries);
      // Show success toast
      console.log("Saved to Craft successfully");
    } catch (error) {
      console.error("Failed to save to Craft:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
      const dataStr = JSON.stringify(entries, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `story-canvas-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setEntries(imported);
        }
      } catch (error) {
        console.error("Failed to import:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {/* Main Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </Button>

              <div className="w-px bg-border" />

              <Button
                size="sm"
                variant="default"
                onClick={handleSaveToCraft}
                disabled={isSaving || entries.length === 0}
              >
                <Save className="w-4 h-4 mr-1" />
                {isSaving ? "Saving..." : "Save to Craft"}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Canvas</DialogTitle>
                    <DialogDescription>
                      Choose export format for your story elements
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Button
                      onClick={handleExport}
                      disabled={isExporting || entries.length === 0}
                      className="w-full justify-start"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export as JSON
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export as PDF (Coming Soon)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export as EPUB (Coming Soon)
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Upload className="w-4 h-4 mr-1" />
                    Import
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Canvas</DialogTitle>
                    <DialogDescription>
                      Load story elements from a JSON file
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="import-file">Select JSON File</Label>
                      <Input
                        id="import-file"
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="mt-2"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Import a previously exported canvas file to restore your
                      story elements
                    </p>
                  </div>
                </DialogContent>
              </Dialog>

              <Button size="sm" variant="outline" disabled title="Coming Soon">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{entries.length} elements</span>
              <span>
                {canUndo && <span>Undo available</span>}
                {canRedo && <span className="ml-2">Redo available</span>}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <Canvas
        entries={entries}
        onEntriesChange={setEntries}
        onAddEntry={handleAddEntry}
        title={title}
        description={description}
      />
    </div>
  );
}

function getColorForType(type: CanvasEntry["type"]): string {
  const colors: Record<CanvasEntry["type"], string> = {
    character: "#3b82f6",
    scene: "#10b981",
    plot: "#a855f7",
    theme: "#f59e0b",
    note: "#6b7280",
  };
  return colors[type];
}
