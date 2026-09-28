"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, FileText, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { getScalingHubInnovations } from "@/server/actions/scaling";
import { sendOpportunity } from "@/server/actions/interactions";

export default function ScalingHubPage() {
  const [innovations, setInnovations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);

  const handleRequestProposal = async (invId: string) => {
    try {
      setRequestingId(invId);
      await sendOpportunity({ innovationId: invId, type: "GOVERNMENT_PILOT", message: "We are interested in procuring your proven solution for our department." });
      toast.success("Procurement proposal requested successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to request proposal");
    } finally {
      setRequestingId(null);
    }
  };

  useEffect(() => {
    getScalingHubInnovations()
      .then(setInnovations)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">Scaling Hub</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Procurement-ready solutions that have successfully completed government pilots. Replicate these proven models in your department.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-muted-foreground" /></div>
      ) : innovations.length === 0 ? (
        <div className="text-center p-16 border-2 border-dashed rounded-xl bg-muted/20">
          <Rocket className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg font-medium">No Proven Solutions Yet</p>
          <p className="text-muted-foreground">Solutions will appear here once they successfully complete a government pilot.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {innovations.map((inv) => (
            <Card key={inv.id} className="flex flex-col hover:shadow-lg transition-shadow border-emerald-500/20 shadow-emerald-900/5">
              <CardHeader className="bg-emerald-50/50 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 font-bold uppercase tracking-wide text-[10px]">Procurement Ready</Badge>
                  <Badge variant="outline" className="bg-white">{inv.category}</Badge>
                </div>
                <CardTitle className="text-xl">{inv.title}</CardTitle>
                <CardDescription className="text-indigo-700 font-medium">by {inv.startup?.name}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 pt-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Solution</p>
                  <p className="text-sm line-clamp-3">{inv.solution}</p>
                </div>
                
                {inv.pilots && inv.pilots.length > 0 && (
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Proven Success
                    </p>
                    <p className="text-xs text-indigo-900 font-medium">
                      Successfully piloted with {inv.pilots.map((p: any) => p.governmentDept).join(", ")}.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="gap-2 border-t bg-muted/10 p-4">
                <Button variant="outline" className="flex-1 bg-white" render={<Link href={`/innovation/${inv.id}`} />}><FileText className="w-4 h-4 mr-2" /> Details</Button>
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleRequestProposal(inv.id)} disabled={requestingId === inv.id}>
                  {requestingId === inv.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ExternalLink className="w-4 h-4 mr-2" />} Request Proposal
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Ensure CheckCircle2 is imported if we use it
import { CheckCircle2 } from "lucide-react";