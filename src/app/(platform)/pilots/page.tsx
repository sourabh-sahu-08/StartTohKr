"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, CheckCircle2, Clock, AlertCircle, Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPilots, createPilotTask, updatePilotTaskStatus } from "@/server/actions/pilots";
import { Input } from "@/components/ui/input";

export default function PilotsPage() {
  const [pilots, setPilots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const loadData = async () => {
    try {
      const data = await getPilots();
      setPilots(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load pilots");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTask = async (pilotId: string) => {
    if (!newTaskTitle.trim()) return;
    try {
      await createPilotTask(pilotId, newTaskTitle);
      setNewTaskTitle("");
      await loadData();
    } catch (e) {
      toast.error("Failed to add task");
    }
  };

  const handleUpdateTask = async (taskId: string, currentStatus: string) => {
    let nextStatus: 'TODO' | 'IN_PROGRESS' | 'DONE' = 'IN_PROGRESS';
    if (currentStatus === 'IN_PROGRESS') nextStatus = 'DONE';
    if (currentStatus === 'DONE') nextStatus = 'TODO';
    
    try {
      await updatePilotTaskStatus(taskId, nextStatus);
      await loadData();
    } catch (e) {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Active Pilots</h1>
          <p className="text-muted-foreground text-lg mt-2">Manage and track your ongoing implementations.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-muted-foreground" /></div>
      ) : pilots.length === 0 ? (
        <div className="text-center p-16 border-2 border-dashed rounded-xl bg-muted/20">
          <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg font-medium">No Active Pilots</p>
          <p className="text-muted-foreground">You do not have any active pilot implementations.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pilots.map(pilot => {
            const completedTasks = pilot.tasks.filter((t: any) => t.status === 'DONE').length;
            const totalTasks = Math.max(pilot.tasks.length, 1);
            const progress = (completedTasks / totalTasks) * 100;

            return (
              <Card key={pilot.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{pilot.innovation?.title}</CardTitle>
                      <CardDescription className="text-base mt-1 text-indigo-700 font-medium">
                        Dept: {pilot.governmentDept} • Startup: {pilot.startup?.name}
                      </CardDescription>
                    </div>
                    <Badge className={
                      pilot.status === 'PLANNING' ? 'bg-amber-100 text-amber-800' :
                      pilot.status === 'ACTIVE' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-emerald-100 text-emerald-800'
                    }>{pilot.status}</Badge>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-indigo-100/50">
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span>Implementation Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Milestones & Tasks</h3>
                  
                  <div className="space-y-3">
                    {pilot.tasks.length === 0 && (
                      <p className="text-muted-foreground text-sm italic">No tasks defined yet.</p>
                    )}
                    {pilot.tasks.map((task: any) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleUpdateTask(task.id, task.status)} className="focus:outline-none">
                            {task.status === 'DONE' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                             task.status === 'IN_PROGRESS' ? <PlayCircle className="w-5 h-5 text-indigo-500" /> :
                             <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />}
                          </button>
                          <span className={`text-sm font-medium ${task.status === 'DONE' ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">{task.status.replace('_', ' ')}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 p-4 border-t flex gap-2">
                  <Input 
                    placeholder="Add a new milestone/task..." 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="bg-background"
                  />
                  <Button onClick={() => handleAddTask(pilot.id)} className="shrink-0"><Plus className="w-4 h-4 mr-2" /> Add</Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}