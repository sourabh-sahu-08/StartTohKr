"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Activity, BarChart, Trophy, Users, HelpCircle, Send } from "lucide-react";
import { useFeedStore } from "@/store/feedStore";
import { PostType } from "@prisma/client";
import { toast } from "sonner";

export function CreateInnovationPost({ currentUserId }: { currentUserId: string }) {
  const { addPost } = useFeedStore();
  const [isOpen, setIsOpen] = useState(false);
  const [postType, setPostType] = useState<PostType | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [impact, setImpact] = useState("");

  const handleSubmit = () => {
    if (!postType) return;
    
    // In a real app, we would create the Innovation object in DB if INNOVATION_DROP
    addPost({
      innovationId: null,
      authorId: currentUserId,
      author: { id: currentUserId, name: "EcoTech Innovations", role: "STARTUP", image: "" },
      type: postType,
      content: { description, title, problem, solution, impact },
      mediaUrls: [],
    });
    
    setIsOpen(false);
    toast.success("Successfully shared to the Innovation Discovery Network!");
    
    // Reset
    setPostType(null);
    setTitle("");
    setDescription("");
    setProblem("");
    setSolution("");
    setImpact("");
  };

  const POST_TYPES = [
    { type: 'INNOVATION_DROP' as PostType, label: 'Innovation Drop', icon: <Lightbulb className="w-5 h-5 text-amber-500" />, desc: 'Launch a new idea or solution' },
    { type: 'PROGRESS_UPDATE' as PostType, label: 'Progress Update', icon: <Activity className="w-5 h-5 text-blue-500" />, desc: 'Share development milestones' },
    { type: 'IMPACT_REPORT' as PostType, label: 'Impact Report', icon: <BarChart className="w-5 h-5 text-emerald-500" />, desc: 'Share measurable results' },
    { type: 'COLLABORATION_CALL' as PostType, label: 'Collab Call', icon: <Users className="w-5 h-5 text-indigo-500" />, desc: 'Find partners or mentors' },
  ];

  return (
    <Card className="border-primary/10 shadow-sm mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger render={
              <Button variant="outline" className="w-full justify-start text-muted-foreground bg-muted/50 hover:bg-muted h-12 rounded-full px-6">
                Share an innovation, progress, or request...
              </Button>
            } />
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Share an Innovation Story</DialogTitle>
              </DialogHeader>

              {!postType ? (
                <div className="py-4 space-y-4">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">What are you sharing?</p>
                  <div className="grid grid-cols-2 gap-4">
                    {POST_TYPES.map(pt => (
                      <div 
                        key={pt.type}
                        onClick={() => setPostType(pt.type)}
                        className="border rounded-xl p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-left space-y-1"
                      >
                        {pt.icon}
                        <h3 className="font-bold">{pt.label}</h3>
                        <p className="text-xs text-muted-foreground">{pt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setPostType(null)} className="h-8 px-2 text-muted-foreground">← Back</Button>
                      <span className="font-bold text-sm tracking-wider uppercase text-primary">
                        {postType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {postType === 'INNOVATION_DROP' && (
                    <div className="space-y-4">
                      <Input placeholder="Innovation Name" value={title} onChange={e => setTitle(e.target.value)} className="font-bold text-lg" />
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-rose-500">The Problem</label>
                        <Textarea placeholder="What critical problem exists today?" className="border-rose-200 focus-visible:ring-rose-500" value={problem} onChange={e => setProblem(e.target.value)} />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-indigo-500">Your Solution</label>
                        <Textarea placeholder="How does your technology solve this?" className="border-indigo-200 focus-visible:ring-indigo-500" value={solution} onChange={e => setSolution(e.target.value)} />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-emerald-500">Expected Impact</label>
                        <Textarea placeholder="What is the measurable impact?" className="border-emerald-200 focus-visible:ring-emerald-500" value={impact} onChange={e => setImpact(e.target.value)} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-muted-foreground">Current Stage</label>
                          <Select defaultValue="PROTOTYPE">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IDEA">Idea</SelectItem>
                              <SelectItem value="PROTOTYPE">Prototype</SelectItem>
                              <SelectItem value="MVP">MVP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-muted-foreground">Category</label>
                          <Select defaultValue="ClimateTech">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ClimateTech">ClimateTech</SelectItem>
                              <SelectItem value="WaterTech">WaterTech</SelectItem>
                              <SelectItem value="Smart Cities">Smart Cities</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {postType !== 'INNOVATION_DROP' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Related Innovation</label>
                        <Select defaultValue="inv-1">
                          <SelectTrigger><SelectValue placeholder="Select innovation..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inv-1">AquaSense AI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Description</label>
                        <Textarea placeholder="Share the details..." rows={5} value={description} onChange={e => setDescription(e.target.value)} />
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t flex justify-end">
                    <Button onClick={handleSubmit} className="w-full sm:w-auto font-bold bg-indigo-600 hover:bg-indigo-700">
                      <Send className="w-4 h-4 mr-2" /> Share to Network
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
