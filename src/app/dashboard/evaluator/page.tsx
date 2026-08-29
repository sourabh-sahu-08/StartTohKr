"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { EyeOff, CheckCircle2, FileText, AlertCircle, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useChallengeStore } from "@/store/challengeStore";
import { useInnovationStore } from "@/store/innovationStore";
import { useProfileStore } from "@/store/profileStore";

export default function EvaluatorDashboard() {
  const { data: session } = useSession();
  const { applications, challenges, updateApplicationStatus, submitEvaluation, evaluations } = useChallengeStore();
  const { innovations } = useInnovationStore();
  const { profiles } = useProfileStore();

  const [evaluating, setEvaluating] = useState<string | null>(null);
  const [evaluationFeedback, setEvaluationFeedback] = useState("");
  const [evaluationScore, setEvaluationScore] = useState<number>(50);

  const myEvaluations = Object.values(evaluations).filter(e => e.evaluatorId === session?.user?.id);
  
  // Evaluators see all SHORTLISTED applications that they haven't evaluated yet
  const pendingApplications = Object.values(applications).filter(app => 
    app.status === 'SHORTLISTED' && 
    !myEvaluations.some(e => e.applicationId === app.id)
  );

  const completedApplications = Object.values(applications).filter(app => 
    myEvaluations.some(e => e.applicationId === app.id)
  );

  const handleSubmitEvaluation = (appId: string) => {
    submitEvaluation({
      applicationId: appId,
      evaluatorId: session?.user?.id || "",
      score: evaluationScore,
      feedback: evaluationFeedback
    });
    
    updateApplicationStatus(appId, 'UNDER_REVIEW');
    
    toast.success("Evaluation submitted successfully.");
    setEvaluating(null);
    setEvaluationFeedback("");
    setEvaluationScore(50);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evaluator Workspace</h1>
        <p className="text-muted-foreground mt-1">Review and score shortlisted startup proposals.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Evaluations</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score Given</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myEvaluations.length > 0 
                ? Math.round(myEvaluations.reduce((acc, curr) => acc + curr.score, 0) / myEvaluations.length) 
                : "--"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Proposals Awaiting Evaluation</h2>
        
        {pendingApplications.length === 0 ? (
          <div className="text-center p-12 bg-muted/50 rounded-lg border border-dashed flex flex-col items-center">
            <EyeOff className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">You're all caught up!</h3>
            <p className="text-muted-foreground">No new proposals have been shortlisted for your review yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {pendingApplications.map(app => {
              const challenge = challenges[app.challengeId];
              const startup = profiles[app.startupId];
              const innovation = innovations.find(i => i.id === app.innovationId);
              
              return (
                <Card key={app.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Needs Review
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mt-2">{challenge?.title}</CardTitle>
                    <CardDescription>
                      Applicant: {startup?.name || "Unknown Startup"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Innovation Proposed</p>
                      <p className="font-medium">{innovation?.title || "Unknown Innovation"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Pitch</p>
                      <p className="text-sm line-clamp-3">{app.pitch}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 pt-4">
                    <Dialog open={evaluating === app.id} onOpenChange={(open) => !open && setEvaluating(null)}>
                      <DialogTrigger render={<Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => setEvaluating(app.id)}>
                        Evaluate Proposal
                      </Button>} />
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Evaluate: {startup?.name}</DialogTitle>
                          <DialogDescription>
                            Challenge: {challenge?.title}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 py-4">
                          <div className="p-4 bg-muted/50 rounded-md">
                            <h4 className="font-semibold mb-2">Applicant's Pitch</h4>
                            <p className="text-sm whitespace-pre-wrap">{app.pitch}</p>
                          </div>
                          
                          <div className="space-y-3">
                            <label className="text-sm font-medium flex justify-between">
                              <span>Technical Viability Score</span>
                              <span className="font-bold text-primary">{evaluationScore}/100</span>
                            </label>
                            <input 
                              type="range" 
                              min="0" max="100" 
                              value={evaluationScore} 
                              onChange={(e) => setEvaluationScore(Number(e.target.value))}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Not Viable (0)</span>
                              <span>Highly Scalable (100)</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Evaluation Feedback</label>
                            <Textarea 
                              className="min-h-[100px]"
                              placeholder="Provide constructive feedback on their technical approach, risks, and scalability..."
                              value={evaluationFeedback}
                              onChange={(e) => setEvaluationFeedback(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEvaluating(null)}>Cancel</Button>
                          <Button onClick={() => handleSubmitEvaluation(app.id)} className="bg-indigo-600 hover:bg-indigo-700">Submit Evaluation</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}