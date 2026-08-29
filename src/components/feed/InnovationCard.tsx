"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { InnovationPostWithDetails } from "@/services/innovation/innovation.types";
import { PostType, SignalType, InnovationStage } from "@prisma/client";
import { Rocket, Lightbulb, Zap, Eye, MessageSquare, Bookmark, Share2, MoreHorizontal, ArrowRight, ExternalLink } from "lucide-react";
import { useFeedStore } from "@/store/feedStore";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function InnovationCard({ post, currentUserId }: { post: InnovationPostWithDetails, currentUserId: string }) {
  const { toggleSignal, toggleTrack, trackedInnovations } = useFeedStore();
  const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'impact'>('problem');
  const [isOpportunityModalOpen, setOpportunityModalOpen] = useState(false);
  const [opportunityMsg, setOpportunityMsg] = useState("");

  const isTracked = post.innovationId ? trackedInnovations.includes(post.innovationId) : false;

  const handleSignal = (type: SignalType) => {
    toggleSignal(currentUserId, post.id, type);
    toast.success(`Marked as ${type.replace('_', ' ')}`);
  };

  const handleTrack = () => {
    if (post.innovationId) {
      toggleTrack(post.innovationId);
      toast(isTracked ? "Innovation removed from Watchlist" : "Innovation added to Watchlist");
    }
  };

  const submitOpportunity = () => {
    setOpportunityModalOpen(false);
    toast.success("Opportunity intent sent! The founders will be notified.");
  };

  const getStageColor = (stage: InnovationStage) => {
    switch (stage) {
      case 'IDEA': return 'bg-gray-200 text-gray-700';
      case 'PROTOTYPE': return 'bg-blue-100 text-blue-700';
      case 'MVP': return 'bg-indigo-100 text-indigo-700';
      case 'PILOT': return 'bg-amber-100 text-amber-700';
      case 'SCALING': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100';
    }
  };

  const STAGES: InnovationStage[] = ['IDEA', 'PROTOTYPE', 'MVP', 'PILOT', 'SCALING'];

  return (
    <Card className="overflow-hidden border-primary/10 shadow-md hover:shadow-lg transition-all">
      {/* Identity Strip */}
      <CardHeader className="p-4 pb-2 border-b bg-muted/20">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={post.author.image || ''} />
              <AvatarFallback className="font-bold text-xs">{post.author.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-sm hover:underline cursor-pointer">{post.author.name}</p>
                <Badge variant="outline" className="text-[10px] h-5 px-1.5">{post.author.role}</Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {post.innovation ? (
          <div className="p-4 space-y-4">
            {/* Innovation Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-amber-600 tracking-wider uppercase">
                  {post.type.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight cursor-pointer hover:text-indigo-600 transition-colors">
                {post.innovation.title}
              </h2>
              <p className="text-muted-foreground text-sm font-medium mt-1">
                {post.innovation.tagline}
              </p>
            </div>

            {/* Stage Indicator */}
            <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/50 p-2 rounded-lg">
              {STAGES.map((s, i) => (
                <div key={s} className="flex items-center">
                  <span className={`px-2 py-1 rounded-full transition-colors ${s === post.innovation?.stage ? getStageColor(s) + ' ring-2 ring-primary/20 ring-offset-1' : ''}`}>
                    {s}
                  </span>
                  {i < STAGES.length - 1 && <ArrowRight className="w-3 h-3 mx-1 sm:mx-2 opacity-30" />}
                </div>
              ))}
            </div>

            {/* Problem -> Solution -> Impact Interactive Narrative */}
            <div className="bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-background border rounded-xl overflow-hidden shadow-sm">
              <div className="flex border-b text-xs font-bold uppercase tracking-wider">
                <button 
                  onClick={() => setActiveTab('problem')} 
                  className={`flex-1 p-2.5 text-center transition-colors ${activeTab === 'problem' ? 'bg-rose-50 text-rose-700 border-b-2 border-rose-500' : 'text-muted-foreground hover:bg-muted/50'}`}
                >
                  Problem
                </button>
                <button 
                  onClick={() => setActiveTab('solution')} 
                  className={`flex-1 p-2.5 text-center transition-colors ${activeTab === 'solution' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-muted-foreground hover:bg-muted/50'}`}
                >
                  Solution
                </button>
                <button 
                  onClick={() => setActiveTab('impact')} 
                  className={`flex-1 p-2.5 text-center transition-colors ${activeTab === 'impact' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-muted-foreground hover:bg-muted/50'}`}
                >
                  Impact
                </button>
              </div>
              <div className="p-4 text-sm font-medium leading-relaxed min-h-[100px] flex items-center">
                {activeTab === 'problem' && <p className="animate-in fade-in slide-in-from-left-2 duration-300 text-rose-900/80 dark:text-rose-100/80">{post.innovation.problem}</p>}
                {activeTab === 'solution' && <p className="animate-in fade-in slide-in-from-left-2 duration-300 text-indigo-900/80 dark:text-indigo-100/80">{post.innovation.solution}</p>}
                {activeTab === 'impact' && <p className="animate-in fade-in slide-in-from-left-2 duration-300 text-emerald-900/80 dark:text-emerald-100/80">{post.innovation.impact}</p>}
              </div>
            </div>

            {/* Post Specific Content (If not just an Innovation Drop) */}
            {post.type !== 'INNOVATION_DROP' && (
              <div className="bg-muted/30 p-3 rounded-lg border border-dashed">
                <p className="text-sm font-medium italic text-muted-foreground">
                  Update: {JSON.stringify(post.content).substring(1, 100)}...
                </p>
              </div>
            )}

            {/* Technology Stack & Opportunities */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {post.innovation.technologies.map(tech => (
                  <Badge key={tech} variant="secondary" className="text-[10px] font-semibold bg-primary/5 hover:bg-primary/10 text-primary">
                    {tech}
                  </Badge>
                ))}
              </div>
              
              <div className="pt-2 border-t flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-muted-foreground uppercase">Looking For:</span>
                <Badge variant="outline" className="cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors" onClick={() => setOpportunityModalOpen(true)}>
                  💰 Investment
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors" onClick={() => setOpportunityModalOpen(true)}>
                  🏛 Gov Pilot
                </Badge>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-4">
            <p className="text-sm">{JSON.stringify(post.content)}</p>
          </div>
        )}
      </CardContent>

      {/* Action Bar */}
      <CardFooter className="p-0 border-t bg-muted/10 grid grid-cols-4 divide-x">
        {/* Signal Dropdown Alternative (Clicking cycles or opens small menu) */}
        <div className="group relative">
          <Button variant="ghost" className="w-full rounded-none h-12 gap-1.5 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">
            <Rocket className="h-4 w-4" />
            <span className="text-xs font-bold uppercase">Signal</span>
          </Button>
          {/* Tooltip style popup for signals */}
          <div className="absolute bottom-full left-0 mb-1 hidden group-hover:flex bg-background border shadow-xl rounded-full p-1.5 gap-1 z-10 animate-in fade-in slide-in-from-bottom-2">
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-indigo-100 hover:text-indigo-600" onClick={() => handleSignal('PROMISING')} title="Promising">🚀</Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-amber-100 hover:text-amber-600" onClick={() => handleSignal('INNOVATIVE')} title="Innovative">💡</Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-rose-100 hover:text-rose-600" onClick={() => handleSignal('HIGH_IMPACT')} title="High Impact">🔥</Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-blue-100 hover:text-blue-600" onClick={() => handleSignal('WATCHING')} title="Watching">👀</Button>
          </div>
        </div>

        <Button variant="ghost" className="w-full rounded-none h-12 gap-1.5 text-muted-foreground hover:text-primary">
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs font-bold uppercase">Discuss</span>
          {post.comments.length > 0 && <span className="ml-1 text-[10px] bg-primary/10 text-primary px-1.5 rounded-full">{post.comments.length}</span>}
        </Button>

        <Button 
          variant="ghost" 
          className={`w-full rounded-none h-12 gap-1.5 text-xs font-bold uppercase transition-colors ${isTracked ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100' : 'text-muted-foreground hover:text-amber-600 hover:bg-amber-50'}`}
          onClick={handleTrack}
        >
          <Bookmark className={`h-4 w-4 ${isTracked ? 'fill-current' : ''}`} />
          {isTracked ? 'Tracked' : 'Track'}
        </Button>

        <Button variant="ghost" className="w-full rounded-none h-12 gap-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50">
          <ExternalLink className="h-4 w-4" />
          <span className="text-xs font-bold uppercase">Explore</span>
        </Button>
      </CardFooter>

      {/* Opportunity Modal */}
      <Dialog open={isOpportunityModalOpen} onOpenChange={setOpportunityModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Opportunity Request</DialogTitle>
            <DialogDescription>
              Connect with {post.author.name} regarding {post.innovation?.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Intent</label>
              <Textarea 
                placeholder="Hi, we are interested in discussing a pilot deployment..." 
                rows={4}
                value={opportunityMsg}
                onChange={e => setOpportunityMsg(e.target.value)}
              />
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={submitOpportunity}>
              Submit Opportunity Intent
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
