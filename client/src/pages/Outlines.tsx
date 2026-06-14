import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, BookOpen, Edit2, Trash2, ChevronRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  archived: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  in_progress: "In Progress",
  completed: "Completed",
  archived: "Archived",
};

export default function Outlines() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newOutline, setNewOutline] = useState({ title: "", description: "" });

  const { data: outlines = [], isLoading } = trpc.outlines.list.useQuery();

  const utils = trpc.useUtils();
  const createMutation = trpc.outlines.create.useMutation({
    onSuccess: () => {
      utils.outlines.list.invalidate();
      setNewOutline({ title: "", description: "" });
      setIsCreateDialogOpen(false);
    },
  });

  const handleCreate = () => {
    if (!newOutline.title.trim()) return;
    createMutation.mutate({
      title: newOutline.title.trim(),
      description: newOutline.description.trim() || undefined,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Stories</h1>
          <p className="text-muted-foreground mt-2">Manage your story outlines and chapters</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Story
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Story</DialogTitle>
              <DialogDescription>Start a new writing project</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Story Title</Label>
                <Input
                  id="title"
                  placeholder="Enter story title"
                  value={newOutline.title}
                  onChange={(e) => setNewOutline({ ...newOutline, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your story"
                  value={newOutline.description}
                  onChange={(e) => setNewOutline({ ...newOutline, description: e.target.value })}
                />
              </div>
              <Button
                onClick={handleCreate}
                className="w-full"
                disabled={createMutation.isPending || !newOutline.title.trim()}
              >
                {createMutation.isPending ? "Creating..." : "Create Story"}
              </Button>
              {createMutation.error && (
                <p className="text-sm text-destructive">{createMutation.error.message}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading stories...</p>
        )}

        {!isLoading && outlines.length === 0 && (
          <Card>
            <CardContent className="p-10 text-center">
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium mb-1">No stories yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first story to get started.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Story
              </Button>
            </CardContent>
          </Card>
        )}

        {outlines.map((outline) => {
          const status = outline.status ?? "draft";
          return (
            <Card key={outline.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <BookOpen className="w-5 h-5 text-amber-600 shrink-0" />
                      <h3 className="text-xl font-semibold truncate">{outline.title}</h3>
                      <Badge className={STATUS_COLORS[status] ?? STATUS_COLORS.draft}>
                        {STATUS_LABELS[status] ?? status}
                      </Badge>
                    </div>

                    {outline.description && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {outline.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{(outline.wordCount ?? 0).toLocaleString()} words</span>
                      <span>Created {new Date(outline.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" aria-label="Edit">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" aria-label="Open">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
