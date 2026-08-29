"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PilotsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Pilots</h1>
          <p className="text-muted-foreground mt-1">Manage and track your ongoing government implementations.</p>
        </div>
        <Button onClick={() => toast.info("New pilot creation is restricted to verified matches.")}>
          Create Workspace
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Smart Traffic Optimization</CardTitle>
                <CardDescription>Partner: Municipal Corporation of Bangalore</CardDescription>
              </div>
              <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">In Progress</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Overall Progress</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>

            <Tabs defaultValue="tasks">
              <TabsList>
                <TabsTrigger value="tasks">Tasks & Milestones</TabsTrigger>
                <TabsTrigger value="kpi">KPIs</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks" className="mt-4 space-y-4">
                {[
                  { title: "Initial Hardware Setup", status: "completed", icon: CheckCircle2, color: "text-green-500" },
                  { title: "Data Integration Phase 1", status: "completed", icon: CheckCircle2, color: "text-green-500" },
                  { title: "Machine Learning Model Training", status: "in-progress", icon: PlayCircle, color: "text-amber-500" },
                  { title: "Field Testing", status: "pending", icon: Clock, color: "text-muted-foreground" },
                ].map((task, i) => {
                  const Icon = task.icon;
                  return (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${task.color}`} />
                        <span className="font-medium">{task.title}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toast.success("Task status updated.")}>
                        Update Status
                      </Button>
                    </div>
                  );
                })}
              </TabsContent>
              
              <TabsContent value="kpi" className="mt-4 grid sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary">24%</div>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Traffic Reduction</p>
                    <p className="text-xs text-muted-foreground mt-2">Target: 30%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary">98.5%</div>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Uptime</p>
                    <p className="text-xs text-muted-foreground mt-2">Target: 99%</p>
                  </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-amber-600">3</div>
                    <p className="text-sm font-medium text-amber-800 mt-1">Pending Alerts</p>
                    <p className="text-xs text-amber-600/80 mt-2">Requires attention</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}