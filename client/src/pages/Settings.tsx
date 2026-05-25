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
} from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();
  const [craftConnected, setCraftConnected] = useState(false);
  const [obsidianPath, setObsidianPath] = useState("");
  const [slackConnected, setSlackConnected] = useState(false);

  const handleCraftConnect = () => {
    // TODO: Implement Craft OAuth flow
    console.log("Connecting to Craft...");
    // In production, this would redirect to Craft OAuth
  };

  const handleCraftDisconnect = () => {
    setCraftConnected(false);
  };

  const handleObsidianPathSave = () => {
    // TODO: Validate and save Obsidian path
    console.log("Saving Obsidian path:", obsidianPath);
  };

  const handleSlackConnect = () => {
    // TODO: Implement Slack OAuth flow
    console.log("Connecting to Slack...");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your integrations and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="text-xs md:text-sm">
              Profile
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

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={user?.name || ""} disabled />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user?.email || ""} disabled />
                </div>
                <div>
                  <Label>User ID</Label>
                  <Input
                    value={user?.openId || ""}
                    disabled
                    className="font-mono text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={logout}
                >
                  Log Out
                </Button>
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
        </Tabs>
      </div>
    </div>
  );
}
