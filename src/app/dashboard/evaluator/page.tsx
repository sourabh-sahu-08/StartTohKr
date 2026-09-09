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

const INITIAL_PROPOSALS = [
  {
    id: 1,
    challenge: "Smart Traffic Optimization",
    applicant: "EcoTech Innovations",
    score: null,
    status: "pending",
    techStack: ["AI", "Computer Vision", "IoT"],
    summary: "A scalable, decentralized computer vision model that analyzes live traffic feeds to dynamically adjust signal times."
  },
  {
    id: 2,
    challenge: "Smart Traffic Optimization",
    applicant: "Mobility Networks Inc",
    score: 85,
    status: "evaluated",
    techStack: ["Edge Computing", "5G"],
    summary: "Hardware-intensive deployment utilizing edge nodes at every major intersection to calculate flow vectors."
  },
  {
    id: 3,
    challenge: "Rural Health Data Exchange",
    applicant: "MedChain Systems",
    score: null,
    status: "pending",
    techStack: ["Blockchain", "HL7", "React"],
    summary: "Secure health record system utilizing private Ethereum networks to ensure patient data immutability and compliance."
  }
];

export default function EvaluatorDashboard() {
  const { data: session } = useSession();
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [isBlindMode, setIsBlindMode] = useState(true);
  const [evaluating, setEvaluating] = useState<number | null>(null);

  const pendingCount = proposals.filter(p => p.status === 'pending').length;
  const evaluatedCount = proposals.filter(p => p.status === 'evaluated').length;
  const progress = (evaluatedCount / proposals.length) * 100;

  const handleSubmitEvaluation = (id: number) => {
    setProposals(proposals.map(p => p.id === id ? { ...p, status: 'evaluated', score: 90 } : p));
    setEvaluating(null);
    toast.success("Evaluation submitted successfully.");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluator Console</h1>
          <p className="text-muted-foreground mt-1">Review proposals, assign scores, and shortlist startups.</p>
        </div>
        <Button 
          variant={isBlindMode ? "default" : "outline"} 
          className={isBlindMode ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          onClick={() => {
            setIsBlindMode(!isBlindMode);
            toast.info(isBlindMode ? "Blind Evaluation disabled." : "Blind Evaluation enabled to reduce bias.");
          }}
        >
          <EyeOff className="w-4 h-4 mr-2" />
          {isBlindMode ? "Blind Mode: ON" : "Blind Mode: OFF"}
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Evaluations Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{evaluatedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">{Math.round(progress)}%</div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">Active Queue</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map(proposal => (
            <Card key={proposal.id} className={`flex flex-col ${proposal.status === 'evaluated' ? 'border-green-200 bg-green-50/10' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={proposal.status === 'evaluated' ? 'outline' : 'default'} className={proposal.status === 'evaluated' ? 'text-green-600 border-green-200' : ''}>
                    {proposal.status === 'evaluated' ? 'Scored' : 'Requires Review'}
                  </Badge>
                  {proposal.score && <span className="font-bold text-lg text-primary">{proposal.score}/100</span>}
                </div>
                <CardTitle className="text-lg line-clamp-1">{proposal.challenge}</CardTitle>
                <CardDescription className="font-medium text-primary">
                  {isBlindMode ? `Applicant #${proposal.id}409` : proposal.applicant}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {proposal.summary}
                </p>
                <div className="flex flex-wrap gap-1">
                  {proposal.techStack.map(tech => (
                    <span key={tech} className="bg-muted text-xs px-2 py-1 rounded-md">{tech}</span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 pt-4">
                {proposal.status === 'evaluated' ? (
                  <Button variant="outline" className="w-full text-green-700 hover:text-green-800" onClick={() => toast.info("Viewing evaluation summary...")}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> View Evaluation
                  </Button>
                ) : (
                  <Dialog open={evaluating === proposal.id} onOpenChange={(open) => !open && setEvaluating(null)}>
                    <DialogTrigger render={<Button className="w-full" onClick={() => setEvaluating(proposal.id)}>
                        <FileText className="w-4 h-4 mr-2" /> Evaluate Proposal
                      </Button>} />
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Evaluate Proposal</DialogTitle>
                        <DialogDescription>
                          {proposal.challenge} • {isBlindMode ? `Applicant #${proposal.id}409` : proposal.applicant}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-6">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Technical Feasibility (0-40)</h4>
                          <input type="range" className="w-full" min="0" max="40" defaultValue="30" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Cost Efficiency (0-30)</h4>
                          <input type="range" className="w-full" min="0" max="30" defaultValue="25" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Innovation (0-30)</h4>
                          <input type="range" className="w-full" min="0" max="30" defaultValue="20" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Evaluator Notes</h4>
                          <Textarea placeholder="Provide justification for the assigned scores..." />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEvaluating(null)}>Cancel</Button>
                        <Button onClick={() => handleSubmitEvaluation(proposal.id)}>Submit Evaluation</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}