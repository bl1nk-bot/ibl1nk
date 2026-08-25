import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import {
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  ChevronRight,
  Sparkles,
  Download,
  Layers,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { AiAssistantModal } from "@/components/AiAssistantModal";
import {
  exportStoryToMarkdown,
  exportStoryObsidianMarkdown,
} from "@/lib/exportStory";

const statusColors: Record<string, string> = {
  planning: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  writing: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  in_progress:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
  reviewing:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  draft: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  archived: "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200",
};

const statusLabels: Record<string, string> = {
  planning: "Planning",
  writing: "Writing",
  in_progress: "In Progress",
  reviewing: "Reviewing",
  completed: "Completed",
  draft: "Draft",
  archived: "Archived",
};

export default function Outlines() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddChapterDialogOpen, setIsAddChapterDialogOpen] = useState(false);
  const [isAddSceneDialogOpen, setIsAddSceneDialogOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const [newOutline, setNewOutline] = useState({ title: "", description: "" });
  const [editingOutline, setEditingOutline] = useState<{
    id: number;
    title: string;
    description: string;
    status: "draft" | "in_progress" | "completed" | "archived";
  } | null>(null);

  const [newChapter, setNewChapter] = useState({ title: "", description: "" });
  const [newScene, setNewScene] = useState({
    title: "",
    description: "",
    wordCount: 1500,
    status: "planning" as const,
  });

  const [selectedOutlineId, setSelectedOutlineId] = useState<number | null>(1);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    null
  );

  // Queries
  const outlinesQuery = trpc.outlines.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const outlines = outlinesQuery.data ?? [];

  const selectedOutline =
    outlines.find(o => o.id === selectedOutlineId) || outlines[0];

  const chaptersQuery = trpc.outlines.chapters.useQuery(
    { outlineId: selectedOutline?.id ?? 0 },
    { enabled: Boolean(selectedOutline?.id) }
  );
  const chapters = chaptersQuery.data ?? [];

  const activeChapterId = selectedChapterId ?? chapters[0]?.id;
  const activeChapter =
    chapters.find(c => c.id === activeChapterId) || chapters[0];

  const scenesQuery = trpc.outlines.scenes.useQuery(
    { chapterId: activeChapter?.id ?? 0 },
    { enabled: Boolean(activeChapter?.id) }
  );
  const scenes = scenesQuery.data ?? [];

  const charactersQuery = trpc.characters.listByUser.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const characters = charactersQuery.data ?? [];

  // Mutations
  const createOutline = trpc.outlines.create.useMutation({
    onSuccess: (res: any) => {
      utils.outlines.list.invalidate();
      setNewOutline({ title: "", description: "" });
      setIsCreateDialogOpen(false);
      if (res?.[0]?.insertId) {
        setSelectedOutlineId(res[0].insertId);
      }
    },
  });

  const updateOutline = trpc.outlines.update.useMutation({
    onSuccess: () => {
      utils.outlines.list.invalidate();
      setIsEditDialogOpen(false);
      setEditingOutline(null);
    },
  });

  const deleteOutline = trpc.outlines.delete.useMutation({
    onSuccess: () => {
      utils.outlines.list.invalidate();
    },
  });

  const createChapter = trpc.outlines.createChapter.useMutation({
    onSuccess: (res: any) => {
      if (selectedOutlineId) {
        utils.outlines.chapters.invalidate({ outlineId: selectedOutlineId });
      }
      setNewChapter({ title: "", description: "" });
      setIsAddChapterDialogOpen(false);
      if (res?.[0]?.insertId) {
        setSelectedChapterId(res[0].insertId);
      }
    },
  });

  const deleteChapter = trpc.outlines.deleteChapter.useMutation({
    onSuccess: () => {
      if (selectedOutlineId) {
        utils.outlines.chapters.invalidate({ outlineId: selectedOutlineId });
      }
    },
  });

  const createScene = trpc.outlines.createScene.useMutation({
    onSuccess: () => {
      if (activeChapter?.id) {
        utils.outlines.scenes.invalidate({ chapterId: activeChapter.id });
      }
      setNewScene({
        title: "",
        description: "",
        wordCount: 1500,
        status: "planning",
      });
      setIsAddSceneDialogOpen(false);
    },
  });

  const deleteScene = trpc.outlines.deleteScene.useMutation({
    onSuccess: () => {
      if (activeChapter?.id) {
        utils.outlines.scenes.invalidate({ chapterId: activeChapter.id });
      }
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading outline workspace...
      </div>
    );
  }

  const handleCreateOutline = () => {
    if (!newOutline.title.trim()) return;
    createOutline.mutate({
      title: newOutline.title.trim(),
      description: newOutline.description.trim() || undefined,
    });
  };

  const handleUpdateOutline = () => {
    if (!editingOutline || !editingOutline.title.trim()) return;
    updateOutline.mutate({
      id: editingOutline.id,
      title: editingOutline.title.trim(),
      description: editingOutline.description.trim() || undefined,
      status: editingOutline.status,
    });
  };

  const handleDeleteOutline = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this story?")) {
      deleteOutline.mutate({ id });
      if (selectedOutlineId === id) {
        setSelectedOutlineId(null);
      }
    }
  };

  const handleCreateChapter = () => {
    if (!newChapter.title.trim() || !selectedOutline) return;
    createChapter.mutate({
      outlineId: selectedOutline.id,
      title: newChapter.title.trim(),
      description: newChapter.description.trim() || undefined,
      chapterNumber: chapters.length + 1,
      order: chapters.length + 1,
    });
  };

  const handleDeleteChapter = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this chapter?")) {
      deleteChapter.mutate({ id });
    }
  };

  const handleCreateScene = () => {
    if (!newScene.title.trim() || !activeChapter) return;
    createScene.mutate({
      chapterId: activeChapter.id,
      title: newScene.title.trim(),
      description: newScene.description.trim() || undefined,
      sceneNumber: scenes.length + 1,
      status: newScene.status,
      order: scenes.length + 1,
    });
  };

  const handleDeleteScene = (id: number) => {
    if (confirm("Delete this scene?")) {
      deleteScene.mutate({ id });
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header with AI and Export buttons */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            My Stories
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your story outlines, chapters, scene beats, and AI
            brainstorms
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setIsAiModalOpen(true)}
            className="border-accent-gold/40 text-accent-gold hover:bg-accent-gold/10"
          >
            <Sparkles className="w-4 h-4 mr-2 text-accent-gold" />
            AI Story Architect
          </Button>

          {selectedOutline && (
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                title="Export as Markdown (.md)"
                onClick={() =>
                  exportStoryToMarkdown(selectedOutline, chapters, characters)
                }
              >
                <Download className="w-4 h-4 mr-1.5" />
                Export .md
              </Button>
              <Button
                variant="outline"
                size="sm"
                title="Export Obsidian Vault Index"
                onClick={() =>
                  exportStoryObsidianMarkdown(
                    selectedOutline,
                    chapters,
                    characters
                  )
                }
              >
                <FileText className="w-4 h-4 mr-1.5" />
                Obsidian
              </Button>
            </div>
          )}

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Story
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Story</DialogTitle>
                <DialogDescription>
                  Start a new writing project
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Story Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter story title"
                    value={newOutline.title}
                    onChange={e =>
                      setNewOutline({ ...newOutline, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your story"
                    value={newOutline.description}
                    onChange={e =>
                      setNewOutline({
                        ...newOutline,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  onClick={handleCreateOutline}
                  disabled={createOutline.isPending}
                  className="w-full"
                >
                  {createOutline.isPending ? "Creating..." : "Create Story"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        open={isAiModalOpen}
        onOpenChange={setIsAiModalOpen}
        defaultAgentId="story-architect"
        storyId={selectedOutline?.id}
        chapterId={activeChapter?.id}
        contextTitle={selectedOutline?.title}
        contextData={`Story: ${selectedOutline?.title || ""}\nSynopsis: ${
          selectedOutline?.description || ""
        }\nChapters: ${chapters.map(c => c.title).join(", ")}`}
      />

      {/* Edit Story Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Story</DialogTitle>
            <DialogDescription>
              Update story details and status
            </DialogDescription>
          </DialogHeader>
          {editingOutline && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Story Title</Label>
                <Input
                  id="edit-title"
                  value={editingOutline.title}
                  onChange={e =>
                    setEditingOutline({
                      ...editingOutline,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className="w-full px-3 py-2 border rounded-md mt-1 bg-background text-foreground"
                  value={editingOutline.status}
                  onChange={e =>
                    setEditingOutline({
                      ...editingOutline,
                      status: e.target.value as any,
                    })
                  }
                >
                  <option value="draft">Draft / Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit-desc">Description</Label>
                <Textarea
                  id="edit-desc"
                  value={editingOutline.description}
                  onChange={e =>
                    setEditingOutline({
                      ...editingOutline,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                onClick={handleUpdateOutline}
                disabled={updateOutline.isPending}
                className="w-full"
              >
                {updateOutline.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Outlines List */}
      <div className="space-y-4">
        {outlines.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <p className="text-muted-foreground mb-4">
              No stories created yet. Start by creating your first story!
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Story
            </Button>
          </Card>
        ) : (
          outlines.map(outline => {
            const isSelected = selectedOutline?.id === outline.id;
            return (
              <Card
                key={outline.id}
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  isSelected ? "ring-2 ring-primary border-primary" : ""
                }`}
                onClick={() => {
                  setSelectedOutlineId(outline.id);
                  setSelectedChapterId(null);
                }}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <BookOpen className="w-5 h-5 text-accent-gold" />
                        <h3 className="text-xl font-semibold">
                          {outline.title}
                        </h3>
                        <Badge
                          className={
                            statusColors[
                              outline.status as keyof typeof statusColors
                            ] || "bg-blue-100 text-blue-800"
                          }
                        >
                          {statusLabels[
                            outline.status as keyof typeof statusLabels
                          ] || outline.status}
                        </Badge>
                        {isSelected && (
                          <Badge variant="outline" className="text-xs">
                            Active Selection
                          </Badge>
                        )}
                      </div>
                      {outline.description && (
                        <p className="text-muted-foreground mb-4">
                          {outline.description}
                        </p>
                      )}

                      {/* Progress Section */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">Word Count</span>
                            <span className="text-muted-foreground">
                              {(outline.wordCount ?? 0).toLocaleString()} words
                            </span>
                          </div>
                          <Progress
                            value={Math.min(
                              100,
                              ((outline.wordCount ?? 0) / 60000) * 100
                            )}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-3">
                        Last modified:{" "}
                        {outline.updatedAt
                          ? new Date(outline.updatedAt).toLocaleDateString()
                          : "Just now"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Edit Story"
                        onClick={e => {
                          e.stopPropagation();
                          setEditingOutline({
                            id: outline.id,
                            title: outline.title,
                            description: outline.description || "",
                            status: (outline.status as any) || "in_progress",
                          });
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete Story"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={e => handleDeleteOutline(outline.id, e)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOutlineId(outline.id);
                          setSelectedChapterId(null);
                        }}
                      >
                        {isSelected ? "Selected" : "Select"}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Dual-Pane Story Structure (when selected) */}
      {selectedOutline && (
        <Card className="border-t-4 border-t-primary shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 flex-wrap gap-2 border-b">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-accent-gold" />
                Structure & Scenes: {selectedOutline.title}
              </CardTitle>
              <CardDescription>
                {chapters.length} chapter(s) • Dual-pane chapter & scene
                storyboard
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Dialog
                open={isAddChapterDialogOpen}
                onOpenChange={setIsAddChapterDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Chapter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Add Chapter to {selectedOutline.title}
                    </DialogTitle>
                    <DialogDescription>
                      Create a new chapter entry in this outline
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ch-title">Chapter Title</Label>
                      <Input
                        id="ch-title"
                        placeholder="e.g., Chapter 1: The Discovery"
                        value={newChapter.title}
                        onChange={e =>
                          setNewChapter({
                            ...newChapter,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="ch-desc">Summary</Label>
                      <Textarea
                        id="ch-desc"
                        placeholder="Brief chapter overview..."
                        value={newChapter.description}
                        onChange={e =>
                          setNewChapter({
                            ...newChapter,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button
                      onClick={handleCreateChapter}
                      disabled={createChapter.isPending}
                      className="w-full"
                    >
                      {createChapter.isPending ? "Adding..." : "Save Chapter"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="storyboard" className="space-y-4">
              <TabsList>
                <TabsTrigger value="storyboard">
                  Chapters & Scenes ({chapters.length})
                </TabsTrigger>
                <TabsTrigger value="notes">Story Notes</TabsTrigger>
              </TabsList>

              {/* Dual-Pane Storyboard Tab */}
              <TabsContent value="storyboard">
                {chapters.length === 0 ? (
                  <div className="p-8 text-center border rounded-lg border-dashed text-muted-foreground text-sm">
                    No chapters created yet. Click "Add Chapter" above to start
                    structuring your story.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Left Pane: Chapters List */}
                    <div className="md:col-span-5 space-y-2 border-r pr-0 md:pr-4">
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">
                          Chapters ({chapters.length})
                        </span>
                      </div>
                      <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {chapters.map((ch, idx) => {
                          const isActive = activeChapter?.id === ch.id;
                          return (
                            <div
                              key={ch.id || idx}
                              onClick={() => setSelectedChapterId(ch.id)}
                              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                isActive
                                  ? "bg-accent/70 border-primary shadow-sm"
                                  : "hover:bg-accent/30"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-semibold text-sm truncate">
                                      {ch.chapterNumber
                                        ? `Ch ${ch.chapterNumber}: `
                                        : ""}
                                      {ch.title}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] py-0"
                                    >
                                      {ch.status || "planning"}
                                    </Badge>
                                  </div>
                                  {ch.description && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {ch.description}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 ml-2"
                                  title="Delete Chapter"
                                  onClick={e => handleDeleteChapter(ch.id, e)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Pane: Scenes Breakdown for Selected Chapter */}
                    <div className="md:col-span-7 space-y-4">
                      {activeChapter ? (
                        <>
                          <div className="flex items-center justify-between border-b pb-2">
                            <div>
                              <h4 className="font-semibold text-sm">
                                Scenes for: {activeChapter.title}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {scenes.length} scene(s) registered
                              </p>
                            </div>
                            <Dialog
                              open={isAddSceneDialogOpen}
                              onOpenChange={setIsAddSceneDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="text-xs"
                                >
                                  <Plus className="w-3.5 h-3.5 mr-1" />
                                  Add Scene
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Add Scene to {activeChapter.title}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Define a scene beat, conflict, or milestone
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="sc-title">
                                      Scene Title
                                    </Label>
                                    <Input
                                      id="sc-title"
                                      placeholder="e.g., Morning Arrival at the Port"
                                      value={newScene.title}
                                      onChange={e =>
                                        setNewScene({
                                          ...newScene,
                                          title: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="sc-desc">
                                      Scene Beats & Conflict
                                    </Label>
                                    <Textarea
                                      id="sc-desc"
                                      placeholder="What happens in this scene? What is the main tension or revelation?"
                                      value={newScene.description}
                                      onChange={e =>
                                        setNewScene({
                                          ...newScene,
                                          description: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label htmlFor="sc-status">Status</Label>
                                      <select
                                        id="sc-status"
                                        className="w-full px-3 py-2 border rounded-md mt-1 bg-background text-foreground text-sm"
                                        value={newScene.status}
                                        onChange={e =>
                                          setNewScene({
                                            ...newScene,
                                            status: e.target.value as any,
                                          })
                                        }
                                      >
                                        <option value="planning">
                                          Planning
                                        </option>
                                        <option value="writing">Writing</option>
                                        <option value="completed">
                                          Completed
                                        </option>
                                      </select>
                                    </div>
                                    <div>
                                      <Label htmlFor="sc-words">
                                        Target Words
                                      </Label>
                                      <Input
                                        id="sc-words"
                                        type="number"
                                        value={newScene.wordCount}
                                        onChange={e =>
                                          setNewScene({
                                            ...newScene,
                                            wordCount:
                                              parseInt(e.target.value) || 0,
                                          })
                                        }
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                  <Button
                                    onClick={handleCreateScene}
                                    disabled={createScene.isPending}
                                    className="w-full"
                                  >
                                    {createScene.isPending
                                      ? "Adding Scene..."
                                      : "Save Scene"}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>

                          {scenes.length === 0 ? (
                            <div className="p-6 text-center border rounded-lg border-dashed text-muted-foreground text-xs">
                              No scenes in this chapter yet. Click "Add Scene"
                              to outline your first scene beat.
                            </div>
                          ) : (
                            <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
                              {scenes.map((sc, scIdx) => (
                                <div
                                  key={sc.id || scIdx}
                                  className="p-3 border rounded-lg hover:border-primary/40 transition-colors bg-card/60"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs text-accent-gold">
                                          Scene {sc.sceneNumber || scIdx + 1}
                                        </span>
                                        <span className="font-medium text-sm">
                                          {sc.title}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className={`text-[10px] ${
                                            sc.status === "completed"
                                              ? "border-green-500 text-green-600 dark:text-green-400"
                                              : ""
                                          }`}
                                        >
                                          {sc.status || "planning"}
                                        </Badge>
                                      </div>
                                      {sc.description && (
                                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                                          {sc.description}
                                        </p>
                                      )}
                                      <div className="text-[11px] text-muted-foreground mt-2">
                                        {sc.wordCount
                                          ? `${sc.wordCount.toLocaleString()} words`
                                          : "No word count set"}
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 ml-2"
                                      title="Delete Scene"
                                      onClick={() => handleDeleteScene(sc.id)}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                          Select a chapter on the left to view and manage its
                          scenes.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-3">
                <Textarea
                  defaultValue={selectedOutline.description || ""}
                  placeholder="Add story notes, worldbuilding details, and pacing ideas..."
                  className="min-h-[160px]"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
