/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use } from "react";
import { useInnovationStore } from "@/store/innovationStore";
import { useUserStore } from "@/store/userStore";
import { useOpportunityStore } from "@/store/opportunityStore";
import { useFeedStore } from "@/store/feedStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Building, CheckCircle2, ChevronLeft, Target, ExternalLink, Lightbulb, Flame, MessageSquare, Briefcase } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { OpportunityType } from "@prisma/client";

export default function InnovationStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const { getInnovation, innovations } = useInnovationStore();
  const { trackedInnovations, toggleTrack, savedInnovations, toggleSave } = useUserStore();
  const { sendOpportunity } = useOpportunityStore();
  const { posts, addComment } = useFeedStore();

  const innovation = getInnovation(id);
  
  const [oppModalOpen, setOppModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityType | null>(null);
  const [oppMessage, setOppMessage] = useState("");
  const [commentText, setCommentText] = useState("");

  if (!innovation) return <div className="p-12 text-center text-muted-foreground font-medium">Innovation not found.</div>;

  const isTracked = trackedInnovations.includes(innovation.id);
  const isSaved = savedInnovations.includes(innovation.id);
  
  // Find similar innovations (mock logic: same category)
  const similarInnovations = innovations.filter(i => i.category === innovation.category && i.id !== innovation.id).slice(0, 3);
  
  // Get discussions (mock logic: posts linked to this innovation, plus their comments)
  const relatedPosts = posts.filter(p => p.innovationId === innovation.id);

  const handleSendOpportunity = () => {
    if (!selectedOpp) return;
    sendOpportunity("usr-gov-2", innovation.id, selectedOpp, oppMessage);
    setOppModalOpen(false);
    toast.success("Opportunity request sent to the startup!");
    setOppMessage("");
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment(relatedPosts[0]?.id || null, innovation.id, "usr-gov-2", "INSIGHT", commentText);
    setCommentText("");
    toast.success("Discussion point added.");
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in">
      
      {/* Top Nav */}
      <div className="mb-6 flex justify-between items-center">
        <Button variant="ghost" className="-ml-4 text-muted-foreground" render={
          <Link href="/feed"><ChevronLeft className="w-4 h-4 mr-1" /> Back to Feed</Link>
        } />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { toggleSave(innovation.id); toast(isSaved ? "Removed from Saved" : "Saved to Collections"); }}>
            <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} /> {isSaved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" size="sm" className="text-indigo-600" render={
            <Link href={`/innovation/${innovation.id}/analytics`}>Analytics</Link>
          } />
        </div>
      </div>

      {/* Hero Section */}
      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-muted/20 mb-8">
        <CardContent className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
            <div className="space-y-4 max-w-2xl">
              <div className="flex gap-2 items-center mb-2">
                <Badge variant="secondary" className="px-3 py-1 text-sm font-bold tracking-widest">{innovation.category}</Badge>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 text-sm font-bold tracking-widest">{innovation.stage}</Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">{innovation.title}</h1>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">{innovation.tagline}</p>
              
              <div className="flex items-center gap-3 pt-4 text-muted-foreground font-medium">
                <Avatar className="w-8 h-8 border ring-2 ring-background">
                  <AvatarFallback className="bg-primary/5 text-primary text-xs">{innovation.startup?.name?.substring(0,2) || 'S'}</AvatarFallback>
                </Avatar>
                <span className="flex items-center gap-1.5 text-sm"><Building className="w-4 h-4" /> {innovation.startup?.name || 'Startup'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-center md:items-end min-w-[200px]">
              <div className="text-center p-6 bg-background rounded-2xl border-2 border-primary/10 shadow-sm w-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10"><Flame className="w-16 h-16 text-rose-500" /></div>
                <div className="relative z-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Momentum</p>
                  <p className="text-4xl font-black text-rose-600">{innovation.momentumScore}</p>
                  <p className="text-[10px] text-rose-600/70 font-bold uppercase mt-1 flex items-center justify-center gap-1">Top 5%</p>
                </div>
              </div>
              <Button 
                className={`w-full font-bold h-12 text-sm ${isTracked ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
                onClick={() => { const s = toggleTrack(innovation.id); toast(s ? "Tracking added" : "Tracking removed"); }}
              >
                {isTracked ? "Tracking Active" : "Track Innovation"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold flex items-center gap-2"><Target className="text-rose-500" /> The Problem</h2>
            <div className="p-6 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/50">
              <p className="text-foreground/90 leading-relaxed font-medium">{innovation.problem}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold flex items-center gap-2"><Lightbulb className="text-indigo-500" /> The Solution</h2>
            <div className="p-6 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
              <p className="text-foreground/90 leading-relaxed font-medium">{innovation.solution}</p>
              
              <div className="mt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Technologies</h3>
                <div className="flex gap-2 flex-wrap">
                  {innovation.technologies.map(t => (
                    <Badge key={t} variant="outline" className="bg-background">{t}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold flex items-center gap-2"><CheckCircle2 className="text-emerald-500" /> Expected Impact</h2>
            <div className="p-6 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
              <p className="text-foreground/90 leading-relaxed font-medium">{innovation.impact}</p>
            </div>
          </section>

          {/* Discussion System */}
          <section id="discussion" className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-extrabold flex items-center gap-2">Smart Discussion</h2>
            <div className="flex gap-2">
              <Textarea 
                placeholder="Share an insight, feedback, or collaboration idea..." 
                className="bg-muted/30"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground font-medium">Comments are categorized as Insights, Questions, or Feedback to maintain quality.</p>
              <Button onClick={handleAddComment}>Post Insight</Button>
            </div>

            <div className="space-y-4 mt-8">
              {relatedPosts.flatMap(p => p.comments).map(comment => (
                <div key={comment.id} className="flex gap-4 p-4 border rounded-xl bg-background">
                  <Avatar className="w-10 h-10 border"><AvatarFallback>{comment.user?.name?.substring(0,2) || 'U'}</AvatarFallback></Avatar>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{comment.user?.name || 'User'}</span>
                      <Badge variant="secondary" className="text-[10px]">{comment.category}</Badge>
                      <span className="text-xs text-muted-foreground ml-auto">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
              {relatedPosts.flatMap(p => p.comments).length === 0 && (
                <div className="text-center p-8 border border-dashed rounded-xl text-muted-foreground">No discussions yet. Be the first to share an insight!</div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-extrabold text-lg flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Opportunities</h3>
              <p className="text-sm text-muted-foreground">The startup is actively looking for:</p>
              <div className="space-y-2">
                {/* Mock Data Opportunities */}
                <Button variant="outline" className="w-full justify-between font-bold" onClick={() => { setSelectedOpp('GOVERNMENT_PILOT'); setOppModalOpen(true); }}>
                  <span>🏛 Gov Pilot</span> <ChevronLeft className="w-4 h-4 rotate-180 text-muted-foreground" />
                </Button>
                <Button variant="outline" className="w-full justify-between font-bold" onClick={() => { setSelectedOpp('INVESTMENT'); setOppModalOpen(true); }}>
                  <span>💰 Investment</span> <ChevronLeft className="w-4 h-4 rotate-180 text-muted-foreground" />
                </Button>
                <Button variant="outline" className="w-full justify-between font-bold" onClick={() => { setSelectedOpp('COLLABORATION'); setOppModalOpen(true); }}>
                  <span>🤝 Collaboration</span> <ChevronLeft className="w-4 h-4 rotate-180 text-muted-foreground" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-extrabold text-lg">Journey</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                {['IDEA', 'PROTOTYPE', 'MVP', 'PILOT'].map((s, i) => (
                  <div key={s} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full border-4 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${['IDEA', 'PROTOTYPE', 'MVP'].includes(s) || (s==='PILOT' && innovation.stage==='PILOT') ? 'bg-primary border-primary/30' : 'bg-muted border-background'}`}></div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border bg-background shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-sm">{s}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Achieved milestone successfully.</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {similarInnovations.length > 0 && (
            <div className="space-y-3 pt-6 border-t">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground">Similar Innovations</h3>
              <div className="space-y-3">
                {similarInnovations.map(inv => (
                  <Link key={inv.id} href={`/innovation/${inv.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0">{inv.title.substring(0,2)}</div>
                    <div>
                      <h4 className="text-sm font-bold">{inv.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{inv.tagline}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
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
    </div>
  );
}
