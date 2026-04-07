import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BookOpen, Users, Zap, TrendingUp, Plus, Settings, ChevronRight } from "lucide-react";
import { Link } from "wouter";

// Sample data
const writingProgressData = [
  { week: "W1", words: 2500 },
  { week: "W2", words: 3200 },
  { week: "W3", words: 2800 },
  { week: "W4", words: 4100 },
  { week: "W5", words: 5300 },
  { week: "W6", words: 6680 },
];

const storyStatusData = [
  { name: "Completed", value: 8, fill: "#d4a574" },
  { name: "In Progress", value: 2, fill: "#6b8e99" },
  { name: "Planning", value: 2, fill: "#c9b8a8" },
];

export default function DashboardMobile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full">
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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-background border-b p-4 space-y-2">
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
        {/* Quick Stats - Vertical Stack for Mobile */}
        <div className="space-y-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Words</p>
                <p className="text-3xl font-bold">24,580</p>
                <p className="text-xs text-muted-foreground mt-1">+2,580 this week</p>
                <Progress value={68} className="mt-3" />
                <p className="text-xs text-muted-foreground mt-1">68% of 36,000 goal</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Active Stories</p>
                <p className="text-3xl font-bold">3</p>
                <p className="text-xs text-muted-foreground mt-1">2 in progress</p>
                <Link href="/outlines" className="block mt-3">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Stories <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Characters</p>
                <p className="text-3xl font-bold">12</p>
                <p className="text-xs text-muted-foreground mt-1">Across all stories</p>
                <Link href="/characters" className="block mt-3">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Manage <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Writing Streak</p>
                <p className="text-3xl font-bold">7</p>
                <p className="text-xs text-muted-foreground mt-1">days in a row</p>
                <div className="flex gap-1 justify-center mt-3">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-accent-gold" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Charts */}
        <Tabs defaultValue="progress" className="space-y-3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="progress" className="text-xs">
              Progress
            </TabsTrigger>
            <TabsTrigger value="status" className="text-xs">
              Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={writingProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="words"
                      stroke="#d4a574"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Story Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={storyStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {storyStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { title: "Completed Chapter 8", time: "2h ago" },
              { title: "Updated Aria's backstory", time: "5h ago" },
              { title: "Content analysis done", time: "1d ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-2 pb-2 border-b last:border-0">
                <div className="w-2 h-2 rounded-full bg-accent-gold mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 space-y-2">
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
          <Button variant="default" size="sm" className="w-full text-xs">
            <Plus className="w-3 h-3 mr-1" />
              New
          </Button>
        </div>
      </div>
    </div>
  );
}
