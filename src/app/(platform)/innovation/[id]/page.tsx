"use client";

import { useFeedStore } from "@/store/feedStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Bookmark, Building, CheckCircle2, ChevronLeft, MapPin, Target, ExternalLink, Lightbulb, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { InnovationStage } from "@prisma/client";
import { toast } from "sonner";

export default function InnovationStoryPage() {
  const params = useParams();
  const id = params.id as string;
  const { innovations, toggleTrack, trackedInnovations } = useFeedStore();

  const innovation = innovations.find(i => i.id === id) || innovations[0]; // fallback for demo
  const isTracked = trackedInnovations.includes(innovation.id);

  const STAGES: InnovationStage[] = ['IDEA', 'PROTOTYPE', 'MVP', 'PILOT', 'SCALING'];

  const getStageColor = (stage: InnovationStage) => {
    switch (stage) {
      case 'IDEA': return 'bg-gray-200 text-gray-700';
      case 'PROTOTYPE': return 'bg-blue-100 text-blue-700';
      case 'MVP': return 'bg-indigo-100 text-indigo-700';
      case 'PILOT': return 'bg-amber-100 text-amber-700';
      case 'SCALING': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Link href="/feed" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Discovery
      </Link>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
        <div className="space-y-4 flex-1">
          <div className="flex gap-4 items-center mb-2">
            <Avatar className="h-16 w-16 border-2 shadow-sm">
              <AvatarImage src={innovation.startup.image || ''} />
              <AvatarFallback className="font-bold text-xl">{innovation.startup.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-black tracking-tight">{innovation.title}</h1>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                <Building className="w-4 h-4" /> {innovation.startup.name} 
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </p>
            </div>
          </div>
          
          <p className="text-xl text-primary font-medium">{innovation.tagline}</p>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {innovation.technologies.map(tech => (
              <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col gap-3 min-w-[200px]">
          <Button 
            className={`w-full font-bold h-12 text-md transition-colors ${isTracked ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
            onClick={() => {
              toggleTrack(innovation.id);
              toast(isTracked ? "Removed from Watchlist" : "Added to Watchlist");
            }}
          >
            <Bookmark className={`w-5 h-5 mr-2 ${isTracked ? 'fill-current' : ''}`} /> 
            {isTracked ? 'Tracked' : 'Track Innovation'}
          </Button>
          <Button variant="outline" className="w-full font-bold h-12 text-md border-primary/20 hover:bg-primary/5">
            <Target className="w-5 h-5 mr-2" /> Offer Opportunity
          </Button>
        </div>
      </div>

      {/* Stage Journey */}
      <Card className="border-none bg-muted/30 shadow-none">
        <CardContent className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Innovation Journey</h3>
          <div className="flex items-center justify-between font-bold text-xs sm:text-sm">
            {STAGES.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="relative flex flex-col items-center flex-1">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                    s === innovation.stage 
                      ? getStageColor(s) + ' ring-4 ring-primary/20 scale-125 z-10' 
                      : STAGES.indexOf(s) < STAGES.indexOf(innovation.stage)
                        ? 'bg-primary/80 text-primary-foreground'
                        : 'bg-background border-2 border-dashed text-muted-foreground'
                  }`}>
                    {STAGES.indexOf(s) <= STAGES.indexOf(innovation.stage) ? <CheckCircle2 className="w-4 h-4" /> : i+1}
                  </div>
                  <span className={`absolute top-10 font-bold ${s === innovation.stage ? 'text-primary' : 'text-muted-foreground'}`}>{s}</span>
                </div>
                {i < STAGES.length - 1 && <div className={`flex-1 h-1 ${STAGES.indexOf(s) < STAGES.indexOf(innovation.stage) ? 'bg-primary/80' : 'bg-border border-dashed'}`} />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deep Dive Grid */}
      <div className="grid md:grid-cols-3 gap-8 pt-8">
        <div className="md:col-span-2 space-y-12">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-rose-600 flex items-center gap-2">
              <span className="bg-rose-100 p-2 rounded-lg"><Target className="w-6 h-6" /></span>
              The Challenge
            </h2>
            <div className="prose prose-rose dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed font-medium">{innovation.problem}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-indigo-600 flex items-center gap-2">
              <span className="bg-indigo-100 p-2 rounded-lg"><Lightbulb className="w-6 h-6" /></span>
              The Solution
            </h2>
            <div className="prose prose-indigo dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">{innovation.solution}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-emerald-600 flex items-center gap-2">
              <span className="bg-emerald-100 p-2 rounded-lg"><TrendingUp className="w-6 h-6" /></span>
              Measurable Impact
            </h2>
            <div className="prose prose-emerald dark:prose-invert max-w-none border-l-4 border-emerald-500 pl-6 bg-emerald-50/50 dark:bg-emerald-950/20 py-4 rounded-r-xl">
              <p className="text-xl font-bold leading-relaxed m-0 text-emerald-900 dark:text-emerald-100">{innovation.impact}</p>
            </div>
          </section>

        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-muted/30 pb-4">
              <h3 className="font-black uppercase tracking-wider text-sm">Active Opportunities</h3>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="border rounded-lg p-3 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition-colors">
                <p className="font-bold text-emerald-700">💰 Investment</p>
                <p className="text-xs text-muted-foreground mt-1">Looking for seed funding to scale manufacturing.</p>
              </div>
              <div className="border rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                <p className="font-bold text-blue-700">🏛 Gov Pilot</p>
                <p className="text-xs text-muted-foreground mt-1">Ready for municipal deployment in Tier-1 cities.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-muted/30 pb-4">
              <h3 className="font-black uppercase tracking-wider text-sm">Momentum</h3>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col items-center justify-center">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
                  <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="377" strokeDashoffset={377 - (377 * innovation.momentumScore) / 100} className="text-rose-500 transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-rose-600">{innovation.momentumScore}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Score</span>
                </div>
              </div>
              <p className="text-sm font-bold text-rose-600 mt-4 bg-rose-50 px-3 py-1 rounded-full">🔥 Rising Fast</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
    </div>
  );
}
