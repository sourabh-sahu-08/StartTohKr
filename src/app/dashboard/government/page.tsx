"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useChallengeStore } from "@/store/challengeStore";
import { useProfileStore } from "@/store/profileStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Users, FileText, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GovernmentDashboard() {
  const { data: session } = useSession();
  const { currentProfile } = useProfileStore();
  const { challenges, applications, createChallenge, updateApplicationStatus } = useChallengeStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    department: currentProfile?.name || "Government Department",
    location: "National",
    deadline: "2026-12-31",
    budget: "$0",
    description: "",
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState("");

  const myChallenges = Object.values(challenges).filter(c => c.authorId === session?.user?.id);
  const myChallengeIds = myChallenges.map(c => c.id);
  const receivedApplications = Object.values(applications).filter(a => myChallengeIds.includes(a.challengeId));

  const handleCreate = () => {
    if (!newChallenge.title || !newChallenge.description) {
      toast.error("Please fill in title and description.");
      return;
    }
    
    createChallenge({
      ...newChallenge,
      status: 'OPEN',
      authorId: session?.user?.id || ""
    });
    
    toast.success("Challenge published successfully!");
    setIsCreating(false);
    setNewChallenge({ ...newChallenge, title: "", description: "", tags: [] });
  };

  const handleStatusUpdate = (appId: string, status: 'SHORTLISTED' | 'REJECTED') => {
    updateApplicationStatus(appId, status);
    toast.success(`Application marked as ${status.toLowerCase()}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Government Portal</h1>
          <p className="text-muted-foreground mt-1">Manage challenges and review startup applications.</p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger render={<Button className="gap-2">
            <Plus className="w-4 h-4" /> Publish Challenge
          </Button>} />
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Publish a New Challenge</DialogTitle>
              <DialogDescription>
                Define the problem you need solved and set a budget for potential pilots.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Challenge Title</Label>
                <Input value={newChallenge.title} onChange={e => setNewChallenge(p => ({ ...p, title: e.target.value }))} placeholder="e.g. AI for Traffic Optimization" />
              </div>
              <div className="space-y-2">
                <Label>Problem Description</Label>
                <Textarea className="min-h-[100px]" value={newChallenge.description} onChange={e => setNewChallenge(p => ({ ...p, description: e.target.value }))} placeholder="Describe the problem, constraints, and requirements..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Budget / Grant</Label>
                  <Input value={newChallenge.budget} onChange={e => setNewChallenge(p => ({ ...p, budget: e.target.value }))} placeholder="e.g. $50,000 Pilot" />
                </div>
                <div className="space-y-2">
                  <Label>Location / Scope</Label>
                  <Input value={newChallenge.location} onChange={e => setNewChallenge(p => ({ ...p, location: e.target.value }))} placeholder="e.g. State Level" />
                </div>
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input type="date" value={newChallenge.deadline} onChange={e => setNewChallenge(p => ({ ...p, deadline: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Tags (Press Enter)</Label>
                  <Input 
                    value={tagInput} 
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && tagInput.trim()) {
                        e.preventDefault();
                        if (!newChallenge.tags.includes(tagInput.trim())) {
                          setNewChallenge(p => ({ ...p, tags: [...p.tags, tagInput.trim()] }));
                        }
                        setTagInput("");
                      }
                    }}
                    placeholder="e.g. IoT, AI" 
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newChallenge.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground" onClick={() => setNewChallenge(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }))}>
                        {tag} &times;
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Publish Challenge</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myChallenges.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receivedApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receivedApplications.filter(a => a.status === 'SHORTLISTED' || a.status === 'SELECTED').length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="challenges">My Challenges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications" className="space-y-4 pt-4">
          {receivedApplications.length === 0 ? (
            <div className="text-center p-12 bg-muted/50 rounded-lg border border-dashed">
              <h3 className="text-lg font-semibold">No applications yet</h3>
              <p className="text-muted-foreground">Publish more challenges to receive proposals.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {receivedApplications.map(app => {
                const challenge = challenges[app.challengeId];
                return (
                  <Card key={app.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant="outline" className={
                            app.status === 'SHORTLISTED' ? 'bg-green-50 text-green-700' :
                            app.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : ''
                          }>
                            {app.status}
                          </Badge>
                          <CardTitle className="text-lg mt-2">Application for: {challenge?.title}</CardTitle>
                          <CardDescription>Submitted on {new Date(app.submittedAt).toLocaleDateString()}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap">{app.pitch}</p>
                    </CardContent>
                    {app.status === 'SUBMITTED' && (
                      <CardContent className="flex gap-3 pt-0 border-t mt-4 p-4">
                        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')}>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Shortlist for Review
                        </Button>
                        <Button variant="outline" className="text-rose-600 hover:bg-rose-50" onClick={() => handleStatusUpdate(app.id, 'REJECTED')}>
                          <XCircle className="w-4 h-4 mr-2" /> Reject
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="challenges" className="space-y-4 pt-4">
          {myChallenges.length === 0 ? (
            <div className="text-center p-12 bg-muted/50 rounded-lg border border-dashed">
              <h3 className="text-lg font-semibold">No challenges published</h3>
            </div>
          ) : (
            <div className="grid gap-4">
              {myChallenges.map(challenge => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge>{challenge.status}</Badge>
                        <CardTitle className="text-xl mt-2">{challenge.title}</CardTitle>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-green-700">{challenge.budget}</span>
                        <div className="text-xs text-muted-foreground mt-1">Deadline: {challenge.deadline}</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}