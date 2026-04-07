import React, { useState, useEffect, useRef, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { 
  Home, StickyNote, CheckSquare, GitFork, GitMerge, Zap, 
  BookOpen, BookText, UserCog, Plus, Search, Filter 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function NoteTaskApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);

  // tRPC Queries
  const { data: projects, isLoading: projectsLoading } = trpc.projects.list.useQuery();
  const { data: notes, isLoading: notesLoading } = trpc.notes.listByProject.useQuery(
    { projectId: activeProjectId as number },
    { enabled: activeProjectId !== null }
  );
  const { data: tasks, isLoading: tasksLoading } = trpc.tasks.listByProject.useQuery(
    { projectId: activeProjectId as number },
    { enabled: activeProjectId !== null }
  );

  useEffect(() => {
    if (projects && projects.length > 0 && activeProjectId === null) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects]);

  if (projectsLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-12 w-[250px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-card">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">ibl1nk Workspace</h1>
          <Separator orientation="vertical" className="h-6" />
          <select 
            className="bg-transparent border-none font-medium focus:ring-0 cursor-pointer"
            value={activeProjectId || ''}
            onChange={(e) => setActiveProjectId(Number(e.target.value))}
          >
            {projects?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
            {(!projects || projects.length === 0) && (
                <option value="">สร้างโปรเจกต์ใหม่</option>
            )}
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            ค้นหา
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            ใหม่
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 border-b bg-card/50">
          <TabsList className="bg-transparent border-none">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Home className="w-4 h-4 mr-2" /> แดชบอร์ด
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <StickyNote className="w-4 h-4 mr-2" /> โน้ต
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <CheckSquare className="w-4 h-4 mr-2" /> งาน
            </TabsTrigger>
            <TabsTrigger value="lore" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <BookOpen className="w-4 h-4 mr-2" /> ข้อมูลโลก
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="dashboard" className="m-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-70">โน้ตล่าสุด</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{notes?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">อัปเดตล่าสุด เมื่อสักครู่</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-70">งานที่ค้าง</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasks?.filter(t => t.status !== 'done').length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">กำลังดำเนินการ</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-70">AI Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,240</div>
                  <p className="text-xs text-muted-foreground mt-1">ใช้งานในเดือนนี้</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <StickyNote className="w-5 h-5" /> โน้ตล่าสุด
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('notes')}>ดูทั้งหมด</Button>
                </div>
                <div className="space-y-2">
                  {notes?.slice(0, 5).map(note => (
                    <Card key={note.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-3">
                        <div className="font-medium">{note.title}</div>
                        <div className="text-xs opacity-60 truncate">
                          {note.content?.substring(0, 100)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {(!notes || notes.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground bg-accent/20 rounded-lg border border-dashed">
                      ไม่มีโน้ตในโปรเจกต์นี้
                    </div>
                  )}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" /> งานสำคัญ
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('tasks')}>ดูทั้งหมด</Button>
                </div>
                <div className="space-y-2">
                   {tasks?.filter(t => t.status !== 'done').slice(0, 5).map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' : 
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1 font-medium">{task.title}</div>
                      <Badge variant="outline">{task.status}</Badge>
                    </div>
                  ))}
                  {(!tasks || tasks.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground bg-accent/20 rounded-lg border border-dashed">
                      ไม่มีงานที่ค้างอยู่
                    </div>
                  )}
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes?.map(note => (
                <Card key={note.id} className="flex flex-col h-48 cursor-pointer hover:border-primary/50 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base truncate">{note.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden">
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {note.content}
                    </p>
                  </CardContent>
                  <div className="p-3 border-t bg-accent/10 flex justify-between items-center">
                    <Badge variant="secondary" className="text-[10px]">{note.category}</Badge>
                    <span className="text-[10px] opacity-50">{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="m-0">
            <div className="space-y-2 max-w-3xl mx-auto">
              {tasks?.map(task => (
                <div key={task.id} className="flex items-center gap-4 p-4 bg-card border rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-6 h-6 rounded-full border-2 border-primary/30 flex items-center justify-center cursor-pointer hover:bg-primary/10">
                    {task.status === 'done' && <div className="w-3 h-3 bg-primary rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>{task.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] py-0">{task.priority}</Badge>
                      <Badge variant="outline" className="text-[10px] py-0">{task.category}</Badge>
                      {task.dueDate && (
                        <span className="text-[10px] opacity-50 flex items-center gap-1">
                          <Plus className="w-2 h-2" /> {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lore" className="m-0">
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 mx-auto opacity-20 mb-4" />
              <h3 className="text-lg font-medium">คลังข้อมูลโลก (Lore)</h3>
              <p className="text-muted-foreground">กำลังอยู่ในระหว่างการพัฒนา</p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
