"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Activity, BarChart, Trophy, Users, HelpCircle, Send, Save, ArrowRight, ArrowLeft } from "lucide-react";
import { useFeedStore } from "@/store/feedStore";
import { PostType } from "@prisma/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function CreateInnovationPost({ currentUserId }: { currentUserId: string }) {
  const { addPost } = useFeedStore();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  
  // State
  const [postType, setPostType] = useState<PostType | null>(null);
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [impact, setImpact] = useState("");
  const [stage, setStage] = useState("PROTOTYPE");
  const [industry, setIndustry] = useState("ClimateTech");
  const [opportunities, setOpportunities] = useState<string[]>([]);

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const toggleOpp = (o: string) => {
    setOpportunities(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);
  };

  const handleSubmit = (isDraft: boolean) => {
    if (!postType) return;
    
    if (isDraft) {
      toast("Saved to drafts (available in Profile).");
      setIsOpen(false);
      return;
    }

    addPost({
      innovationId: null,
      authorId: currentUserId,
      author: { id: currentUserId, name: "EcoTech Innovations", role: "STARTUP", image: "" },
      type: postType,
      content: { title, problem, solution, impact, stage, industry, opportunities },
      mediaUrls: [],
    });
    
    setIsOpen(false);
    toast.success("Successfully shared to the Innovation Discovery Network!");
    
    // Reset
    setTimeout(() => {
      setStep(1);
      setPostType(null);
      setTitle("");
      setProblem("");
      setSolution("");
      setImpact("");
    }, 500);
  };

  const POST_TYPES = [
    { type: 'INNOVATION_DROP' as PostType, label: 'Innovation Drop', icon: <Lightbulb className="w-5 h-5 text-amber-500" />, desc: 'Launch a new idea or solution' },
    { type: 'PROGRESS_UPDATE' as PostType, label: 'Progress Update', icon: <Activity className="w-5 h-5 text-blue-500" />, desc: 'Share development milestones' },
    { type: 'IMPACT_REPORT' as PostType, label: 'Impact Report', icon: <BarChart className="w-5 h-5 text-emerald-500" />, desc: 'Share measurable results' },
    { type: 'COLLABORATION_CALL' as PostType, label: 'Collab Call', icon: <Users className="w-5 h-5 text-indigo-500" />, desc: 'Find partners or mentors' },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="py-4 space-y-4 animate-in fade-in slide-in-from-right-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">What are you sharing?</p>
            <div className="grid grid-cols-2 gap-4">
              {POST_TYPES.map(pt => (
                <div 
                  key={pt.type}
                  onClick={() => { setPostType(pt.type); handleNext(); }}
                  className={`border rounded-xl p-4 cursor-pointer transition-all text-left space-y-1 ${postType === pt.type ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:border-primary hover:bg-primary/5'}`}
                >
                  {pt.icon}
                  <h3 className="font-bold">{pt.label}</h3>
                  <p className="text-xs text-muted-foreground">{pt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="py-4 space-y-4 animate-in fade-in slide-in-from-right-4">
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
          </div>
        );
      case 3:
        return (
          <div className="py-4 space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase text-muted-foreground">Current Stage</label>
              <div className="flex gap-2 flex-wrap">
                {["Idea", "Prototype", "MVP", "Pilot", "Scaling"].map(s => (
                  <Badge key={s} variant={stage === s ? "default" : "outline"} className="cursor-pointer px-3 py-1 text-sm" onClick={() => setStage(s)}>{s}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase text-muted-foreground">Industry / Category</label>
              <Select value={industry} onValueChange={(val: any) => setIndustry((val as string) || "")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ClimateTech">ClimateTech</SelectItem>
                  <SelectItem value="WaterTech">WaterTech</SelectItem>
                  <SelectItem value="Smart Cities">Smart Cities</SelectItem>
                  <SelectItem value="HealthTech">HealthTech</SelectItem>
                  <SelectItem value="AgriTech">AgriTech</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="py-4 space-y-4 animate-in fade-in slide-in-from-right-4">
            <label className="text-xs font-bold uppercase text-muted-foreground">What are you looking for?</label>
            <div className="grid grid-cols-2 gap-3">
              {["Investment", "Government Pilot", "Collaboration", "Mentorship", "Industry Partner"].map(opp => (
                <div 
                  key={opp}
                  onClick={() => toggleOpp(opp)}
                  className={`border p-3 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${opportunities.includes(opp) ? 'bg-primary/10 border-primary font-bold text-primary' : 'hover:bg-muted font-medium text-muted-foreground'}`}
                >
                  {opp}
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="py-4 space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="bg-muted/30 p-4 rounded-xl border border-dashed space-y-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span className="font-bold">{title || "Untitled Innovation"}</span>
              </div>
              <div className="text-sm space-y-2">
                <p><span className="font-semibold">Problem:</span> {problem}</p>
                <p><span className="font-semibold">Solution:</span> {solution}</p>
              </div>
              <div className="flex gap-2">
                <Badge>{stage}</Badge>
                <Badge variant="secondary">{industry}</Badge>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground mt-4">Your post is ready to be published to the discovery network.</p>
          </div>
        );
      default:
        return null;
    }
  };

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
                Share an innovation story...
              </Button>
            } />
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  Create Innovation Story
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">Step {step} of 5</span>
                </DialogTitle>
                <div className="flex gap-1 pt-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
                  ))}
                </div>
              </DialogHeader>

              {renderStep()}

              <DialogFooter className="flex items-center justify-between sm:justify-between w-full pt-4 border-t mt-4">
                {step > 1 ? (
                  <Button variant="ghost" onClick={handleBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                ) : <div />}
                
                <div className="flex gap-2">
                  {step === 5 && (
                    <Button variant="outline" onClick={() => handleSubmit(true)}><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
                  )}
                  {step < 5 ? (
                    <Button onClick={handleNext} disabled={step === 1 && !postType}>Next <ArrowRight className="w-4 h-4 ml-2" /></Button>
                  ) : (
                    <Button onClick={() => handleSubmit(false)} className="bg-indigo-600 hover:bg-indigo-700 font-bold"><Send className="w-4 h-4 mr-2" /> Publish</Button>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
