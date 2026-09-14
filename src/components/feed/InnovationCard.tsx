/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Lightbulb, Zap, Rocket, CheckCircle2, MoreHorizontal, Bookmark, Eye, ExternalLink, Activity, Trophy, Building2, Briefcase, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InnovationPostWithDetails } from "@/services/innovation/innovation.types";
import { useFeedStore } from "@/store/feedStore";
import { useUserStore } from "@/store/userStore";
import { useOpportunityStore } from "@/store/opportunityStore";
import { PostType, SignalType, OpportunityType } from "@prisma/client";
import Link from "next/link";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export function InnovationCard({ post, currentUserId }: { post: InnovationPostWithDetails, currentUserId: string }) {
  const { toggleSignal } = useFeedStore();
  const { trackedInnovations, toggleTrack, savedInnovations, toggleSave } = useUserStore();
  const { sendOpportunity } = useOpportunityStore();
  
  const [activeTab, setActiveTab] = useState<'PROBLEM' | 'SOLUTION' | 'IMPACT'>('PROBLEM');
  const [oppModalOpen, setOppModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityType | null>(null);
  const [oppMessage, setOppMessage] = useState("");

  const innovation = post.innovation;

  if (!innovation) return null; // Simplified: assume it's linked for demo

  const isTracked = trackedInnovations.includes(innovation.id);
  const isSaved = savedInnovations.includes(innovation.id);

  const getSignalCount = (type: SignalType) => post.signals.filter(s => s.type === type).length;
  const userSignal = post.signals.find(s => s.userId === currentUserId)?.type;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: innovation.title,
          text: innovation.tagline,
          url: `${window.location.origin}/innovation/${innovation.id}`
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/innovation/${innovation.id}`);
        toast.success("Link copied to clipboard!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendOpportunity = () => {
    if (!selectedOpp) return;
    sendOpportunity(currentUserId, innovation.id, selectedOpp, oppMessage);
    setOppModalOpen(false);
    toast.success("Opportunity request sent to the startup!");
    setOppMessage("");
  };

  const STAGES = ["IDEA", "PROTOTYPE", "MVP", "PILOT", "SCALING"];
  const currentStageIndex = STAGES.indexOf(innovation.stage);
  const progressPercent = ((currentStageIndex + 1) / STAGES.length) * 100;

  return (
    <Card className="overflow-hidden border-primary/10 shadow-sm transition-all hover:shadow-md bg-background">
      <CardContent className="p-0">
        
        {/* Post Context Header (If it's an update vs just the innovation) */}
        {post.type !== 'INNOVATION_DROP' && (
          <div className="bg-muted/30 px-6 py-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {post.type === 'PROGRESS_UPDATE' && <><Activity className="w-4 h-4 text-blue-500" /> Progress Update</>}
              {post.type === 'IMPACT_REPORT' && <><BarChartIcon className="w-4 h-4 text-emerald-500" /> Impact Report</>}
              {post.type === 'ACHIEVEMENT' && <><Trophy className="w-4 h-4 text-amber-500" /> Achievement</>}
              {post.type === 'COLLABORATION_CALL' && <><UsersIcon className="w-4 h-4 text-indigo-500" /> Collab Call</>}
            </div>
            <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        )}

        {/* Post Specific Content */}
        {post.type !== 'INNOVATION_DROP' && post.content && (
          <div className="px-6 pt-4 pb-2">
            {(post.content as any).description && (
              <p className="text-sm text-foreground/90 leading-relaxed font-medium">{(post.content as any).description}</p>
            )}
            {post.type === 'IMPACT_REPORT' && (
              <div className="mt-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-lg p-3 flex justify-between items-center">
                <span className="font-bold text-emerald-800 dark:text-emerald-200">{(post.content as any).metricName}</span>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground line-through">{(post.content as any).previousValue}</div>
                  <div className="font-black text-emerald-600">{(post.content as any).currentValue}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Innovation Core Card */}
        <div className={`px-6 pt-6 pb-4 ${post.type !== 'INNOVATION_DROP' ? 'bg-muted/10 mx-4 mb-4 mt-2 rounded-xl border' : ''}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border ring-2 ring-background">
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                  {innovation.title.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  {innovation.title}
                  {innovation.momentumScore > 70 && (
                    <span className="flex items-center text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      <Flame className="w-3 h-3 mr-0.5" /> Trending
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> {innovation.startup.name}
                </p>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></Button>
              } />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  toggleSave(innovation.id);
                  toast(isSaved ? "Removed from Saved" : "Saved to Collections");
                }}>
                  <Bookmark className="mr-2 h-4 w-4" /> {isSaved ? "Unsave" : "Save for later"}
                </DropdownMenuItem>
                <DropdownMenuItem render={
                  <Link href={`/compare`}><Activity className="mr-2 h-4 w-4" /> Add to Compare</Link>
                } />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Share link</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-sm font-semibold mb-6 pr-4">{innovation.tagline}</p>

          {/* Interactive Narrative */}
          <div className="border rounded-xl overflow-hidden bg-muted/20 mb-6">
            <div className="flex border-b bg-background/50">
              {(['PROBLEM', 'SOLUTION', 'IMPACT'] as const).map(tab => (
                <button
                  key={tab}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === tab ? 'bg-background border-b-2 border-primary text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-4 bg-background min-h-[100px] flex items-center">
              <p className="text-sm leading-relaxed text-foreground/90">
                {activeTab === 'PROBLEM' && innovation.problem}
                {activeTab === 'SOLUTION' && innovation.solution}
                {activeTab === 'IMPACT' && innovation.impact}
              </p>
            </div>
          </div>

          {/* Stage & Tech */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="w-full sm:w-1/2">
              <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                <span>Stage</span>
                <span className="text-primary">{innovation.stage}</span>
              </div>
              <Progress value={progressPercent} className="h-1.5" />
            </div>
            <div className="flex flex-wrap gap-1.5 justify-end">
              {innovation.technologies.slice(0, 3).map(tech => (
                <Badge key={tech} variant="secondary" className="text-[10px] font-semibold">{tech}</Badge>
              ))}
              {innovation.technologies.length > 3 && (
                <Badge variant="secondary" className="text-[10px]">+{innovation.technologies.length - 3}</Badge>
              )}
            </div>
          </div>

          {/* Opportunities Row */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 shrink-0 uppercase text-[10px] tracking-wider font-bold">
              Looking For:
            </Badge>
            {/* Hardcoded for demo based on mock data */}
            <Badge variant="outline" className="cursor-pointer hover:bg-muted shrink-0" onClick={() => { setSelectedOpp('GOVERNMENT_PILOT'); setOppModalOpen(true); }}>🏛 Gov Pilot</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted shrink-0" onClick={() => { setSelectedOpp('INVESTMENT'); setOppModalOpen(true); }}>💰 Investment</Badge>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-4 py-3 border-t bg-background flex flex-wrap gap-2 sm:gap-4 justify-between sm:justify-start">
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-9 px-3 gap-2 ${userSignal === 'PROMISING' ? 'text-rose-600 bg-rose-50 hover:bg-rose-100' : 'text-muted-foreground hover:bg-muted'}`}
              onClick={() => toggleSignal(currentUserId, post.id, innovation.id, 'PROMISING')}
            >
              <Rocket className="h-4 w-4" /> 
              <span className="font-semibold">{getSignalCount('PROMISING') > 0 ? getSignalCount('PROMISING') : 'Signal'}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="h-9 px-3 gap-2 text-muted-foreground hover:bg-muted" render={
              <Link href={`/innovation/${innovation.id}#discussion`}>
                <MessageSquareIcon className="h-4 w-4" />
                <span className="font-semibold">{post.comments?.length || 'Discuss'}</span>
              </Link>
            } />
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-9 px-3 gap-2 ${isTracked ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-muted-foreground hover:bg-muted'}`}
              onClick={() => {
                const nowTracked = toggleTrack(innovation.id);
                toast(nowTracked ? "Tracking added to Watchlist" : "Removed from Watchlist");
              }}
            >
              <Eye className="h-4 w-4" /> 
              <span className="font-semibold">{isTracked ? 'Tracking' : 'Track'}</span>
            </Button>
          </div>
          
          <Button size="sm" className="h-9 ml-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold" render={
            <Link href={`/innovation/${innovation.id}`}>Explore <ExternalLink className="h-3 w-3 ml-1" /></Link>
          } />
        </div>

        {/* Opportunity Modal */}
        <Dialog open={oppModalOpen} onOpenChange={setOppModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Express Interest: {selectedOpp?.replace('_', ' ')}</DialogTitle>
              <DialogDescription>
                Send a direct opportunity request to the founders of {innovation.title}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Your Organization</label>
                <div className="p-3 border rounded-lg bg-muted/50 font-medium">Smart City Indore (Government)</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Optional Message</label>
                <Textarea 
                  placeholder="E.g. We are looking to deploy this in Zone 3..." 
                  value={oppMessage}
                  onChange={e => setOppMessage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOppModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSendOpportunity} className="bg-indigo-600 hover:bg-indigo-700">Send Opportunity Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </CardContent>
    </Card>
  );
}

// Missing Lucide Icons
function BarChartIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;
}
function UsersIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
}
function MessageSquareIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
}
