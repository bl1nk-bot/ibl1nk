import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ViewToggle, type ViewType } from "@/components/ViewToggle";
import { GridView, type GridItem } from "@/components/GridView";
import { ListView, type ListItem } from "@/components/ListView";
import { GalleryView, type GalleryItem } from "@/components/GalleryView";
import { trpc } from "@/lib/trpc";
import { Plus, Users } from "lucide-react";

const ROLE_COLORS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  protagonist: "default",
  antagonist: "destructive",
  mentor: "secondary",
  supporting: "outline",
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function parseTraits(traits: string | null | undefined): string[] {
  if (!traits) return [];
  return traits.split(",").map((t) => t.trim()).filter(Boolean);
}

export default function CharactersWithViews() {
  const { isAuthenticated } = useAuth();
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    role: "supporting",
    description: "",
    traits: "",
  });

  const { data: characters = [], isLoading } = trpc.characters.listByUser.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const utils = trpc.useUtils();
  const createMutation = trpc.characters.create.useMutation({
    onSuccess: () => {
      utils.characters.listByUser.invalidate();
      setNewCharacter({ name: "", role: "supporting", description: "", traits: "" });
      setIsCreateDialogOpen(false);
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Please log in to view characters.</p>
      </div>
    );
  }

  const handleCreate = () => {
    if (!newCharacter.name.trim()) return;
    createMutation.mutate({
      name: newCharacter.name.trim(),
      role: newCharacter.role || undefined,
      description: newCharacter.description.trim() || undefined,
      traits: newCharacter.traits.trim() || undefined,
    });
  };

  const selectedCharacter = characters.find((c) => c.id === selectedId) ?? null;

  const gridItems: GridItem[] = characters.map((char) => ({
    id: char.id,
    title: char.name,
    description: char.description ?? "",
    badge: capitalize(char.role ?? "supporting"),
    badgeVariant: ROLE_COLORS[char.role ?? "supporting"] ?? "outline",
    tags: parseTraits(char.traits),
    stats: [{ label: "Role", value: char.role ?? "supporting" }],
    onEdit: () => setSelectedId(char.id),
    onDelete: () => {},
  }));

  const listItems: ListItem[] = characters.map((char) => ({
    id: char.id,
    title: char.name,
    description: char.description ?? "",
    badge: capitalize(char.role ?? "supporting"),
    badgeVariant: ROLE_COLORS[char.role ?? "supporting"] ?? "outline",
    tags: parseTraits(char.traits),
    stats: [{ label: "Role", value: char.role ?? "supporting" }],
    metadata: `Created ${new Date(char.createdAt).toLocaleDateString()}`,
    onEdit: () => setSelectedId(char.id),
    onDelete: () => {},
    onClick: () => setSelectedId(char.id),
  }));

  const galleryItems: GalleryItem[] = characters.map((char) => ({
    id: char.id,
    title: char.name,
    description: char.description ?? "",
    image: undefined,
    badge: capitalize(char.role ?? "supporting"),
    badgeVariant: ROLE_COLORS[char.role ?? "supporting"] ?? "outline",
    tags: parseTraits(char.traits),
    onEdit: () => setSelectedId(char.id),
    onDelete: () => {},
    onClick: () => setSelectedId(char.id),
  }));

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Characters</h1>
            <p className="text-muted-foreground mt-1">Manage your story characters</p>
          </div>
          <div className="flex gap-2">
            <ViewToggle value={viewType} onChange={setViewType} />
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Character
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Character</DialogTitle>
                  <DialogDescription>Add a new character to your story</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Character Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter character name"
                      value={newCharacter.name}
                      onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                      value={newCharacter.role}
                      onChange={(e) => setNewCharacter({ ...newCharacter, role: e.target.value })}
                    >
                      <option value="protagonist">Protagonist</option>
                      <option value="antagonist">Antagonist</option>
                      <option value="mentor">Mentor</option>
                      <option value="supporting">Supporting</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the character"
                      value={newCharacter.description}
                      onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="traits">Traits (comma-separated)</Label>
                    <Input
                      id="traits"
                      placeholder="e.g. brave, intelligent, mysterious"
                      value={newCharacter.traits}
                      onChange={(e) => setNewCharacter({ ...newCharacter, traits: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={handleCreate}
                    className="w-full"
                    disabled={createMutation.isPending || !newCharacter.name.trim()}
                  >
                    {createMutation.isPending ? "Creating..." : "Create Character"}
                  </Button>
                  {createMutation.error && (
                    <p className="text-sm text-destructive">{createMutation.error.message}</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading characters...</p>
        )}

        {/* Empty state */}
        {!isLoading && characters.length === 0 && (
          <Card>
            <CardContent className="p-10 text-center">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium mb-1">No characters yet</p>
              <p className="text-sm text-muted-foreground mb-4">Add your first character to get started.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Character
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Views */}
        {!isLoading && characters.length > 0 && (
          <>
            {viewType === "grid" && <GridView items={gridItems} columns={3} />}
            {viewType === "list" && <ListView items={listItems} />}
            {viewType === "gallery" && <GalleryView items={galleryItems} columns={3} />}
          </>
        )}

        {/* Character Detail Panel */}
        {selectedCharacter && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedCharacter.name}</CardTitle>
                  <CardDescription>
                    {capitalize(selectedCharacter.role ?? "supporting")}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedId(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="relationships">Relationships</TabsTrigger>
                  <TabsTrigger value="arc">Character Arc</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  {selectedCharacter.description && (
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-muted-foreground text-sm">{selectedCharacter.description}</p>
                    </div>
                  )}
                  {selectedCharacter.traits && (
                    <div>
                      <h4 className="font-semibold mb-2">Traits</h4>
                      <div className="flex flex-wrap gap-2">
                        {parseTraits(selectedCharacter.traits).map((trait) => (
                          <Badge key={trait} variant="secondary">{trait}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {!selectedCharacter.description && !selectedCharacter.traits && (
                    <p className="text-sm text-muted-foreground">No details added yet.</p>
                  )}
                </TabsContent>

                <TabsContent value="relationships">
                  <p className="text-sm text-muted-foreground">Relationship tracking coming soon.</p>
                </TabsContent>

                <TabsContent value="arc">
                  <p className="text-sm text-muted-foreground">Character arc details coming soon.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
