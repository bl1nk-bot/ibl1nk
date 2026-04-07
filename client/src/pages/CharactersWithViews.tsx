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
import { Plus, Users } from "lucide-react";

// Sample character data
const sampleCharacters = [
  {
    id: 1,
    name: "Aria",
    role: "protagonist",
    traits: ["brave", "curious", "determined"],
    description: "A 32-year-old woman searching for her lost past",
    image: "https://via.placeholder.com/300x400?text=Aria",
    appearances: 24,
  },
  {
    id: 2,
    name: "Marcus",
    role: "mentor",
    traits: ["wise", "mysterious", "protective"],
    description: "An old friend who returns with secrets",
    image: "https://via.placeholder.com/300x400?text=Marcus",
    appearances: 12,
  },
  {
    id: 3,
    name: "Elena",
    role: "antagonist",
    traits: ["ambitious", "ruthless", "intelligent"],
    description: "A powerful businesswoman with hidden motives",
    image: "https://via.placeholder.com/300x400?text=Elena",
    appearances: 8,
  },
  {
    id: 4,
    name: "James",
    role: "supporting",
    traits: ["loyal", "humorous", "reliable"],
    description: "Aria's best friend and confidant",
    image: "https://via.placeholder.com/300x400?text=James",
    appearances: 15,
  },
];

const roleColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  protagonist: "default",
  antagonist: "destructive",
  mentor: "secondary",
  supporting: "outline",
};

export default function CharactersWithViews() {
  const { isAuthenticated } = useAuth();
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<(typeof sampleCharacters)[0] | null>(null);
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    role: "supporting",
    description: "",
    traits: "",
  });

  if (!isAuthenticated) {
    return <div className="p-4">Please log in to view characters</div>;
  }

  const handleCreateCharacter = () => {
    console.log("Creating character:", newCharacter);
    setNewCharacter({ name: "", role: "supporting", description: "", traits: "" });
    setIsCreateDialogOpen(false);
  };

  // Convert to Grid View format
  const gridItems: GridItem[] = sampleCharacters.map((char) => ({
    id: char.id,
    title: char.name,
    description: char.description,
    badge: char.role.charAt(0).toUpperCase() + char.role.slice(1),
    badgeVariant: roleColors[char.role],
    tags: char.traits,
    stats: [
      { label: "Appearances", value: char.appearances },
      { label: "Role", value: char.role },
    ],
    onEdit: () => setSelectedCharacter(char),
    onDelete: () => console.log("Delete:", char.id),
  }));

  // Convert to List View format
  const listItems: ListItem[] = sampleCharacters.map((char) => ({
    id: char.id,
    title: char.name,
    description: char.description,
    badge: char.role.charAt(0).toUpperCase() + char.role.slice(1),
    badgeVariant: roleColors[char.role],
    tags: char.traits,
    stats: [
      { label: "Appearances", value: char.appearances },
      { label: "Role", value: char.role },
    ],
    metadata: `Last modified: 2 days ago`,
    onEdit: () => setSelectedCharacter(char),
    onDelete: () => console.log("Delete:", char.id),
    onClick: () => setSelectedCharacter(char),
  }));

  // Convert to Gallery View format
  const galleryItems: GalleryItem[] = sampleCharacters.map((char) => ({
    id: char.id,
    title: char.name,
    description: char.description,
    image: char.image,
    badge: char.role.charAt(0).toUpperCase() + char.role.slice(1),
    badgeVariant: roleColors[char.role],
    tags: char.traits,
    onEdit: () => setSelectedCharacter(char),
    onDelete: () => console.log("Delete:", char.id),
    onClick: () => setSelectedCharacter(char),
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
                      className="w-full px-3 py-2 border rounded-md"
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
                      onChange={(e) =>
                        setNewCharacter({ ...newCharacter, description: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="traits">Traits (comma-separated)</Label>
                    <Input
                      id="traits"
                      placeholder="e.g., brave, intelligent, mysterious"
                      value={newCharacter.traits}
                      onChange={(e) => setNewCharacter({ ...newCharacter, traits: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateCharacter} className="w-full">
                    Create Character
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Views */}
        {viewType === "grid" && <GridView items={gridItems} columns={3} />}
        {viewType === "list" && <ListView items={listItems} />}
        {viewType === "gallery" && <GalleryView items={galleryItems} columns={3} />}

        {/* Character Detail */}
        {selectedCharacter && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedCharacter.name}</CardTitle>
                  <CardDescription>
                    {selectedCharacter.role.charAt(0).toUpperCase() + selectedCharacter.role.slice(1)} •{" "}
                    {selectedCharacter.appearances} appearances
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setSelectedCharacter(null)}>
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
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedCharacter.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Traits</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCharacter.traits.map((trait) => (
                        <Badge key={trait}>{trait}</Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="relationships">
                  <p className="text-muted-foreground text-sm">Relationship details coming soon</p>
                </TabsContent>

                <TabsContent value="arc">
                  <p className="text-muted-foreground text-sm">Character arc details coming soon</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
