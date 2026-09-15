/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUserStore } from "@/store/userStore";
import { useInnovationStore } from "@/store/innovationStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SavedPage() {
  const { savedInnovations, toggleSave } = useUserStore();
  const { innovations } = useInnovationStore();

  const savedList = savedInnovations.map(id => innovations.find(i => i.id === id)).filter(Boolean) as any[];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-indigo-500 fill-indigo-500/20" /> Saved Collections
        </h1>
        <p className="text-muted-foreground">Innovations you&apos;ve bookmarked to review later.</p>
      </div>

      {savedList.length === 0 ? (
        <div className="text-center p-16 border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground flex flex-col items-center">
          <Bookmark className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium">No Saved Innovations</p>
          <p className="text-sm mt-1 mb-6">Click the save icon on any innovation card to add it here.</p>
          <Button className="bg-indigo-600 hover:bg-indigo-700 font-bold" nativeButton={false} render={
            <Link href="/feed">Discover Innovations</Link>
          } />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {savedList.map(inv => (
            <Card key={inv.id} className="overflow-hidden border-primary/10">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight">{inv.title}</h3>
                  <Badge variant="outline">{inv.stage}</Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium mb-4">{inv.startup.name} • {inv.category}</p>
                <p className="text-sm text-foreground/80 mb-6 flex-1 line-clamp-2">{inv.tagline}</p>
                
                <div className="flex gap-2 mt-auto">
                  <Button variant="outline" size="sm" className="text-rose-600 flex-1 hover:bg-rose-50" onClick={() => { toggleSave(inv.id); toast("Removed from saved items"); }}>
                    <Trash2 className="w-4 h-4 mr-1" /> Remove
                  </Button>
                  <Button size="sm" className="flex-1" nativeButton={false} render={
                    <Link href={`/innovation/${inv.id}`}>Explore <ExternalLink className="w-3 h-3 ml-1" /></Link>
                  } />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
