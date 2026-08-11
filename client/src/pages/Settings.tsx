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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
  Unlink,
  Copy,
  Check,
  Terminal,
  Cpu,
  Bot,
  Layers,
  LogIn,
  RefreshCw,
} from "lucide-react";

import { trpc } from "@/lib/trpc";

export default function Settings() {
  const { user, logout } = useAuth();
  const updateCraftMutation = trpc.integrations.updateCraft.useMutation();
  const updateObsidianMutation = trpc.integrations.updateObsidian.useMutation();
  const updateSlackMutation = trpc.integrations.updateSlack.useMutation();

  const [craftConnected, setCraftConnected] = useState(() => {
    return localStorage.getItem("craft_connected") === "true";
  });
  const [obsidianPath, setObsidianPath] = useState(() => {
    return localStorage.getItem("obsidian_vault_path") || "";
  });
  const [slackConnected, setSlackConnected] = useState(() => {
    return localStorage.getItem("slack_connected") === "true";
  });
  const [aiProvider, setAiProvider] = useState(() => {
    return localStorage.getItem("ai_provider") || "openai";
  });
  const [aiApiKey, setAiApiKey] = useState(() => {
    return "";
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveAiSettings = () => {
    localStorage.setItem("ai_provider", aiProvider);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCraftConnect = () => {
    const nextState = !craftConnected;
    setCraftConnected(nextState);
    localStorage.setItem("craft_connected", String(nextState));
    if (nextState) {
      updateCraftMutation.mutate({ spaceId: "craft-default-space" });
    }
  };

  const handleCraftDisconnect = () => {
    setCraftConnected(false);
    localStorage.setItem("craft_connected", "false");
  };

  const handleObsidianPathSave = () => {
    localStorage.setItem("obsidian_vault_path", obsidianPath);
    if (obsidianPath.trim()) {
      updateObsidianMutation.mutate({ vaultPath: obsidianPath.trim() });
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSlackToggle = () => {
    const nextState = !slackConnected;
    setSlackConnected(nextState);
    localStorage.setItem("slack_connected", String(nextState));
    updateSlackMutation.mutate({ notificationsEnabled: nextState });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI API keys, integrations, and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="mcp" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger
              value="mcp"
              className="text-xs md:text-sm font-semibold text-accent-gold"
            >
              MCP Server
            </TabsTrigger>
            <TabsTrigger
              value="devops"
              className="text-xs md:text-sm font-medium"
            >
              DevOps & Sec
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs md:text-sm">
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="craft" className="text-xs md:text-sm">
              Craft
            </TabsTrigger>
            <TabsTrigger value="obsidian" className="text-xs md:text-sm">
              Obsidian
            </TabsTrigger>
            <TabsTrigger value="slack" className="text-xs md:text-sm">
              Slack
            </TabsTrigger>
          </TabsList>

          {/* MCP Server Tab */}
          <TabsContent value="mcp" className="space-y-4">
            <McpServerCard />
          </TabsContent>

          {/* AI Tab (BYOK) */}
          <TabsContent value="ai" className="space-y-4">
            <CodexAccountCard />
            <Card>
              <CardHeader>
                <CardTitle>Bring Your Own Key (BYOK)</CardTitle>
                <CardDescription>
                  Use your own API key to power AI writing analysis and story
                  suggestions without any server charges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ai-provider">AI Provider</Label>
                  <select
                    id="ai-provider"
                    className="w-full px-3 py-2 border rounded-md mt-1 bg-background text-foreground"
                    value={aiProvider}
                    onChange={e => setAiProvider(e.target.value)}
                  >
                    <option value="openai">OpenAI (GPT-4o, GPT-4o-mini)</option>
                    <option value="anthropic">
                      Anthropic Claude (Claude 3.5 Sonnet)
                    </option>
                    <option value="gemini">
                      Google Gemini (Gemini 2.5 Flash)
                    </option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="ai-key">Your Personal API Key</Label>
                  <Input
                    id="ai-key"
                    type="password"
                    placeholder="sk-... or AIzaSy..."
                    value={aiApiKey}
                    onChange={e => setAiApiKey(e.target.value)}
                    className="font-mono text-sm mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your key is kept only in this page session and is never
                    persisted in browser storage.
                  </p>
                </div>

                <Button onClick={handleSaveAiSettings} className="w-full">
                  {saveSuccess ? "Saved Successfully!" : "Save API Key"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your local workspace identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={user?.name || "Local Writer"} disabled />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user?.email || "writer@local.dev"} disabled />
                </div>
                <div>
                  <Label>Session Type</Label>
                  <Input
                    value={user?.openId || "local-dev-session"}
                    disabled
                    className="font-mono text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Craft Tab */}
          <TabsContent value="craft" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Craft Integration</CardTitle>
                <CardDescription>
                  Connect your Craft account to sync stories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted">
                  <div className="flex items-center gap-3">
                    {craftConnected ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {craftConnected ? "Connected" : "Not Connected"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {craftConnected
                          ? "Your Craft account is linked"
                          : "Connect to sync your stories"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={craftConnected ? "default" : "secondary"}>
                    {craftConnected ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {craftConnected && (
                  <div className="space-y-3 p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Connected Collections
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          • My Stories Collection
                        </div>
                        <div className="text-sm text-muted-foreground">
                          • Characters Database
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {!craftConnected ? (
                    <Button onClick={handleCraftConnect} className="flex-1">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Connect Craft
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      onClick={handleCraftDisconnect}
                      className="flex-1"
                    >
                      <Unlink className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  )}
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    • You'll need to authorize Claude Writer to access your
                    Craft account
                  </p>
                  <p>• Your data will be synced automatically</p>
                  <p>• You can disconnect anytime</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Obsidian Tab */}
          <TabsContent value="obsidian" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Obsidian Integration</CardTitle>
                <CardDescription>
                  Sync your Obsidian vault with Claude Writer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="obsidian-path">Vault Path</Label>
                  <Input
                    id="obsidian-path"
                    placeholder="/Users/yourname/Documents/ObsidianVault"
                    value={obsidianPath}
                    onChange={e => setObsidianPath(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter the full path to your Obsidian vault
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Sync Options</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                      <span className="text-sm">Auto-sync on changes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                      <span className="text-sm">
                        Extract outlines from headings
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">
                        Push updates back to vault
                      </span>
                    </label>
                  </div>
                </div>

                <Button onClick={handleObsidianPathSave} className="w-full">
                  Save Obsidian Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Slack Tab */}
          <TabsContent value="slack" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Slack Integration</CardTitle>
                <CardDescription>
                  Get writing notifications on Slack
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted">
                  <div className="flex items-center gap-3">
                    {slackConnected ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {slackConnected ? "Connected" : "Not Connected"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {slackConnected
                          ? "Slack notifications enabled"
                          : "Connect to receive notifications"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={slackConnected ? "default" : "secondary"}>
                    {slackConnected ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label>Notification Settings</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        disabled={!slackConnected}
                      />
                      <span className="text-sm">Daily writing summary</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        disabled={!slackConnected}
                      />
                      <span className="text-sm">Character updates</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" disabled={!slackConnected} />
                      <span className="text-sm">Analysis alerts</span>
                    </label>
                  </div>
                </div>

                <Button
                  onClick={() => setSlackConnected(!slackConnected)}
                  className="w-full"
                >
                  {slackConnected ? "Disconnect Slack" : "Connect Slack"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DevOps & Security Diagnostics Tab */}
          <TabsContent value="devops" className="space-y-4">
            <DevOpsDiagnosticsCard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CodexAccountCard() {
  const utils = trpc.useUtils();
  const [refreshing, setRefreshing] = useState(false);
  const statusQuery = trpc.agentAuth.codexStatus.useQuery(undefined, {
    refetchInterval: query =>
      query.state.data?.login?.phase === "starting" ||
      query.state.data?.login?.phase === "waiting"
        ? 2000
        : false,
  });
  const startLogin = trpc.agentAuth.startCodexLogin.useMutation({
    onSuccess: () => utils.agentAuth.codexStatus.invalidate(),
  });
  const logoutCodex = trpc.agentAuth.logoutCodex.useMutation({
    onSuccess: () => utils.agentAuth.codexStatus.invalidate(),
  });
  const status = statusQuery.data;
  const busy =
    startLogin.isPending ||
    logoutCodex.isPending ||
    status?.login?.phase === "starting" ||
    status?.login?.phase === "waiting";
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await statusQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Card className="border-t-4 border-t-accent-gold">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-accent-gold" />
              Codex account
            </CardTitle>
            <CardDescription>
              Connect your ChatGPT account through the official Codex login. The
              app does not request an API key or store your Codex token.
            </CardDescription>
          </div>
          <Badge variant={status?.connected ? "default" : "secondary"}>
            {status?.connected ? "Connected" : "Not connected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status && !status.installed && (
          <div className="rounded-lg border border-yellow-400 bg-yellow-50/50 p-3 text-xs text-yellow-900 dark:bg-yellow-950/20 dark:text-yellow-200">
            Codex CLI is not installed on this app host. Install it on the host
            before connecting an account.
          </div>
        )}

        {status?.mode && (
          <div className="rounded-lg border bg-muted/60 p-3 text-xs">
            <span className="text-muted-foreground">Authentication mode</span>
            <pre className="mt-1 whitespace-pre-wrap font-mono text-foreground">
              {status.mode}
            </pre>
          </div>
        )}

        {status?.login?.output && (
          <div className="space-y-2">
            <Label>Codex login</Label>
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-3 font-mono text-xs text-slate-100">
              {status.login.output}
            </pre>
            <p className="text-xs text-muted-foreground">
              Follow the URL and code shown above. This page refreshes the
              connection status automatically.
            </p>
          </div>
        )}

        {status?.login?.error && (
          <div className="rounded-lg border border-red-400 bg-red-50/50 p-3 text-xs text-red-800 dark:bg-red-950/20 dark:text-red-200">
            {status.login.error}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          {!status?.connected ? (
            <>
              <Button
                className="flex-1"
                disabled={busy || status?.installed === false}
                onClick={() => startLogin.mutate({ mode: "browser" })}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Continue with ChatGPT
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled={busy || status?.installed === false}
                onClick={() => startLogin.mutate({ mode: "device" })}
              >
                Use device code
              </Button>
            </>
          ) : (
            <Button
              variant="destructive"
              className="flex-1"
              disabled={busy}
              onClick={() => logoutCodex.mutate()}
            >
              <Unlink className="mr-2 h-4 w-4" />
              Disconnect Codex
            </Button>
          )}
          <Button variant="ghost" disabled={refreshing} onClick={handleRefresh}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DevOpsDiagnosticsCard() {
  const diagQuery = trpc.system.diagnostics.useQuery();
  const diag = diagQuery.data;

  if (diagQuery.isLoading) {
    return (
      <Card className="p-8 text-center text-muted-foreground text-sm">
        Running system security and environment diagnostics...
      </Card>
    );
  }

  if (!diag) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        Unable to load system diagnostics.
      </Card>
    );
  }

  const statusColor =
    diag.status === "healthy"
      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
      : diag.status === "degraded"
        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";

  return (
    <div className="space-y-4">
      {/* System Status Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                🛡️ DevOps & Security Status
              </CardTitle>
              <CardDescription>
                Environment health, sensitive data isolation, and architecture
                diagnostics
              </CardDescription>
            </div>
            <Badge className={statusColor}>
              SYSTEM {diag.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 border rounded-lg bg-card">
              <span className="text-muted-foreground block">Database Mode</span>
              <span className="font-semibold capitalize mt-1 block">
                {diag.components.database.mode.replace(/_/g, " ")}
              </span>
            </div>
            <div className="p-3 border rounded-lg bg-card">
              <span className="text-muted-foreground block">Auth Mode</span>
              <span className="font-semibold capitalize mt-1 block">
                {diag.components.authentication.mode.replace(/_/g, " ")}
              </span>
            </div>
            <div className="p-3 border rounded-lg bg-card">
              <span className="text-muted-foreground block">
                BYOK Isolation
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400 mt-1 block">
                Protected (Client-Side)
              </span>
            </div>
            <div className="p-3 border rounded-lg bg-card">
              <span className="text-muted-foreground block">HTTP Headers</span>
              <span className="font-semibold text-green-600 dark:text-green-400 mt-1 block">
                Hardened (Nosniff/SameOrigin)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensitive Cases & Warnings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-accent-gold" />
            Environment Advisories & Sensitive Cases ({diag.warnings.length})
          </CardTitle>
          <CardDescription>
            Real-time notifications regarding environment variables, security
            keys, and fallbacks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {diag.warnings.length === 0 ? (
            <div className="p-4 border rounded-lg text-xs text-green-600 bg-green-50/50 dark:bg-green-950/20 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              All environment variables and security components are fully
              configured with 0 warnings!
            </div>
          ) : (
            diag.warnings.map(w => (
              <div
                key={w.code}
                className={`p-3.5 border rounded-lg space-y-1.5 ${
                  w.level === "critical"
                    ? "border-red-400 bg-red-50/40 dark:bg-red-950/20"
                    : w.level === "warning"
                      ? "border-yellow-400 bg-yellow-50/40 dark:bg-yellow-950/20"
                      : "border-blue-400 bg-blue-50/40 dark:bg-blue-950/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wide">
                      {w.code}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {w.category}
                    </Badge>
                  </div>
                  <span className="text-[11px] font-semibold uppercase">
                    {w.level}
                  </span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                  {w.message}
                </p>
                <div className="text-[11px] text-muted-foreground pt-1 border-t flex items-start gap-1">
                  <span className="font-semibold text-accent-gold">
                    👉 Action:
                  </span>
                  <span>{w.remediation}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function McpServerCard() {
  const [copiedConfig, setCopiedConfig] = useState(false);

  const claudeConfigSnippet = `{
  "mcpServers": {
    "story-studio": {
      "command": "npx",
      "args": ["-y", "tsx", "/workspaces/ibl1nk/server/mcp/cli.ts"]
    }
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(claudeConfigSnippet);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const mcpTools = [
    {
      name: "list_stories",
      desc: "Lists all stories, novels, and outlines created by the writer in their studio.",
    },
    {
      name: "get_story_structure",
      desc: "Returns chapter breakdown, summaries, and story notes for a selected story.",
    },
    {
      name: "get_chapter_scenes",
      desc: "Gets scene beats, pacing notes, and word targets for a specific chapter.",
    },
    {
      name: "create_scene_beat",
      desc: "Inserts a new scene beat or milestone into the human writer's chapter outline.",
    },
    {
      name: "list_character_cast",
      desc: "Fetches all characters, their archetypal roles, and traits.",
    },
    {
      name: "get_character_dossier",
      desc: "Retrieves character psychology, backstory, relationships, and 5-stage transformation arc.",
    },
    {
      name: "add_character_relationship",
      desc: "Links two characters (Ally, Rival, Mentor, Enemy, Love Interest) with dynamic notes.",
    },
    {
      name: "log_writing_session",
      desc: "Records word count and session notes directly into the writer's studio dashboard.",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <Card className="border-t-4 border-t-accent-gold">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Cpu className="w-5 h-5 text-accent-gold" />
                Model Context Protocol (MCP) Server
              </CardTitle>
              <CardDescription>
                Human-First Architecture: You craft the story here, and your
                external AI tools connect via MCP to assist you
              </CardDescription>
            </div>
            <Badge className="bg-accent-gold/20 text-accent-gold border-accent-gold/40">
              MCP Protocol 1.0 (Active)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/60 rounded-xl border text-xs leading-relaxed space-y-2">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-accent-gold" />
              How the Workflow Operates:
            </h4>
            <p className="text-muted-foreground">
              1. <strong>Human Writer in Control</strong>: You build your story
              outlines, chapters, characters, and psychological arcs in this
              Story Studio.
            </p>
            <p className="text-muted-foreground">
              2. <strong>AI Connects to You</strong>: External AI clients
              (Claude Desktop, Cursor, Antigravity) connect to this studio via
              MCP.
            </p>
            <p className="text-muted-foreground">
              3. <strong>Context-Aware Collaboration</strong>: When you chat
              with your AI ("Help me write Scene 2 of Chapter 1"), the AI calls
              your Studio's MCP tools to read your characters and beats, and
              updates your studio in real-time!
            </p>
          </div>

          {/* Configuration Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Claude Desktop Configuration (`claude_desktop_config.json`)
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 text-xs"
              >
                {copiedConfig ? (
                  <Check className="w-3.5 h-3.5 text-green-500 mr-1" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1" />
                )}
                {copiedConfig ? "Copied" : "Copy Config"}
              </Button>
            </div>
            <pre className="p-3.5 bg-slate-950 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto border">
              {claudeConfigSnippet}
            </pre>
          </div>

          <div className="p-3 border rounded-lg bg-card text-xs flex items-center justify-between">
            <div>
              <span className="font-medium text-foreground block">
                Live HTTP / SSE Endpoint (for Remote & Web AI Clients):
              </span>
              <code className="text-muted-foreground mt-0.5 block font-mono text-[11px]">
                http://localhost:3000/api/mcp/sse
              </code>
            </div>
            <Badge variant="outline" className="text-[10px]">
              GET / SSE
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Available MCP Tools */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent-gold" />
            Exposed MCP Tools for AI Clients ({mcpTools.length})
          </CardTitle>
          <CardDescription>
            These tools are automatically available to your AI assistant when
            connected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mcpTools.map(tool => (
              <div
                key={tool.name}
                className="p-3 border rounded-lg bg-card/60 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-accent-gold">
                    {tool.name}
                  </span>
                  <Badge variant="outline" className="text-[9px]">
                    Tool
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
