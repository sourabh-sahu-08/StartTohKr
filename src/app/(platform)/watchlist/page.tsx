/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUserStore } from "@/store/userStore";
import { useInnovationStore } from "@/store/innovationStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, Star, Settings, Bell } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default function WatchlistPage() {
  const { trackedInnovations, alertSettings, updateAlerts, toggleTrack } = useUserStore();
  const { innovations } = useInnovationStore();

  const trackedList = trackedInnovations.map(id => innovations.find(i => i.id === id)).filter(Boolean) as any[];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <Star className="w-8 h-8 text-amber-500 fill-amber-500" /> My Watchlist
        </h1>
        <p className="text-muted-foreground">Monitor innovations closely and configure custom alerts for their progress.</p>
      </div>

      {trackedList.length === 0 ? (
        <div className="text-center p-16 border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground flex flex-col items-center">
          <Star className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium">Your Innovation Watchlist is Empty</p>
          <p className="text-sm mt-1 mb-6">Track innovations from the feed to receive progress updates.</p>
          <Button nativeButton={false} render={
            <Link href="/feed">Discover Innovations</Link>
          } className="bg-indigo-600 hover:bg-indigo-700 font-bold" />
        </div>
      ) : (
        <div className="space-y-4">
          {trackedList.map(inv => {
            const settings = alertSettings[inv.id] || { milestones: true, stageChange: true, impactReport: true, funding: true, pilots: true, collabs: false };
            const STAGES = ["IDEA", "PROTOTYPE", "MVP", "PILOT", "SCALING"];
            const currentStageIndex = STAGES.indexOf(inv.stage);
            const progressPercent = ((currentStageIndex + 1) / STAGES.length) * 100;
            
            return (
              <Card key={inv.id} className="overflow-hidden border-primary/20">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">{inv.title}</h3>
                      <Badge variant="secondary" className="text-xs">{inv.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{inv.tagline}</p>
                    
                    <div className="pt-2 w-full max-w-sm">
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase mb-1">
                        <span>{STAGES[0]}</span>
                        <span className="text-primary">{inv.stage}</span>
                        <span>{STAGES[4]}</span>
                      </div>
                      <Progress value={progressPercent} className="h-1.5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
                    <Dialog>
                      <DialogTrigger render={
                        <Button variant="outline" className="gap-2">
                          <Bell className="w-4 h-4" /> Alerts
                        </Button>
                      } />
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Alert Settings for {inv.title}</DialogTitle>
                          <DialogDescription>Choose which updates you want to receive for this innovation.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          {[
                            { key: 'milestones', label: 'New Milestones', desc: 'When the startup hits a development milestone.' },
                            { key: 'stageChange', label: 'Stage Changes', desc: 'When the innovation moves to MVP, Pilot, etc.' },
                            { key: 'impactReport', label: 'Impact Reports', desc: 'When measurable metrics are published.' },
                            { key: 'pilots', label: 'Pilot Starts', desc: 'When they successfully deploy a pilot.' },
                          ].map((setting) => (
                            <div key={setting.key} className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{setting.label}</p>
                                <p className="text-xs text-muted-foreground">{setting.desc}</p>
                              </div>
                              <Switch 
                                checked={(settings as any)[setting.key]}
                                onCheckedChange={(c) => updateAlerts(inv.id, { [setting.key]: c })}
                              />
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="ghost" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => toggleTrack(inv.id)}>
                      Untrack
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90" nativeButton={false} render={
                      <Link href={`/innovation/${inv.id}`}>Explore <ExternalLink className="w-3 h-3 ml-1" /></Link>
                    } />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
