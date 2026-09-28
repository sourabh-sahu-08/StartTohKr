"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertCircle, PlusCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { getAllInnovationsCompact } from "@/server/actions/compare";
import Link from "next/link";

export default function ComparePage() {
  const [innovations, setInnovations] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState("");

  useEffect(() => {
    getAllInnovationsCompact()
      .then(data => {
        setInnovations(data);
        if (data.length >= 2) {
          setSelectedIds([data[0].id, data[1].id]);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const selectedInnovations = selectedIds.map(id => innovations.find(i => i.id === id)).filter(Boolean);

  const addInnovation = (id: string) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeInnovation = (id: string) => {
    setSelectedIds(selectedIds.filter(x => x !== id));
    setAiInsight("");
  };

  const unselectedInnovations = innovations.filter(i => !selectedIds.includes(i.id));

  const handleAiAnalysis = () => {
    setIsAiAnalyzing(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setAiInsight(`Based on the comparison of these ${selectedInnovations.length} solutions, ${selectedInnovations[0]?.title} shows the highest market readiness with a momentum score of ${selectedInnovations[0]?.momentumScore}, making it ideal for immediate pilot deployment. However, if your budget is constrained, ${selectedInnovations[1]?.title || "the alternative"} offers a highly cost-effective approach with similar core capabilities.`);
      setIsAiAnalyzing(false);
    }, 2000);
  };

  if (isLoading) {
    return <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compare Solutions</h1>
        <p className="text-muted-foreground mt-1">Side-by-side technical and commercial comparison of startup innovations.</p>
      </div>

      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-600" /> AI Procurement Analyst</h3>
            <p className="text-sm text-muted-foreground mt-1">Let StartTohKr AI analyze your selected solutions and recommend the best fit for your department's specific requirements.</p>
          </div>
          <Button onClick={handleAiAnalysis} disabled={isAiAnalyzing || selectedInnovations.length < 2} className="bg-indigo-600 hover:bg-indigo-700 shrink-0">
            {isAiAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Generate Recommendation
          </Button>
        </CardContent>
        {aiInsight && (
          <div className="px-6 pb-6 pt-2 border-t border-indigo-100/50 mt-2">
            <p className="text-sm font-medium text-indigo-900 leading-relaxed italic border-l-4 border-indigo-500 pl-4">{aiInsight}</p>
          </div>
        )}
      </Card>

      <div className="flex gap-4 items-center">
        <Select onValueChange={addInnovation} disabled={selectedIds.length >= 3}>
          <SelectTrigger className="w-[300px] bg-background">
            <SelectValue placeholder="Add solution to compare..." />
          </SelectTrigger>
          <SelectContent>
            {unselectedInnovations.map(inv => (
              <SelectItem key={inv.id} value={inv.id}>{inv.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">({selectedIds.length}/3 selected)</span>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max">
          {selectedInnovations.map((inv) => (
            <Card key={inv.id} className="w-[350px] shrink-0 border-indigo-50 relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
                onClick={() => removeInnovation(inv.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold line-clamp-1 pr-6" title={inv.title}>{inv.title}</h3>
                  <p className="text-sm text-indigo-600 font-medium">by {inv.startup?.name}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Category</p>
                    <Badge variant="outline">{inv.category}</Badge>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">TRL Stage</p>
                    <Badge className={
                      inv.stage === 'PROVEN' ? 'bg-emerald-100 text-emerald-800' :
                      inv.stage === 'SCALING' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-amber-100 text-amber-800'
                    }>{inv.stage}</Badge>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Est. Budget</p>
                    <p className="text-sm font-medium">{inv.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Est. Timeline</p>
                    <p className="text-sm font-medium">{inv.timeline}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Momentum</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: \`\${inv.momentumScore}%\` }} />
                      </div>
                      <span className="text-sm font-bold">{inv.momentumScore}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={`/innovation/${inv.id}`}>View Full Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {selectedIds.length < 3 && (
            <div className="w-[350px] shrink-0 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20 p-6 min-h-[400px]">
              <PlusCircle className="w-8 h-8 mb-2 opacity-50" />
              <p className="font-medium">Add Solution</p>
              <p className="text-sm opacity-70 text-center mt-1">Select another innovation from the dropdown above to compare.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
