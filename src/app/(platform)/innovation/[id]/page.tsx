"use client";

import { use, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Building, CheckCircle2, ChevronLeft, Target, ExternalLink, Lightbulb, Flame, MessageSquare, Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { OpportunityType } from "@prisma/client";
import { getInnovationDetails, getSimilarInnovations } from "@/server/actions/innovation";
import { toggleTrack, toggleSave, sendOpportunity } from "@/server/actions/interactions";
import { addComment } from "@/server/actions/comments"; // We need to create this!

export default function InnovationStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const [innovation, setInnovation] = useState<any>(null);
  const [similarInnovations, setSimilarInnovations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [oppModalOpen, setOppModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityType | null>(null);
  const [oppMessage, setOppMessage] = useState("");
  const [commentText, setCommentText] = useState("");
  
  const [isTracked, setIsTracked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const loadData = async () => {
    try {
      const data = await getInnovationDetails(id);
      setInnovation(data);
      if (data) {
        const similar = await getSimilarInnovations(data.category, data.id);
        setSimilarInnovations(similar);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!innovation) return <div className="p-12 text-center text-muted-foreground font-medium">Innovation not found.</div>;

  const handleTrack = async () => {
    const res = await toggleTrack(innovation.id);
    setIsTracked(res.action === 'tracked');
    toast.success(res.action === 'tracked' ? "Tracking this innovation" : "Untracked");
  };

  const handleSave = async () => {
    const res = await toggleSave('INNOVATION', innovation.id);
    setIsSaved(res.action === 'saved');
    toast.success(res.action === 'saved' ? "Saved to your collections" : "Removed from saved");
  };

  const handleSendOpportunity = async () => {
    if (!selectedOpp) return;
    try {
      await sendOpportunity({ innovationId: innovation.id, type: selectedOpp, message: oppMessage });
      setOppModalOpen(false);
      setOppMessage("");
      toast.success("Opportunity request sent to the startup!");
    } catch (e) {
      toast.error("Failed to send opportunity.");
    }
  };
  
  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;
    try {
      await addComment({ postId, innovationId: innovation.id, content: commentText, category: 'GENERAL' });
      setCommentText("");
      toast.success("Comment added!");
      await loadData();
    } catch (e) {
      toast.error("Failed to add comment.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-6">
        <Link href="/feed" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Discovery
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{innovation.category}</Badge>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">{innovation.stage}</Badge>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {innovation.title}
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              {innovation.tagline}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4 pb-2 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border shadow-sm">
                  <AvatarImage src={innovation.startup?.image || ""} />
                  <AvatarFallback className="font-bold">{innovation.startup?.name?.charAt(0) || "S"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-sm flex items-center gap-1">
                    {innovation.startup?.name} 
                    {innovation.startup?.startupProfile?.verification === 'VERIFIED' && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building className="w-3 h-3" /> {innovation.startup?.startupProfile?.location || "India"}
                  </div>
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant={isTracked ? "default" : "outline"} className={isTracked ? "bg-indigo-600 hover:bg-indigo-700" : ""} onClick={handleTrack}>
                  <Target className="w-4 h-4 mr-2" /> {isTracked ? "Tracking" : "Track"}
                </Button>
                <Button variant="outline" size="icon" onClick={handleSave} className={isSaved ? "text-indigo-600 border-indigo-200 bg-indigo-50" : ""}>
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-amber-500" /> The Problem</h2>
              <p className="text-foreground/90 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100">{innovation.problem}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-3"><Flame className="w-5 h-5 text-emerald-500" /> The Solution</h2>
              <p className="text-foreground/90 leading-relaxed bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">{innovation.solution}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-3"><Target className="w-5 h-5 text-indigo-500" /> Measurable Impact</h2>
              <p className="text-foreground/90 leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">{innovation.impact}</p>
            </div>
          </section>

          <section className="pt-6 border-t">
            <h2 className="text-2xl font-bold mb-6">Discussions & Updates</h2>
            
            <div className="space-y-6">
              {innovation.posts?.map((post: any) => (
                <Card key={post.id} className="shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={post.author?.image} />
                          <AvatarFallback>{post.author?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">{post.author?.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge>{post.type}</Badge>
                    </div>
                    <p className="text-sm mb-4">{post.content?.text}</p>
                    
                    <div className="space-y-3 pt-3 border-t">
                      {post.comments?.map((comment: any) => (
                        <div key={comment.id} className="flex gap-2 text-sm bg-muted/30 p-2 rounded-md">
                          <Avatar className="w-6 h-6"><AvatarFallback>{comment.user?.name?.charAt(0)}</AvatarFallback></Avatar>
                          <div>
                            <span className="font-semibold mr-2">{comment.user?.name}</span>
                            <span className="text-muted-foreground">{comment.content}</span>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input placeholder="Add an insight..." value={commentText} onChange={e => setCommentText(e.target.value)} className="h-8 text-sm" />
                        <Button size="sm" onClick={() => handleAddComment(post.id)}>Post</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(!innovation.posts || innovation.posts.length === 0) && (
                <div className="text-center p-8 border border-dashed rounded-xl text-muted-foreground">No updates yet.</div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-extrabold text-lg flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Opportunities</h3>
              <p className="text-sm text-muted-foreground">The startup is actively looking for:</p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-between font-bold" onClick={() => { setSelectedOpp('GOVERNMENT_PILOT'); setOppModalOpen(true); }}>
                  <span>🤝 Gov Pilot</span> <ChevronLeft className="w-4 h-4 rotate-180 text-muted-foreground" />
                </Button>
                <Button variant="outline" className="w-full justify-between font-bold" onClick={() => { setSelectedOpp('INVESTMENT'); setOppModalOpen(true); }}>
                  <span>💰 Investment</span> <ChevronLeft className="w-4 h-4 rotate-180 text-muted-foreground" />
                </Button>
                <Button variant="outline" className="w-full justify-between font-bold" onClick={() => { setSelectedOpp('TECHNICAL_COLLABORATION'); setOppModalOpen(true); }}>
                  <span>🔬 Collaboration</span> <ChevronLeft className="w-4 h-4 rotate-180 text-muted-foreground" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-extrabold text-lg">Journey</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                {['IDEA', 'PROTOTYPE', 'MVP', 'PILOT'].map((s) => (
                  <div key={s} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full border-4 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${['IDEA', 'PROTOTYPE', 'MVP'].includes(s) || (s==='PILOT' && innovation.stage==='PILOT') ? 'bg-primary border-primary/30' : 'bg-muted border-background'}`}></div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border bg-background shadow-sm">
                      <div className="font-bold text-sm mb-1">{s}</div>
                      <div className="text-xs text-muted-foreground">Achieved milestone successfully.</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={oppModalOpen} onOpenChange={setOppModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Express Interest</DialogTitle>
            <DialogDescription>
              Connect with {innovation.startup?.name} regarding {selectedOpp?.replace('_', ' ')}.
            </DialogDescription>
          </DialogHeader>
          <Textarea 
            className="min-h-[120px]" 
            placeholder="Introduce yourself and explain the opportunity..." 
            value={oppMessage}
            onChange={e => setOppMessage(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOppModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSendOpportunity} disabled={!oppMessage.trim()} className="bg-indigo-600 hover:bg-indigo-700">Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
