import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BookOpen, Users, Zap, TrendingUp, Plus, Settings } from "lucide-react";
import { Link } from "wouter";

// Sample data - will be replaced with real data from tRPC
const writingProgressData = [
  { week: "Week 1", words: 2500, target: 6000 },
  { week: "Week 2", words: 3200, target: 6000 },
  { week: "Week 3", words: 2800, target: 6000 },
  { week: "Week 4", words: 4100, target: 6000 },
  { week: "Week 5", words: 5300, target: 6000 },
  { week: "Week 6", words: 6680, target: 6000 },
];

const storyStatusData = [
  { name: "Completed", value: 8, fill: "#d4a574" },
  { name: "In Progress", value: 2, fill: "#6b8e99" },
  { name: "Planning", value: 2, fill: "#c9b8a8" },
];

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  // TODO: Replace with actual tRPC queries
  // const { data: outlines } = trpc.outlines.list.useQuery();
  // const { data: characters } = trpc.characters.listByUser.useQuery();
  // const { data: progress } = trpc.progress.getStats.useQuery();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to Claude Writer Dashboard</CardTitle>
            <CardDescription>Please log in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This is your personal writing management platform powered by
              Claude.
            </p>
            <Button className="w-full">Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, {user?.name || "Writer"}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's your writing progress and story overview
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/outlines">
            <Button variant="outline" size="sm">
              <BookOpen className="w-4 h-4 mr-2" />
              My Stories
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Words Written
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24,580</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2,580 this week
            </p>
            <Progress value={68} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-1">
              68% of 36,000 goal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 in progress, 1 planning
            </p>
            <Link href="/outlines">
              <Button variant="link" className="p-0 h-auto text-xs mt-3">
                View all stories →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Characters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all stories
            </p>
            <Link href="/characters">
              <Button variant="link" className="p-0 h-auto text-xs mt-3">
                Manage characters →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Writing Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7</div>
            <p className="text-xs text-muted-foreground mt-1">days in a row</p>
            <div className="flex gap-1 mt-3">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-accent-gold" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">Writing Progress</TabsTrigger>
          <TabsTrigger value="stories">Story Status</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Writing Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Writing Progress</CardTitle>
              <CardDescription>
                Words written per week vs. target
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={writingProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="words"
                    stroke="#d4a574"
                    strokeWidth={2}
                    name="Words Written"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#6b8e99"
                    strokeDasharray="5 5"
                    name="Weekly Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Story Status Tab */}
        <TabsContent value="stories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Story Status Distribution</CardTitle>
                <CardDescription>
                  Breakdown of chapter completion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={storyStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
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

            <Card>
              <CardHeader>
                <CardTitle>Story Breakdown</CardTitle>
                <CardDescription>Chapters and scenes overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      The Lost Kingdom
                    </span>
                    <span className="text-sm text-muted-foreground">
                      8/12 chapters
                    </span>
                  </div>
                  <Progress value={67} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      Whispers of Change
                    </span>
                    <span className="text-sm text-muted-foreground">
                      5/10 chapters
                    </span>
                  </div>
                  <Progress value={50} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      Untitled Project
                    </span>
                    <span className="text-sm text-muted-foreground">
                      2/8 chapters
                    </span>
                  </div>
                  <Progress value={25} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest writing updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: "chapter",
                    title: "Completed Chapter 8: The Revelation",
                    time: "2 hours ago",
                  },
                  {
                    type: "character",
                    title: "Updated character: Aria's backstory",
                    time: "5 hours ago",
                  },
                  {
                    type: "analysis",
                    title: "Content analysis: Chapter 7 completed",
                    time: "1 day ago",
                  },
                  {
                    type: "sync",
                    title: "Synced with Obsidian vault",
                    time: "2 days ago",
                  },
                ].map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 pb-3 border-b last:border-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent-gold mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href="/outlines/new">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              New Story
            </Button>
          </Link>
          <Link href="/characters/new">
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Add Character
            </Button>
          </Link>
          <Link href="/analysis">
            <Button variant="outline" className="w-full justify-start">
              <Zap className="w-4 h-4 mr-2" />
              Analyze Content
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
