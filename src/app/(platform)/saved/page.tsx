"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getSavedItems } from "@/server/actions/collections";
import { interactionApi } from "@/lib/api/interaction.api";

export default function SavedPage() {
  const [savedList, setSavedList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSaves = async () => {
    try {
      const data = await getSavedItems();
      setSavedList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSaves();
  }, []);

  const handleUnsave = async (id: string) => {
    try {
      await interactionApi.toggleSave('INNOVATION', id);
      toast.success("Removed from Saved");
      setSavedList(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-indigo-500 fill-indigo-500/20" /> Saved Collections
        </h1>
        <p className="text-muted-foreground">Innovations you've bookmarked to review later.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : savedList.length === 0 ? (
        <div className="text-center p-16 border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground flex flex-col items-center">
          <Bookmark className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium">No saved innovations yet.</p>
          <p className="text-sm mt-1 mb-6">Discover innovations and bookmark them here for easy access.</p>
          <Button render={<Link href="/feed" />}>Discover Innovations</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {savedList.map(innovation => (
            <Card key={innovation.id} className="overflow-hidden hover:shadow-md transition-all">
              <CardContent className="p-0">
                <div className="flex items-start sm:items-center p-5 gap-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                    <span className="font-bold text-indigo-600">{innovation.title.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/innovation/${innovation.id}`} className="font-bold text-lg truncate hover:underline">
                        {innovation.title}
                      </Link>
                      <Badge variant="outline" className="bg-primary/5">{innovation.stage}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{innovation.startup?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleUnsave(innovation.id)} className="text-muted-foreground hover:text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button render={<Link href={`/innovation/${innovation.id}`} />} variant="outline" size="sm" className="hidden sm:flex">
                      View <ExternalLink className="w-3 h-3 ml-2" />
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
