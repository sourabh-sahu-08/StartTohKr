"use client";

import { useState } from "react";
import { useInnovationStore } from "@/store/innovationStore";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertCircle, PlusCircle, CheckCircle2 } from "lucide-react";

export default function ComparePage() {
  const { innovations } = useInnovationStore();
  const [selectedIds, setSelectedIds] = useState<string[]>(['inv-aqua-1', 'inv-agri-1']);

  const selectedInnovations = selectedIds.map(id => innovations.find(i => i.id === id)).filter(Boolean) as typeof innovations;

  const addInnovation = (id: string) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeInnovation = (id: string) => {
    setSelectedIds(selectedIds.filter(x => x !== id));
  };

  const unselectedInnovations = innovations.filter(i => !selectedIds.includes(i.id));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Compare Innovations</h1>
        <p className="text-muted-foreground">Compare up to 3 innovations side-by-side to evaluate momentum, technology, and impact.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Select onValueChange={(val: any) => val && addInnovation(val as string)} disabled={selectedIds.length >= 3}>
          <SelectTrigger className="w-full sm:max-w-xs">
            <SelectValue placeholder={selectedIds.length >= 3 ? "Maximum (3) Selected" : "Add Innovation to Compare"} />
          </SelectTrigger>
          <SelectContent>
            {unselectedInnovations.map(inv => (
              <SelectItem key={inv.id} value={inv.id}>{inv.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedIds.length < 2 && (
          <div className="flex items-center text-amber-600 text-sm gap-2">
            <AlertCircle className="w-4 h-4" /> Please select at least 2 innovations to compare.
          </div>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="overflow-x-auto border rounded-xl bg-background shadow-sm">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-4 font-bold text-sm text-muted-foreground w-1/4">Criteria</th>
                {selectedInnovations.map(inv => (
                  <th key={inv.id} className="p-4 w-1/4 align-top">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{inv.title}</h3>
                        <p className="text-xs text-muted-foreground font-medium mt-1">{inv.startup.name}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-rose-600" onClick={() => removeInnovation(inv.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </th>
                ))}
                {Array.from({ length: 3 - selectedInnovations.length }).map((_, i) => (
                  <th key={`empty-${i}`} className="p-4 w-1/4 align-top">
                    <div className="h-full w-full border-2 border-dashed rounded-xl flex items-center justify-center min-h-[80px] text-muted-foreground/50">
                      <PlusCircle className="w-6 h-6" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              <tr>
                <td className="p-4 font-semibold text-muted-foreground bg-muted/10">Stage</td>
                {selectedInnovations.map(inv => (
                  <td key={inv.id} className="p-4 font-medium"><Badge>{inv.stage}</Badge></td>
                ))}
                {Array.from({ length: 3 - selectedInnovations.length }).map((_, i) => <td key={`e1-${i}`} className="p-4"></td>)}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-muted-foreground bg-muted/10">Industry</td>
                {selectedInnovations.map(inv => (
                  <td key={inv.id} className="p-4 font-medium">{inv.category}</td>
                ))}
                {Array.from({ length: 3 - selectedInnovations.length }).map((_, i) => <td key={`e2-${i}`} className="p-4"></td>)}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-muted-foreground bg-muted/10">Momentum</td>
                {selectedInnovations.map(inv => (
                  <td key={inv.id} className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-rose-600 text-lg">{inv.momentumScore}</span>
                      {inv.momentumScore > 70 && <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold uppercase">Trending</span>}
                    </div>
                  </td>
                ))}
                {Array.from({ length: 3 - selectedInnovations.length }).map((_, i) => <td key={`e3-${i}`} className="p-4"></td>)}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-muted-foreground bg-muted/10">Technologies</td>
                {selectedInnovations.map(inv => (
                  <td key={inv.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {inv.technologies.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                    </div>
                  </td>
                ))}
                {Array.from({ length: 3 - selectedInnovations.length }).map((_, i) => <td key={`e4-${i}`} className="p-4"></td>)}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-muted-foreground bg-muted/10 align-top">Impact Claim</td>
                {selectedInnovations.map(inv => (
                  <td key={inv.id} className="p-4 align-top">
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 p-3 rounded-lg flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-xs font-medium text-emerald-900 dark:text-emerald-100">{inv.impact}</span>
                    </div>
                  </td>
                ))}
                {Array.from({ length: 3 - selectedInnovations.length }).map((_, i) => <td key={`e5-${i}`} className="p-4"></td>)}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
