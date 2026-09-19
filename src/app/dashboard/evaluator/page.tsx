"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { EyeOff, CheckCircle2, FileText, AlertCircle, TrendingUp, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { getApplicationsForEvaluation, getEvaluationsByMe, submitEvaluation, updateApplicationStatus } from "@/server/actions/evaluations";

export default function EvaluatorDashboard() {
  const { data: session } = useSession();
  
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [myEvaluations, setMyEvaluations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [evaluating, setEvaluating] = useState<string | null>(null);
  const [evaluationFeedback, setEvaluationFeedback] = useState("");
  const [evaluationScore, setEvaluationScore] = useState<number>(50);

  const loadData = async () => {
    try {
      const apps = await getApplicationsForEvaluation();
      const evals = await getEvaluationsByMe();
      
      const evalAppIds = new Set(evals.map((e: any) => e.applicationId));
      
      setPendingApplications(apps.filter((a: any) => !evalAppIds.has(a.id)));
      setMyEvaluations(evals);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) loadData();
  }, [session?.user?.id]);

  const handleEvaluate = async (appId: string) => {
    if (!evaluationFeedback.trim()) {
      toast.error("Feedback is required");
      return;
    }
    
    try {
      await submitEvaluation(appId, evaluationScore, evaluationFeedback);
      toast.success("Evaluation submitted successfully!");
      
      // If we just evaluated it, maybe we check if it reaches consensus.
      // For demo, we just update local state.
      
      setEvaluating(null);
      setEvaluationFeedback("");
      setEvaluationScore(50);
      
      await loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to submit evaluation");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Evaluator Dashboard</h1>
        <p className="text-muted-foreground text-lg mt-2">Review shortlisted pilot applications securely.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-indigo-50/50 border-indigo-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-indigo-800">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-900">{pendingApplications.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900">{myEvaluations.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Average Score Given</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">
              {myEvaluations.length ? Math.round(myEvaluations.reduce((acc, curr) => acc + (curr.scores && curr.scores[0] || 0), 0) / myEvaluations.length) : 0}/100
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" /> Pending Evaluations
          </h2>
          
          {isLoading ? (
            <div className="py-12 flex justify-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : pendingApplications.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/20">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-sm mt-1">No pending applications to review.</p>
            </div>
          ) : (
            pendingApplications.map((app) => (
              <Card key={app.id} className="border-amber-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 bg-amber-100 text-amber-800 text-xs font-bold rounded-bl-lg flex items-center gap-1">
                  <EyeOff className="w-3 h-3" /> Blind Review
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{app.challenge?.title}</CardTitle>
                  <CardDescription>Applicant: {app.startup?.name} (Identity Hidden)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Pitch</span>
                    <p className="text-sm mt-1 font-medium">{app.pitch}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Innovation Details</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background border p-3 rounded-md text-sm">
                        <span className="font-semibold block mb-1">Problem</span>
                        <span className="line-clamp-2 text-muted-foreground">{app.innovation?.problem}</span>
                      </div>
                      <div className="bg-background border p-3 rounded-md text-sm">
                        <span className="font-semibold block mb-1">Solution</span>
                        <span className="line-clamp-2 text-muted-foreground">{app.innovation?.solution}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t p-4 flex justify-end">
                  <Dialog open={evaluating === app.id} onOpenChange={(open) => !open && setEvaluating(null)}>
                    <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setEvaluating(app.id)} />}>
                        Evaluate Submission
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Evaluate: {app.challenge?.title}</DialogTitle>
                        <DialogDescription>Score this innovation based on feasibility, scalability, and impact.</DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6 py-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-sm font-semibold">Overall Score</label>
                            <span className="text-sm font-bold text-indigo-600">{evaluationScore}/100</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" max="100" 
                            value={evaluationScore} 
                            onChange={(e) => setEvaluationScore(parseInt(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Poor</span>
                            <span>Average</span>
                            <span>Excellent</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-semibold">Detailed Feedback & Rationale</label>
                          <Textarea 
                            placeholder="Explain the reasoning behind your score. This will be shared with the government department."
                            className="min-h-[120px]"
                            value={evaluationFeedback}
                            onChange={(e) => setEvaluationFeedback(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEvaluating(null)}>Cancel</Button>
                        <Button onClick={() => handleEvaluate(app.id)} className="bg-indigo-600">Submit Evaluation</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Completed Evaluations
          </h2>
          
          <div className="space-y-4">
            {myEvaluations.length === 0 && !isLoading && (
              <div className="text-muted-foreground text-sm p-4 bg-muted/30 rounded-lg">You haven't completed any evaluations yet.</div>
            )}
            {myEvaluations.map((evalRecord) => (
              <Card key={evalRecord.id} className="shadow-sm">
                <CardHeader className="py-3 px-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{evalRecord.application?.challenge?.title}</CardTitle>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Score: {(evalRecord.scores && evalRecord.scores[0] || 0)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">"{evalRecord.feedback}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}