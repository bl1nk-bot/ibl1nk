import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  Sparkles,
  Copy,
  Check,
  Bot,
  Zap,
  Key,
  Layers,
  Compass,
  Brain,
  Feather,
  ShieldCheck,
} from "lucide-react";
import { Link } from "wouter";

interface AiAssistantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultAgentId?: string;
  contextTitle?: string;
  contextData?: string;
  storyId?: number;
  chapterId?: number;
  onInsertResult?: (text: string) => void;
}

export function AiAssistantModal({
  open,
  onOpenChange,
  defaultAgentId = "story-architect",
  contextTitle,
  contextData,
  storyId,
  chapterId,
  onInsertResult,
}: AiAssistantModalProps) {
  const [selectedAgentId, setSelectedAgentId] = useState(defaultAgentId);
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const savedApiKey =
    typeof window !== "undefined"
      ? localStorage.getItem("user_ai_api_key") || ""
      : "";
  const savedProvider = (
    typeof window !== "undefined"
      ? localStorage.getItem("ai_provider")
      : "openai"
  ) as "openai" | "anthropic" | "gemini";

  const agentsQuery = trpc.agents.list.useQuery();
  const agents = agentsQuery.data ?? [
    {
      id: "story-architect",
      displayName: "Story Architect",
      category: "plotting",
      model: "anthropic/claude-3.5-sonnet",
      description: "Overarching narrative structures & climaxes.",
    },
    {
      id: "character-psychologist",
      displayName: "Character Psychologist",
      category: "character",
      model: "anthropic/claude-3.5-sonnet",
      description: "Deepens character flaws & relationship tensions.",
    },
    {
      id: "scene-pacing-expert",
      displayName: "Scene Pacing Expert",
      category: "pacing",
      model: "google/gemini-2.5-pro",
      description: "Scene beats, tension curves & sensory hooks.",
    },
    {
      id: "worldbuilder-lorekeeper",
      displayName: "Worldbuilder",
      category: "worldbuilding",
      model: "openai/gpt-4o",
      description: "Immersive lore & setting consistency.",
    },
    {
      id: "editor-critique",
      displayName: "Developmental Editor",
      category: "editing",
      model: "deepseek/deepseek-r1-0528",
      description: "Plot-hole auditor & pacing critique.",
    },
    {
      id: "session-writing-coach",
      displayName: "Sprint Coach",
      category: "general",
      model: "google/gemini-2.5-flash",
      description: "Writing accountability & word tracker.",
    },
  ];

  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];
  const runAgentMutation = trpc.agents.run.useMutation();

  const handleRunAgent = () => {
    const activePrompt =
      prompt.trim() ||
      `Consult on: ${contextTitle || "current story development"}`;
    runAgentMutation.mutate({
      agentId: selectedAgentId,
      prompt: activePrompt,
      storyId,
      chapterId,
      apiKey: savedApiKey || undefined,
      provider: savedProvider || "openai",
    });
  };

  const handleCopy = () => {
    if (runAgentMutation.data?.result) {
      navigator.clipboard.writeText(runAgentMutation.data.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const agentIcons: Record<string, any> = {
    plotting: Compass,
    character: Brain,
    pacing: Zap,
    worldbuilding: Layers,
    editing: ShieldCheck,
    general: Feather,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent-gold/10 text-accent-gold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  ibl1nk Story Agents
                </DialogTitle>
                <DialogDescription>
                  Human-First Novel Studio • MCP Multi-Agent Collaboration{" "}
                  {contextTitle ? `• ${contextTitle}` : ""}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge
                variant="outline"
                className="text-xs flex items-center gap-1"
              >
                <Bot className="w-3.5 h-3.5 text-accent-gold" />
                ibl1nk Studio
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {activeAgent.model}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Agent Picker Grid */}
          <div>
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              Select ibl1nk Specialist Agent
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1.5">
              {agents.map(agent => {
                const IconComponent =
                  agentIcons[agent.category || "general"] || Bot;
                const isSelected = selectedAgentId === agent.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-accent/80 border-primary shadow-sm ring-1 ring-primary"
                        : "hover:bg-accent/30 bg-card/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent
                        className={`w-4 h-4 ${isSelected ? "text-accent-gold" : "text-muted-foreground"}`}
                      />
                      <span className="font-semibold text-xs truncate">
                        {agent.displayName}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                      {agent.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="agent-prompt" className="text-xs font-semibold">
              Your Objective / Creative Question
            </Label>
            <Textarea
              id="agent-prompt"
              placeholder={`e.g., Ask ${activeAgent.displayName} to analyze this story beat, suggest a plot twist, or evaluate character tension...`}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="mt-1 min-h-[85px]"
            />
          </div>

          <Button
            onClick={handleRunAgent}
            disabled={runAgentMutation.isPending}
            className="w-full bg-primary text-primary-foreground font-semibold"
          >
            {runAgentMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                {activeAgent.displayName} is analyzing story studio context...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-gold" />
                Consult {activeAgent.displayName}
              </span>
            )}
          </Button>

          {runAgentMutation.data?.result && (
            <div className="mt-4 space-y-3 p-4 border rounded-xl bg-card">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-accent-gold" />
                  <span className="text-xs font-bold uppercase text-foreground">
                    {runAgentMutation.data.agentName}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {runAgentMutation.data.mode}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-7 text-xs"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <Copy className="w-3 h-3 mr-1" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  {onInsertResult && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onInsertResult(runAgentMutation.data.result)
                      }
                      className="h-7 text-xs font-medium"
                    >
                      Insert into Notes
                    </Button>
                  )}
                </div>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
                {runAgentMutation.data.result}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
