/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AdvancedFilters({ activeFilters, setActiveFilters }: { activeFilters: any, setActiveFilters: any }) {
  const INDUSTRIES = ["AI", "ClimateTech", "AgriTech", "HealthTech", "EdTech", "Smart Cities", "Clean Energy", "Mobility"];
  const STAGES = ["Idea", "Prototype", "MVP", "Pilot", "Scaling"];
  const TECH = ["AI", "IoT", "Blockchain", "Computer Vision", "Robotics"];
  const OPPS = ["Investment", "Pilot", "Collaboration", "Mentorship"];

  const toggleFilter = (category: string, value: string) => {
    const current = activeFilters[category] || [];
    const newValues = current.includes(value) 
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    
    setActiveFilters({ ...activeFilters, [category]: newValues });
  };

  const getCount = () => {
    return Object.values(activeFilters).reduce((acc: number, arr: any) => acc + arr.length, 0);
  };

  const count = getCount();

  return (
    <Sheet>
      <SheetTrigger render={
        <Button variant="outline" className="gap-2 shrink-0 border-dashed border-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters {count > 0 && <Badge variant="secondary" className="ml-1 px-1 h-5">{count}</Badge>}
        </Button>
      } />
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle>Advanced Discovery</SheetTitle>
            {count > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setActiveFilters({ industry: [], stage: [], tech: [], opps: [] })}>
                Clear All
              </Button>
            )}
          </div>
          <SheetDescription>Narrow down innovations by specific criteria.</SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Industry</h3>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map(ind => (
                <Badge 
                  key={ind} 
                  variant={activeFilters.industry?.includes(ind) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFilter('industry', ind)}
                >
                  {ind}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Innovation Stage</h3>
            <div className="flex flex-wrap gap-2">
              {STAGES.map(s => (
                <Badge 
                  key={s} 
                  variant={activeFilters.stage?.includes(s) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFilter('stage', s)}
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Technology</h3>
            <div className="flex flex-wrap gap-2">
              {TECH.map(t => (
                <Badge 
                  key={t} 
                  variant={activeFilters.tech?.includes(t) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFilter('tech', t)}
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Looking For</h3>
            <div className="flex flex-wrap gap-2">
              {OPPS.map(o => (
                <Badge 
                  key={o} 
                  variant={activeFilters.opps?.includes(o) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFilter('opps', o)}
                >
                  {o}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
