import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import {
  Bot,
  Sparkles,
  CheckCircle2,
  Clock,
  FileCode,
  Layers,
  Zap,
  BookOpen,
  Copy,
  Check,
  ShieldCheck,
  Compass,
  Brain,
  Feather,
  ChevronRight,
  Terminal,
} from "lucide-react";

export default function AgentSessions() {
  const [selectedAgentId, setSelectedAgentId] = useState("base-deep");
  const [taskPrompt, setTaskPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const agentsQuery = trpc.agents.list.useQuery();
  const runAgentMutation = trpc.agents.run.useMutation();

  const savedApiKey =
    typeof window !== "undefined"
      ? localStorage.getItem("user_ai_api_key") || ""
      : "";
  const savedProvider = (
    typeof window !== "undefined"
      ? localStorage.getItem("ai_provider")
      : "openai"
  ) as "openai" | "anthropic" | "gemini";

  const agents = agentsQuery.data ?? [];
  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleRunTask = () => {
    if (!taskPrompt.trim()) return;
    runAgentMutation.mutate({
      agentId: selectedAgentId,
      prompt: taskPrompt.trim(),
      apiKey: savedApiKey || undefined,
      provider: savedProvider || "openai",
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const workflowPhases = [
    {
      num: 1,
      title: "Context & Research",
      desc: "Scan codebase, characters, and outline context",
    },
    {
      num: 2,
      title: "SPEC Draft",
      desc: "Draft requirements and clarify scope with ask_user",
    },
    {
      num: 3,
      title: "Implementation Plan",
      desc: "Step-by-step PLAN.md with critique loop",
    },
    {
      num: 4,
      title: "Execute & Implement",
      desc: "Direct code and scene beat edits via tools",
    },
    {
      num: 5,
      title: "Review Loop",
      desc: "Iterative review loop with code-reviewer",
    },
    {
      num: 6,
      title: "Validation",
      desc: "Typechecks, unit tests & E2E verification",
    },
    {
      num: 7,
      title: "Lessons & Skills",
      desc: "Record LESSONS.md and update skill library",
    },
  ];

  const agentIcons: Record<string, any> = {
    plotting: Compass,
    character: Brain,
    pacing: Zap,
    worldbuilding: Layers,
    editing: ShieldCheck,
    general: Feather,
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <Bot className="w-7 h-7 text-accent-gold" />
              ibl1nk Agent Hub & Workflows
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Multi-agent orchestration, 7-phase deep workflows, and MCP studio
              integrations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="px-3 py-1 text-xs border-accent-gold/40 text-accent-gold"
            >
              Publisher: ibl1nk
            </Badge>
            <Badge className="bg-primary text-primary-foreground text-xs px-3 py-1">
              7-Phase Pipeline Active
            </Badge>
          </div>
        </div>

        {/* 7-Phase Workflow Stepper */}
        <Card className="border-t-4 border-t-accent-gold shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent-gold" />
              Standard 7-Phase Agentic Execution Pipeline
            </CardTitle>
            <CardDescription className="text-xs">
              Every deep task follows this systematic workflow to guarantee
              verified quality and zero regressions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              {workflowPhases.map((phase, idx) => (
                <div
                  key={phase.num}
                  className="p-3 border rounded-lg bg-card/70 flex flex-col justify-between space-y-1.5 relative hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-accent-gold/20 text-accent-gold text-[11px] font-bold flex items-center justify-center">
                      {phase.num}
                    </span>
                    {idx < 6 && (
                      <ChevronRight className="hidden md:block w-3.5 h-3.5 text-muted-foreground/50 absolute -right-2 top-4 z-10" />
                    )}
                  </div>
                  <span className="font-semibold text-xs text-foreground block">
                    {phase.title}
                  </span>
                  <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                    {phase.desc}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Work Area: Agent Launcher & Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Agent Selector & Runner (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Launch Specialist Agent
                </CardTitle>
                <CardDescription className="text-xs">
                  Choose an ibl1nk orchestrator or specialist agent to execute
                  your task
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Agent Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {agents.map(agent => {
                    const IconComp =
                      agentIcons[agent.category || "general"] || Bot;
                    const isSelected = selectedAgentId === agent.id;
                    return (
                      <div
                        key={agent.id}
                        onClick={() => setSelectedAgentId(agent.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-accent/80 border-primary shadow-sm ring-1 ring-primary"
                            : "hover:bg-accent/30 bg-card/60"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComp
                            className={`w-4 h-4 ${isSelected ? "text-accent-gold" : "text-muted-foreground"}`}
                          />
                          <span className="font-semibold text-xs truncate">
                            {agent.displayName}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                          {agent.description || "Specialist Agent"}
                        </p>
                        <span className="text-[10px] font-mono text-muted-foreground/80 mt-1 block truncate">
                          {agent.model}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Prompt Input */}
                <div className="space-y-1.5 pt-2">
                  <Label
                    htmlFor="agent-task-input"
                    className="text-xs font-semibold"
                  >
                    Task Prompt & Requirements
                  </Label>
                  <Textarea
                    id="agent-task-input"
                    placeholder={`e.g. Ask ${activeAgent?.displayName || "Agent"} to plan Chapter 3 outline, critique character arcs, or draft scenes...`}
                    value={taskPrompt}
                    onChange={e => setTaskPrompt(e.target.value)}
                    className="min-h-[100px] text-sm"
                  />
                </div>

                <Button
                  onClick={handleRunTask}
                  disabled={runAgentMutation.isPending || !taskPrompt.trim()}
                  className="w-full font-semibold"
                >
                  {runAgentMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin text-accent-gold" />
                      {activeAgent?.displayName} is orchestrating workflow...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent-gold" />
                      Execute with {activeAgent?.displayName}
                    </span>
                  )}
                </Button>

                {/* Output View */}
                {runAgentMutation.data?.result && (
                  <div className="p-4 border rounded-xl bg-card/80 space-y-3 mt-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-accent-gold" />
                        <span className="text-xs font-bold uppercase">
                          {runAgentMutation.data.agentName}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {runAgentMutation.data.mode}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(runAgentMutation.data.result)}
                        className="h-7 text-xs"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-green-500 mr-1" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 mr-1" />
                        )}
                        {copied ? "Copied" : "Copy Output"}
                      </Button>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
                      {runAgentMutation.data.result}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Sessions, Artifacts & MCP Tools (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Tabs defaultValue="artifacts">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="artifacts" className="text-xs">
                  Session Artifacts
                </TabsTrigger>
                <TabsTrigger value="tools" className="text-xs">
                  MCP Tool Registry
                </TabsTrigger>
              </TabsList>

              <TabsContent value="artifacts" className="space-y-3 pt-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-accent-gold" />
                      Generated Session Artifacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5 text-xs">
                    <div className="p-3 border rounded-lg bg-card/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono"
                        >
                          SPEC.md
                        </Badge>
                        <span className="font-medium text-foreground">
                          Task Specification
                        </span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 text-[10px]">
                        VERIFIED
                      </Badge>
                    </div>
                    <div className="p-3 border rounded-lg bg-card/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono"
                        >
                          PLAN.md
                        </Badge>
                        <span className="font-medium text-foreground">
                          Implementation Order
                        </span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 text-[10px]">
                        APPROVED
                      </Badge>
                    </div>
                    <div className="p-3 border rounded-lg bg-card/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono"
                        >
                          LESSONS.md
                        </Badge>
                        <span className="font-medium text-foreground">
                          Session Learnings
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        CAPTURED
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tools" className="space-y-3 pt-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-accent-gold" />
                      Active MCP Tools ({activeAgent?.toolNames?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    {activeAgent?.toolNames?.map((tool: any) => (
                      <div
                        key={tool}
                        className="p-2.5 border rounded-lg bg-card/60 flex items-center justify-between"
                      >
                        <span className="font-mono text-[11px] text-accent-gold font-semibold truncate">
                          {tool}
                        </span>
                        <Badge variant="outline" className="text-[9px]">
                          MCP
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
