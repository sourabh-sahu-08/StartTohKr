"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Users, FileText, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getGovernmentApplications, updateApplicationStatus } from "@/server/actions/evaluations";
import { getChallenges, createChallenge } from "@/server/actions/challenges";

export default function GovernmentDashboard() {
  const { data: session } = useSession();
  
  const [challenges, setChallenges] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreating, setIsCreating] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    department: session?.user?.name || "Government Department",
    category: "Smart City",
    deadline: "",
    budget: "",
    description: "",
  });

  const loadData = async () => {
    try {
      const allChallenges = await getChallenges();
      // Only show challenges authored by this government user
      const myChallenges = allChallenges.filter(c => c.department === session?.user?.name);
      setChallenges(myChallenges);

      const apps = await getGovernmentApplications();
      setApplications(apps);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) loadData();
  }, [session?.user?.id]);

  const handleCreateChallenge = async () => {
    try {
      await createChallenge({
        title: newChallenge.title,
        department: newChallenge.department,
        description: newChallenge.description,
        category: newChallenge.category,
        budget: newChallenge.budget,
        deadline: new Date(newChallenge.deadline)
      });
      toast.success("Challenge published successfully!");
      setIsCreating(false);
      await loadData();
    } catch (e) {
      toast.error("Failed to create challenge");
    }
  };

  const handleUpdateAppStatus = async (appId: string, status: string) => {
    try {
      await updateApplicationStatus(appId, status);
      toast.success(`Application marked as ${status}`);
      await loadData();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const pendingApps = applications.filter(a => a.status === 'SUBMITTED');
  const shortlistedApps = applications.filter(a => a.status === 'SHORTLISTED');
  const selectedApps = applications.filter(a => a.status === 'SELECTED');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Department Dashboard</h1>
          <p className="text-muted-foreground text-lg mt-2">Manage your challenges, procurements, and pilots.</p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700" />}><Plus className="w-4 h-4 mr-2" /> Publish Challenge</DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Publish New Challenge</DialogTitle>
              <DialogDescription>
                Define a problem statement for startups to solve.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2 col-span-2">
                <Label>Challenge Title</Label>
                <Input value={newChallenge.title} onChange={e => setNewChallenge({...newChallenge, title: e.target.value})} placeholder="e.g. Smart Traffic Optimization" />
              </div>
              <div className="space-y-2">
                <Label>Budget</Label>
                <Input value={newChallenge.budget} onChange={e => setNewChallenge({...newChallenge, budget: e.target.value})} placeholder="$50,000 Pilot" />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" value={newChallenge.deadline} onChange={e => setNewChallenge({...newChallenge, deadline: e.target.value})} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Problem Description</Label>
                <Textarea value={newChallenge.description} onChange={e => setNewChallenge({...newChallenge, description: e.target.value})} className="min-h-[100px]" placeholder="Describe the specific problem you are facing..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={handleCreateChallenge} className="bg-indigo-600">Publish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-muted-foreground" /></div>
      ) : (
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
            <TabsTrigger value="challenges">My Challenges ({challenges.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold">{pendingApps.length}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Shortlisted (In Eval)</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold text-amber-600">{shortlistedApps.length}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Selected for Pilot</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold text-emerald-600">{selectedApps.length}</div></CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold mt-8">Recent Submissions</h2>
              {applications.length === 0 ? (
                <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/20">
                  No applications received yet.
                </div>
              ) : (
                applications.map(app => (
                  <Card key={app.id} className="shadow-sm">
                    <CardHeader className="pb-3 border-b bg-muted/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{app.startup?.name}</CardTitle>
                          <CardDescription className="mt-1 font-medium text-indigo-700">Applied to: {app.challenge?.title}</CardDescription>
                        </div>
                        <Badge variant="outline" className={
                          app.status === 'SUBMITTED' ? 'bg-slate-100' :
                          app.status === 'SHORTLISTED' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          app.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800'
                        }>{app.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase">Startup Pitch</span>
                        <p className="text-sm mt-1">{app.pitch}</p>
                      </div>
                      
                      {app.evaluations && app.evaluations.length > 0 && (
                        <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-lg">
                          <span className="text-xs font-bold text-amber-800 uppercase flex items-center gap-1 mb-2">
                            <FileText className="w-3 h-3" /> Evaluator Feedback
                          </span>
                          <div className="space-y-3">
                            {app.evaluations.map((ev: any, idx: number) => (
                              <div key={idx} className="text-sm flex justify-between items-start border-b border-amber-200/50 last:border-0 pb-2 last:pb-0">
                                <span className="text-muted-foreground flex-1 pr-4">"{ev.feedback}"</span>
                                <Badge className="bg-amber-200 text-amber-900 border-none shrink-0">Score: {ev.score}/100</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2">
                        {app.status === 'SUBMITTED' && (
                          <>
                            <Button variant="outline" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={() => handleUpdateAppStatus(app.id, 'REJECTED')}>
                              <XCircle className="w-4 h-4 mr-1.5" /> Reject
                            </Button>
                            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => handleUpdateAppStatus(app.id, 'SHORTLISTED')}>
                              <Users className="w-4 h-4 mr-1.5" /> Send to Evaluators
                            </Button>
                          </>
                        )}
                        {app.status === 'SHORTLISTED' && app.evaluations?.length > 0 && (
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleUpdateAppStatus(app.id, 'SELECTED')}>
                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Select for Pilot
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.length === 0 ? (
                <div className="col-span-full text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/20">
                  You haven't published any challenges yet.
                </div>
              ) : (
                challenges.map(challenge => (
                  <Card key={challenge.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">{challenge.status}</Badge>
                        <span className="text-sm font-semibold text-indigo-600">{challenge.applications?.length || 0} Applications</span>
                      </div>
                      <CardTitle className="mt-2 text-xl">{challenge.title}</CardTitle>
                      <CardDescription>{challenge.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{challenge.description}</p>
                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <div className="text-sm font-semibold text-emerald-700">{challenge.budget}</div>
                        <div className="text-xs text-muted-foreground">Deadline: {new Date(challenge.deadline).toLocaleDateString()}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}