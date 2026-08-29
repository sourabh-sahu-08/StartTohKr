import { Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OpportunityDetectedCard({ matchPercentage, reasons, innovationName }: { matchPercentage: number, reasons: string[], innovationName: string }) {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-0.5 shadow-lg my-6 transform hover:scale-[1.01] transition-transform">
      <div className="bg-background rounded-[10px] p-5 h-full relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24" />
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h3 className="text-sm font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Opportunity Detected
          </h3>
        </div>
        
        <div className="mb-4">
          <span className="text-3xl font-bold text-foreground">{matchPercentage}% Match</span>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            This innovation strongly aligns with your profile interests and Smart City focus areas.
          </p>
        </div>
        
        <div className="space-y-2 mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Why am I seeing this?</p>
          {reasons.map((reason, i) => (
            <div key={i} className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
        
        <div className="flex gap-3">
          <Button className="bg-indigo-600 hover:bg-indigo-700 w-full font-bold">Connect & Discuss</Button>
          <Button variant="outline" className="w-full font-bold">View Match Details</Button>
        </div>
      </div>
    </div>
  );
}
