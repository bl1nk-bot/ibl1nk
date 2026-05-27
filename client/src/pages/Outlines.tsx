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
import { Plus, BookOpen, Edit2, Trash2, ChevronRight } from "lucide-react";
import { Link } from "wouter";

// Sample data - will be replaced with real data from tRPC
const sampleOutlines = [
  {
    id: 1,
    title: "The Lost Kingdom",
    description: "A fantasy epic about rediscovering a hidden realm",
    status: "in_progress",
    chapters: 12,
    completedChapters: 8,
    wordCount: 45230,
    wordTarget: 60000,
    lastModified: "2 hours ago",
  },
  {
    id: 2,
    title: "Whispers of Change",
    description: "A contemporary drama about personal transformation",
    status: "in_progress",
    chapters: 10,
    completedChapters: 5,
    wordCount: 28500,
    wordTarget: 50000,
    lastModified: "1 day ago",
  },
  {
    id: 3,
    title: "Untitled Project",
    description: "A mystery novel set in a small coastal town",
    status: "planning",
    chapters: 8,
    completedChapters: 2,
    wordCount: 5200,
    wordTarget: 40000,
    lastModified: "3 days ago",
  },
];

const statusColors = {
  planning: "bg-gray-100 text-gray-800",
  writing: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  reviewing: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
};

const statusLabels = {
  planning: "Planning",
  writing: "Writing",
  in_progress: "In Progress",
  reviewing: "Reviewing",
  completed: "Completed",
};

export default function Outlines() {
  const { isAuthenticated } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newOutline, setNewOutline] = useState({ title: "", description: "" });

  // TODO: Replace with actual tRPC queries
  // const { data: outlines, isLoading } = trpc.outlines.list.useQuery();
  // const createOutline = trpc.outlines.create.useMutation();

  if (!isAuthenticated) {
    return <div>Please log in to view outlines</div>;
  }

  const handleCreateOutline = () => {
    // TODO: Call tRPC mutation
    console.log("Creating outline:", newOutline);
    setNewOutline({ title: "", description: "" });
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Stories</h1>
          <p className="text-muted-foreground mt-2">
            Manage your story outlines and chapters
          </p>
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
              <Button onClick={handleCreateOutline} className="w-full">
                Create Story
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Outlines List */}
      <div className="space-y-4">
        {sampleOutlines.map(outline => (
          <Card key={outline.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-accent-gold" />
                    <h3 className="text-xl font-semibold">{outline.title}</h3>
                    <Badge
                      className={
                        statusColors[
                          outline.status as keyof typeof statusColors
                        ]
                      }
                    >
                      {
                        statusLabels[
                          outline.status as keyof typeof statusLabels
                        ]
                      }
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {outline.description}
                  </p>

                  {/* Progress Section */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Chapters</span>
                        <span className="text-muted-foreground">
                          {outline.completedChapters} / {outline.chapters}
                        </span>
                      </div>
                      <Progress
                        value={
                          (outline.completedChapters / outline.chapters) * 100
                        }
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Word Count</span>
                        <span className="text-muted-foreground">
                          {outline.wordCount.toLocaleString()} /{" "}
                          {outline.wordTarget.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={(outline.wordCount / outline.wordTarget) * 100}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3">
                    Last modified: {outline.lastModified}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="default" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Outline Detail View (when selected) */}
      <Card>
        <CardHeader>
          <CardTitle>Story Structure: The Lost Kingdom</CardTitle>
          <CardDescription>12 chapters, 8 completed</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chapters" className="space-y-4">
            <TabsList>
              <TabsTrigger value="chapters">Chapters</TabsTrigger>
              <TabsTrigger value="scenes">Scenes</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            {/* Chapters Tab */}
            <TabsContent value="chapters" className="space-y-3">
              {[1, 2, 3, 4, 5].map(ch => (
                <div
                  key={ch}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Chapter {ch}</span>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The Awakening - 4,250 words
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Chapter
              </Button>
            </TabsContent>

            {/* Scenes Tab */}
            <TabsContent value="scenes" className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Select a chapter to view its scenes
              </p>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes">
              <Textarea placeholder="Add notes about this story..." />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
