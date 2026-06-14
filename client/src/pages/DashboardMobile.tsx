import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BookOpen, Users, Plus, Settings, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const STATUS_COLORS: Record<string, string> = {
  completed: "#d4a574",
  in_progress: "#6b8e99",
  draft: "#c9b8a8",
  archived: "#a0a0a0",
};

export default function DashboardMobile() {
  const { user, isAuthenticated } = useAuth();

  const { data: outlines = [], isLoading: outlinesLoading } = trpc.outlines.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: characters = [], isLoading: charactersLoading } = trpc.characters.listByUser.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Welcome to Claude Writer</CardTitle>
            <CardDescription>Your personal writing dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your stories, characters, and writing progress in one place.
            </p>
            <Button className="w-full">Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalWords = outlines.reduce((sum, o) => sum + (o.wordCount ?? 0), 0);
  const inProgress = outlines.filter((o) => o.status === "in_progress").length;

  const statusGroups = [
    { name: "Completed", value: outlines.filter((o) => o.status === "completed").length, fill: STATUS_COLORS.completed },
    { name: "In Progress", value: outlines.filter((o) => o.status === "in_progress").length, fill: STATUS_COLORS.in_progress },
    { name: "Draft", value: outlines.filter((o) => o.status === "draft").length, fill: STATUS_COLORS.draft },
    { name: "Archived", value: outlines.filter((o) => o.status === "archived").length, fill: STATUS_COLORS.archived },
  ].filter((g) => g.value > 0);

  const isLoading = outlinesLoading || charactersLoading;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Welcome back!</h1>
            <p className="text-xs text-muted-foreground">{user?.name || "Writer"}</p>
          </div>
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="pt-5 pb-4">
                  <p className="text-xs text-muted-foreground mb-1">Total Words</p>
                  <p className="text-2xl font-bold">{totalWords.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Across all stories</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-5 pb-4">
                  <p className="text-xs text-muted-foreground mb-1">Stories</p>
                  <p className="text-2xl font-bold">{outlines.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">{inProgress} in progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-5 pb-4">
                  <p className="text-xs text-muted-foreground mb-1">Characters</p>
                  <p className="text-2xl font-bold">{characters.length}</p>
                  <Link href="/characters" className="block mt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs h-7">
                      Manage <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-5 pb-4">
                  <p className="text-xs text-muted-foreground mb-1">Active</p>
                  <p className="text-2xl font-bold">{inProgress}</p>
                  <Link href="/outlines" className="block mt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs h-7">
                      View All <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Story Status Pie Chart */}
            {statusGroups.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Story Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={statusGroups}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        dataKey="value"
                      >
                        {statusGroups.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-3 justify-center mt-2">
                    {statusGroups.map((g) => (
                      <div key={g.name} className="flex items-center gap-1.5 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.fill }} />
                        <span className="text-muted-foreground">{g.name} ({g.value})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Stories */}
            {outlines.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Recent Stories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {outlines.slice(0, 4).map((outline) => (
                    <div key={outline.id} className="flex items-center justify-between py-1.5 border-b last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{outline.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {outline.status?.replace("_", " ")} &bull; {(outline.wordCount ?? 0).toLocaleString()} words
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                    </div>
                  ))}
                  {outlines.length > 4 && (
                    <Link href="/outlines">
                      <Button variant="ghost" size="sm" className="w-full text-xs mt-1">
                        View all {outlines.length} stories
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Empty state */}
            {outlines.length === 0 && characters.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium mb-1">No stories yet</p>
                  <p className="text-sm text-muted-foreground mb-4">Start your first story to see your dashboard come alive.</p>
                  <Link href="/outlines">
                    <Button size="sm">
                      <Plus className="w-3 h-3 mr-1" />
                      Create Story
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3">
        <div className="grid grid-cols-3 gap-2">
          <Link href="/outlines">
            <Button variant="outline" size="sm" className="w-full text-xs">
              <BookOpen className="w-3 h-3 mr-1" />
              Stories
            </Button>
          </Link>
          <Link href="/characters">
            <Button variant="outline" size="sm" className="w-full text-xs">
              <Users className="w-3 h-3 mr-1" />
              Characters
            </Button>
          </Link>
          <Link href="/outlines">
            <Button variant="default" size="sm" className="w-full text-xs">
              <Plus className="w-3 h-3 mr-1" />
              New
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
