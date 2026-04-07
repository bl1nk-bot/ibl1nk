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
import { trpc } from "@/lib/trpc";
import { Plus, Users, Edit2, Trash2, Link as LinkIcon } from "lucide-react";

// Sample data - will be replaced with real data from tRPC
const sampleCharacters = [
  {
    id: 1,
    name: "Aria",
    role: "protagonist",
    traits: ["brave", "curious", "determined", "compassionate"],
    description: "A 32-year-old woman searching for her lost past",
    relationships: 3,
    appearances: 24,
  },
  {
    id: 2,
    name: "Marcus",
    role: "mentor",
    traits: ["wise", "mysterious", "protective", "secretive"],
    description: "An old friend who returns with secrets",
    relationships: 2,
    appearances: 12,
  },
  {
    id: 3,
    name: "Elena",
    role: "antagonist",
    traits: ["ambitious", "ruthless", "intelligent", "cold"],
    description: "A powerful businesswoman with hidden motives",
    relationships: 2,
    appearances: 8,
  },
  {
    id: 4,
    name: "James",
    role: "supporting",
    traits: ["loyal", "humorous", "reliable"],
    description: "Aria's best friend and confidant",
    relationships: 1,
    appearances: 15,
  },
];

const roleColors = {
  protagonist: "bg-blue-100 text-blue-800",
  antagonist: "bg-red-100 text-red-800",
  mentor: "bg-purple-100 text-purple-800",
  supporting: "bg-green-100 text-green-800",
  minor: "bg-gray-100 text-gray-800",
};

const roleLabels = {
  protagonist: "Protagonist",
  antagonist: "Antagonist",
  mentor: "Mentor",
  supporting: "Supporting",
  minor: "Minor",
};

export default function Characters() {
  const { isAuthenticated } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<typeof sampleCharacters[0] | null>(null);
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    role: "supporting",
    description: "",
    traits: "",
  });

  // TODO: Replace with actual tRPC queries
  // const { data: characters } = trpc.characters.listByUser.useQuery();
  // const createCharacter = trpc.characters.create.useMutation();

  if (!isAuthenticated) {
    return <div>Please log in to view characters</div>;
  }

  const handleCreateCharacter = () => {
    // TODO: Call tRPC mutation
    console.log("Creating character:", newCharacter);
    setNewCharacter({ name: "", role: "supporting", description: "", traits: "" });
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Characters</h1>
          <p className="text-muted-foreground mt-2">Manage your story characters and relationships</p>
        </div>
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
                  <option value="minor">Minor</option>
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

      {/* Characters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sampleCharacters.map((character) => (
          <Card 
            key={character.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedCharacter(character)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{character.name}</h3>
                  <Badge className={roleColors[character.role as keyof typeof roleColors]}>
                    {roleLabels[character.role as keyof typeof roleLabels]}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{character.description}</p>

              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Traits</p>
                  <div className="flex flex-wrap gap-1">
                    {character.traits.map((trait) => (
                      <Badge key={trait} variant="secondary" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Relationships</p>
                    <p className="text-lg font-semibold">{character.relationships}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Appearances</p>
                    <p className="text-lg font-semibold">{character.appearances}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Character Detail View */}
      {selectedCharacter && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedCharacter.name}</CardTitle>
            <CardDescription>
              {roleLabels[selectedCharacter.role as keyof typeof roleLabels]} • {selectedCharacter.appearances} appearances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="relationships">Relationships</TabsTrigger>
                <TabsTrigger value="arc">Character Arc</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
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

                <div>
                  <h4 className="font-semibold mb-2">Physical Description</h4>
                  <Textarea placeholder="Add physical description..." />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Background</h4>
                  <Textarea placeholder="Add character background..." />
                </div>
              </TabsContent>

              {/* Relationships Tab */}
              <TabsContent value="relationships" className="space-y-3">
                <div className="space-y-2">
                  {[
                    { name: "Marcus", type: "Mentor" },
                    { name: "Elena", type: "Rival" },
                    { name: "James", type: "Friend" },
                  ].map((rel) => (
                    <div key={rel.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{rel.name}</p>
                        <p className="text-sm text-muted-foreground">{rel.type}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Relationship
                </Button>
              </TabsContent>

              {/* Character Arc Tab */}
              <TabsContent value="arc" className="space-y-3">
                <div className="space-y-2">
                  {[
                    { chapter: "Chapter 1", event: "Discovers the letter", emotion: "Curious" },
                    { chapter: "Chapter 4", event: "Meets Marcus again", emotion: "Conflicted" },
                    { chapter: "Chapter 8", event: "Confronts Elena", emotion: "Determined" },
                  ].map((arc, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{arc.chapter}</p>
                          <p className="text-sm text-muted-foreground">{arc.event}</p>
                        </div>
                        <Badge variant="secondary">{arc.emotion}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Arc Event
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Relationship Map Section */}
      <Card>
        <CardHeader>
          <CardTitle>Character Relationship Map</CardTitle>
          <CardDescription>Visual overview of character connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-8 rounded-lg text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Mermaid diagram will render here</p>
            <p className="text-sm">Showing relationships between all characters</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
