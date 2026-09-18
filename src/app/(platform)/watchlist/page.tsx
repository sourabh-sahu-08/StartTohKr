"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, ExternalLink, Activity, BellRing, Settings, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getTrackedItems } from "@/server/actions/collections";
import { toggleTrack } from "@/server/actions/interactions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function WatchlistPage() {
  const [trackedList, setTrackedList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTrackers = async () => {
    try {
      const data = await getTrackedItems();
      setTrackedList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrackers();
  }, []);

  const handleUntrack = async (id: string) => {
    try {
      await toggleTrack(id);
      toast.success("Removed from Watchlist");
      setTrackedList(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      toast.error("Failed to untrack");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Target className="w-8 h-8 text-amber-500 fill-amber-500/20" /> Watchlist
          </h1>
          <p className="text-muted-foreground">Monitor progress and updates of high-potential innovations.</p>
        </div>
        
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}><Settings className="w-4 h-4 mr-2" /> Alert Settings</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Watchlist Alerts</DialogTitle>
              <DialogDescription>Configure how you want to be notified about tracked innovations.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Stage Progression</Label>
                  <p className="text-sm text-muted-foreground">Notify when an innovation advances (e.g. MVP to Pilot).</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Opportunities</Label>
                  <p className="text-sm text-muted-foreground">Notify when they seek government pilots or funding.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Major Updates</Label>
                  <p className="text-sm text-muted-foreground">Notify on significant progress updates.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : trackedList.length === 0 ? (
        <div className="text-center p-16 border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground flex flex-col items-center">
          <Activity className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium">Your watchlist is empty.</p>
          <p className="text-sm mt-1 mb-6">Track innovations in the feed to monitor their momentum and progress.</p>
          <Button render={<Link href="/feed" />}>Discover Innovations</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {trackedList.map(innovation => (
            <Card key={innovation.id} className="overflow-hidden hover:shadow-md transition-all border-amber-100">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row p-5 gap-5 sm:items-center">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Link href={`/innovation/${innovation.id}`} className="font-bold text-lg truncate hover:underline text-amber-900">
                        {innovation.title}
                      </Link>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">{innovation.stage}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-3">{innovation.tagline}</p>
                    
                    <div className="flex items-center gap-4 text-sm font-medium">
                      <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        <Activity className="w-3.5 h-3.5" /> High Momentum
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-5">
                    <Button render={<Link href={`/innovation/${innovation.id}`} />} variant="outline" size="sm" className="w-full sm:w-auto">
                      View Details <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleUntrack(innovation.id)} className="w-full sm:w-auto text-muted-foreground">
                      Stop Tracking
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
