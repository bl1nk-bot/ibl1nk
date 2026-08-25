import { useState, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ViewToggle, type ViewType } from "@/components/ViewToggle";
import { GridView, type GridItem } from "@/components/GridView";
import { ListView, type ListItem } from "@/components/ListView";
import { GalleryView, type GalleryItem } from "@/components/GalleryView";
import { trpc } from "@/lib/trpc";
import { Plus, Users, Sparkles, Trash2 } from "lucide-react";
import { AiAssistantModal } from "@/components/AiAssistantModal";

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

const roleColors: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  protagonist: "default",
  antagonist: "destructive",
  mentor: "secondary",
  supporting: "outline",
};

export default function CharactersWithViews() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const charactersQuery = trpc.characters.listByUser.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createCharacterMutation = trpc.characters.create.useMutation({
    onSuccess: () => {
      utils.characters.listByUser.invalidate();
      setNewCharacter({
        name: "",
        role: "supporting",
        description: "",
        traits: "",
        imageUrl: "",
      });
      setIsCreateDialogOpen(false);
    },
  });

  const updateCharacterMutation = trpc.characters.update.useMutation({
    onSuccess: () => {
      utils.characters.listByUser.invalidate();
      setIsEditDialogOpen(false);
    },
  });

  const deleteCharacterMutation = trpc.characters.delete.useMutation({
    onSuccess: () => {
      utils.characters.listByUser.invalidate();
      setSelectedCharacter(null);
    },
  });

  const addRelationshipMutation = trpc.characters.addRelationship.useMutation({
    onSuccess: () => {
      if (selectedCharacter) {
        utils.characters.relationships.invalidate({
          characterId: selectedCharacter.id,
        });
      }
      setIsAddRelDialogOpen(false);
      setNewRel({ targetCharId: 0, type: "ally", description: "" });
    },
  });

  const deleteRelationshipMutation =
    trpc.characters.deleteRelationship.useMutation({
      onSuccess: () => {
        if (selectedCharacter) {
          utils.characters.relationships.invalidate({
            characterId: selectedCharacter.id,
          });
        }
      },
    });

  const characters = (charactersQuery.data ?? []).map(character => ({
    ...character,
    role: character.role || "supporting",
    traits: character.traits
      ? character.traits
          .split(",")
          .map((trait: string) => trait.trim())
          .filter(Boolean)
      : [],
    image: character.imageUrl || undefined,
    appearances: 8,
  }));

  const [viewType, setViewType] = useState<ViewType>("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddRelDialogOpen, setIsAddRelDialogOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const [selectedCharacter, setSelectedCharacter] = useState<any | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<{
    id: number;
    name: string;
    role: string;
    description: string;
    traits: string;
  } | null>(null);

  const [newCharacter, setNewCharacter] = useState({
    name: "",
    role: "supporting",
    description: "",
    traits: "",
    imageUrl: "",
  });

  const [newRel, setNewRel] = useState({
    targetCharId: 0,
    type: "ally",
    description: "",
  });

  const [characterArc, setCharacterArc] = useState({
    flaw: "Struggles with trusting others due to past betrayal.",
    inciting: "Forced into an uneasy partnership to protect the kingdom.",
    midpoint: "Discovers that vulnerability is not weakness.",
    climax: "Sacrifices personal safety to save their allies.",
    resolution: "Emerges as a true leader who inspires rather than controls.",
  });
  const [arcSaved, setArcSaved] = useState(false);

  // Relationships query for selected character
  const relsQuery = trpc.characters.relationships.useQuery(
    { characterId: selectedCharacter?.id ?? 0 },
    { enabled: Boolean(selectedCharacter?.id) }
  );
  const relationships = relsQuery.data ?? [];

  const handleDeleteCharacter = (id: number) => {
    if (confirm("Are you sure you want to delete this character?")) {
      deleteCharacterMutation.mutate({ id });
    }
  };

  const handleOpenEdit = (char: any) => {
    setEditingCharacter({
      id: char.id,
      name: char.name,
      role: char.role,
      description: char.description || "",
      traits: Array.isArray(char.traits)
        ? char.traits.join(", ")
        : char.traits || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingCharacter || !editingCharacter.name.trim()) return;
    updateCharacterMutation.mutate({
      id: editingCharacter.id,
      name: editingCharacter.name.trim(),
      role: editingCharacter.role,
      description: editingCharacter.description.trim() || undefined,
      traits: editingCharacter.traits.trim() || undefined,
    });
  };

  const handleAddRelationship = () => {
    if (!selectedCharacter || !newRel.targetCharId) return;
    addRelationshipMutation.mutate({
      character1Id: selectedCharacter.id,
      character2Id: Number(newRel.targetCharId),
      relationshipType: newRel.type,
      description: newRel.description || undefined,
    });
  };

  const handleSaveArc = () => {
    setArcSaved(true);
    setTimeout(() => setArcSaved(false), 2500);
  };

  // Convert to Grid View format
  const gridItems: GridItem[] = useMemo(
    () =>
      characters.map(char => ({
        id: char.id,
        title: char.name,
        description: char.description || undefined,
        badge: char.role.charAt(0).toUpperCase() + char.role.slice(1),
        badgeVariant: roleColors[char.role] || "secondary",
        tags: char.traits,
        stats: [
          { label: "Appearances", value: char.appearances },
          { label: "Role", value: char.role },
        ],
        onEdit: () => handleOpenEdit(char),
        onDelete: () => handleDeleteCharacter(char.id),
      })),
    [characters]
  );

  // Convert to List View format
  const listItems: ListItem[] = useMemo(
    () =>
      characters.map(char => ({
        id: char.id,
        title: char.name,
        description: char.description || undefined,
        badge: char.role.charAt(0).toUpperCase() + char.role.slice(1),
        badgeVariant: roleColors[char.role] || "secondary",
        tags: char.traits,
        stats: [
          { label: "Appearances", value: char.appearances },
          { label: "Role", value: char.role },
        ],
        metadata: `Registered character`,
        onEdit: () => handleOpenEdit(char),
        onDelete: () => handleDeleteCharacter(char.id),
        onClick: () => setSelectedCharacter(char),
      })),
    [characters]
  );

  // Convert to Gallery View format
  const galleryItems: GalleryItem[] = useMemo(
    () =>
      characters.map(char => ({
        id: char.id,
        title: char.name,
        description: char.description || undefined,
        image: char.image,
        badge: char.role.charAt(0).toUpperCase() + char.role.slice(1),
        badgeVariant: roleColors[char.role] || "secondary",
        tags: char.traits,
        onEdit: () => handleOpenEdit(char),
        onDelete: () => handleDeleteCharacter(char.id),
        onClick: () => setSelectedCharacter(char),
      })),
    [characters]
  );

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading characters...
      </div>
    );
  }

  const handleCreateCharacter = () => {
    if (!newCharacter.name.trim()) return;
    createCharacterMutation.mutate({
      name: newCharacter.name.trim(),
      role: newCharacter.role,
      description: newCharacter.description.trim() || undefined,
      traits: newCharacter.traits.trim() || undefined,
      imageUrl: newCharacter.imageUrl || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Characters</h1>
            <p className="text-muted-foreground mt-1">
              Manage character profiles, psychological arcs, and relational
              dynamics
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setIsAiModalOpen(true)}
              className="border-accent-gold/40 text-accent-gold hover:bg-accent-gold/10"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Character Deepen
            </Button>
            <ViewToggle value={viewType} onChange={setViewType} />
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Character
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Character</DialogTitle>
                  <DialogDescription>
                    Add a new character to your story cast
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Character Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter character name"
                      value={newCharacter.name}
                      onChange={e =>
                        setNewCharacter({
                          ...newCharacter,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                      value={newCharacter.role}
                      onChange={e =>
                        setNewCharacter({
                          ...newCharacter,
                          role: e.target.value,
                        })
                      }
                    >
                      <option value="protagonist">Protagonist</option>
                      <option value="antagonist">Antagonist</option>
                      <option value="mentor">Mentor</option>
                      <option value="supporting">Supporting</option>
                      <option value="deuteragonist">Deuteragonist</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe their background, voice, and core drive..."
                      value={newCharacter.description}
                      onChange={e =>
                        setNewCharacter({
                          ...newCharacter,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="character-image">Portrait image</Label>
                    <Input
                      id="character-image"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={event => {
                        const file = event.target.files?.[0];
                        if (!file || file.size > 2 * 1024 * 1024) return;
                        const reader = new FileReader();
                        reader.onload = () =>
                          setNewCharacter(current => ({
                            ...current,
                            imageUrl: typeof reader.result === "string" ? reader.result : "",
                          }));
                        reader.readAsDataURL(file);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">PNG, JPG, or WebP up to 2 MB.</p>
                  </div>
                  <div>
                    <Label htmlFor="traits">Traits (comma-separated)</Label>
                    <Input
                      id="traits"
                      placeholder="e.g., brave, calculating, haunted, loyal"
                      value={newCharacter.traits}
                      onChange={e =>
                        setNewCharacter({
                          ...newCharacter,
                          traits: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    onClick={handleCreateCharacter}
                    disabled={createCharacterMutation.isPending}
                    className="w-full"
                  >
                    {createCharacterMutation.isPending
                      ? "Creating..."
                      : "Create Character"}
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
          defaultAgentId="character-psychologist"
          contextTitle={selectedCharacter?.name || "Cast Overview"}
          contextData={
            selectedCharacter
              ? `Character: ${selectedCharacter.name}\nRole: ${
                  selectedCharacter.role
                }\nTraits: ${selectedCharacter.traits?.join(", ")}\nBio: ${
                  selectedCharacter.description || ""
                }`
              : `All Characters: ${characters.map(c => `${c.name} (${c.role})`).join(", ")}`
          }
        />

        {/* Edit Character Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Character</DialogTitle>
              <DialogDescription>Modify character profile</DialogDescription>
            </DialogHeader>
            {editingCharacter && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-cname">Character Name</Label>
                  <Input
                    id="edit-cname"
                    value={editingCharacter.name}
                    onChange={e =>
                      setEditingCharacter({
                        ...editingCharacter,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-crole">Role</Label>
                  <select
                    id="edit-crole"
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                    value={editingCharacter.role}
                    onChange={e =>
                      setEditingCharacter({
                        ...editingCharacter,
                        role: e.target.value,
                      })
                    }
                  >
                    <option value="protagonist">Protagonist</option>
                    <option value="antagonist">Antagonist</option>
                    <option value="mentor">Mentor</option>
                    <option value="supporting">Supporting</option>
                    <option value="deuteragonist">Deuteragonist</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-cdesc">Description</Label>
                  <Textarea
                    id="edit-cdesc"
                    value={editingCharacter.description}
                    onChange={e =>
                      setEditingCharacter({
                        ...editingCharacter,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-ctraits">Traits (comma-separated)</Label>
                  <Input
                    id="edit-ctraits"
                    value={editingCharacter.traits}
                    onChange={e =>
                      setEditingCharacter({
                        ...editingCharacter,
                        traits: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  onClick={handleSaveEdit}
                  disabled={updateCharacterMutation.isPending}
                  className="w-full"
                >
                  {updateCharacterMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Views */}
        {viewType === "grid" && <GridView items={gridItems} columns={3} />}
        {viewType === "list" && <ListView items={listItems} />}
        {viewType === "gallery" && (
          <GalleryView items={galleryItems} columns={3} />
        )}

        {/* Character Detail & Relationships Matrix */}
        {selectedCharacter && (
          <Card className="border-t-4 border-t-primary shadow-sm">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl font-bold">
                      {selectedCharacter.name}
                    </CardTitle>
                    <Badge
                      className={
                        roleColors[selectedCharacter.role] || "bg-secondary"
                      }
                    >
                      {selectedCharacter.role.charAt(0).toUpperCase() +
                        selectedCharacter.role.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="mt-1">
                    Character dossier, relationship graph, and narrative arc
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(selectedCharacter)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCharacter(selectedCharacter.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCharacter(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="details" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                  <TabsTrigger value="details">Bio & Traits</TabsTrigger>
                  <TabsTrigger value="relationships">
                    Relationships ({relationships.length})
                  </TabsTrigger>
                  <TabsTrigger value="arc">Character Arc</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1.5">
                      Backstory & Personality
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedCharacter.description ||
                        "No description provided."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Key Traits</h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedCharacter.traits || []).map((trait: string) => (
                        <Badge key={trait} variant="secondary">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Relationships Tab (Fully Interactive) */}
                <TabsContent value="relationships" className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h4 className="font-semibold text-sm">
                        Connections with Other Characters
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Define allies, rivals, mentors, and underlying tensions
                      </p>
                    </div>
                    <Dialog
                      open={isAddRelDialogOpen}
                      onOpenChange={setIsAddRelDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          Add Connection
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Add Relationship for {selectedCharacter.name}
                          </DialogTitle>
                          <DialogDescription>
                            Connect {selectedCharacter.name} to another
                            character
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="rel-target">Target Character</Label>
                            <select
                              id="rel-target"
                              className="w-full px-3 py-2 border rounded-md mt-1 bg-background text-foreground text-sm"
                              value={newRel.targetCharId}
                              onChange={e =>
                                setNewRel({
                                  ...newRel,
                                  targetCharId: parseInt(e.target.value) || 0,
                                })
                              }
                            >
                              <option value="0">-- Select Character --</option>
                              {characters
                                .filter(c => c.id !== selectedCharacter.id)
                                .map(c => (
                                  <option key={c.id} value={c.id}>
                                    {c.name} ({c.role})
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="rel-type">Relationship Type</Label>
                            <select
                              id="rel-type"
                              className="w-full px-3 py-2 border rounded-md mt-1 bg-background text-foreground text-sm"
                              value={newRel.type}
                              onChange={e =>
                                setNewRel({ ...newRel, type: e.target.value })
                              }
                            >
                              <option value="ally">Ally / Friend</option>
                              <option value="rival">Rival / Competitor</option>
                              <option value="mentor">Mentor / Guide</option>
                              <option value="enemy">Enemy / Nemesis</option>
                              <option value="family">Family / Relative</option>
                              <option value="love_interest">
                                Love Interest
                              </option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="rel-desc">
                              Dynamic Description
                            </Label>
                            <Textarea
                              id="rel-desc"
                              placeholder="e.g., Deep trust built over years of surviving in the archives together..."
                              value={newRel.description}
                              onChange={e =>
                                setNewRel({
                                  ...newRel,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <Button
                            onClick={handleAddRelationship}
                            disabled={
                              !newRel.targetCharId ||
                              addRelationshipMutation.isPending
                            }
                            className="w-full"
                          >
                            {addRelationshipMutation.isPending
                              ? "Adding..."
                              : "Save Connection"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {relationships.length === 0 ? (
                    <div className="p-6 text-center border rounded-lg border-dashed text-muted-foreground text-xs">
                      No connections mapped yet. Click "Add Connection" to link{" "}
                      {selectedCharacter.name} with other characters.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {relationships.map((rel: any) => {
                        const otherCharId =
                          rel.character1Id === selectedCharacter.id
                            ? rel.character2Id
                            : rel.character1Id;
                        const otherChar = characters.find(
                          c => c.id === otherCharId
                        );

                        return (
                          <div
                            key={rel.id}
                            className="p-3 border rounded-lg bg-card/60 flex items-start justify-between"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">
                                  {otherChar?.name ||
                                    `Character #${otherCharId}`}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] capitalize"
                                >
                                  {rel.relationshipType}
                                </Badge>
                              </div>
                              {rel.description && (
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                  {rel.description}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 ml-2"
                              title="Delete Relationship"
                              onClick={() =>
                                deleteRelationshipMutation.mutate({
                                  id: rel.id,
                                })
                              }
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>

                {/* Character Arc Tab (5 Stages) */}
                <TabsContent value="arc" className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h4 className="font-semibold text-sm">
                        5-Stage Character Transformation Arc
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Track emotional and psychological growth throughout the
                        narrative
                      </p>
                    </div>
                    <Button size="sm" onClick={handleSaveArc}>
                      {arcSaved ? "Saved!" : "Save Arc"}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        key: "flaw",
                        stage: "1. Starting Flaw & Misbelief",
                        desc: "What internal lie or fear holds them back at the beginning?",
                      },
                      {
                        key: "inciting",
                        stage: "2. Inciting Call & Resistance",
                        desc: "How are they pushed out of their comfort zone?",
                      },
                      {
                        key: "midpoint",
                        stage: "3. Midpoint Shift / Epiphany",
                        desc: "What moment shatters their old worldview?",
                      },
                      {
                        key: "climax",
                        stage: "4. Climax Moral Choice",
                        desc: "The critical crossroad: old flaw vs true transformation.",
                      },
                      {
                        key: "resolution",
                        stage: "5. Resolution & New Self",
                        desc: "Who have they become after the journey?",
                      },
                    ].map(stageItem => (
                      <div
                        key={stageItem.key}
                        className="p-3 border rounded-lg bg-card/40 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold text-accent-gold">
                            {stageItem.stage}
                          </Label>
                          <span className="text-[11px] text-muted-foreground">
                            {stageItem.desc}
                          </span>
                        </div>
                        <Textarea
                          value={(characterArc as any)[stageItem.key]}
                          onChange={e =>
                            setCharacterArc({
                              ...characterArc,
                              [stageItem.key]: e.target.value,
                            })
                          }
                          className="text-xs min-h-[60px] resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
