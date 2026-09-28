/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use } from "react";
import { useInnovationStore } from "@/store/innovationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Activity, Eye, Flame, Users, Briefcase } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { getInnovation } = useInnovationStore();
  const innovation = getInnovation(resolvedParams.id);

  if (!innovation) return <div className="p-8 text-center">Innovation not found</div>;

  const mockStats = {
    views: Math.floor(Math.random() * 500) + 200,
    signals: Math.floor(innovation.momentumScore * 2.5),
    trackers: Math.floor(innovation.momentumScore * 1.2),
    opportunities: Math.floor(innovation.momentumScore / 15),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Analytics: {innovation.title}</h1>
          <p className="text-muted-foreground">Monitor discovery, engagement, and opportunity conversion.</p>
        </div>
        <Link href={`/innovation/${innovation.id}`} className="text-sm font-semibold text-indigo-600 hover:underline">
          &larr; Back to Innovation
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-black">{mockStats.views}</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile Views</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <span className="text-2xl font-black">{mockStats.signals}</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Signals Received</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <span className="text-2xl font-black">{mockStats.trackers}</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Trackers</span>
          </CardContent>
        </Card>
        <Card className="bg-indigo-600 text-white border-none">
          <CardContent className="p-6 flex flex-col gap-2">
            <Briefcase className="w-5 h-5 text-indigo-200" />
            <span className="text-2xl font-black">{mockStats.opportunities}</span>
            <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Opportunities</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5" /> Opportunity Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold"><span>Discovery (Views)</span> <span>{mockStats.views}</span></div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold"><span>Interest (Signals)</span> <span>{mockStats.signals}</span></div>
              <Progress value={(mockStats.signals / mockStats.views) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold"><span>Intent (Trackers)</span> <span>{mockStats.trackers}</span></div>
              <Progress value={(mockStats.trackers / mockStats.views) * 100} className="h-2 bg-amber-100" indicatorColor="bg-amber-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold text-indigo-600"><span>Action (Opportunities)</span> <span>{mockStats.opportunities}</span></div>
              <Progress value={(mockStats.opportunities / mockStats.views) * 100} className="h-2 bg-indigo-100" indicatorColor="bg-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-emerald-50 border-dashed border-2">
            <CardContent className="p-6">
              <div className="flex gap-3 mb-3">
                <span className="text-2xl">✨</span>
                <h3 className="font-bold text-lg text-indigo-900">Innovation Insight</h3>
              </div>
              <p className="text-sm text-indigo-800 leading-relaxed font-medium">
                Your innovation is currently generating {mockStats.opportunities > 2 ? 'high' : 'steady'} interest from Government users. 
                Based on your current momentum score of <span className="font-bold">{innovation.momentumScore}</span>, we highly recommend publishing an Impact Report to trigger Watchlist alerts and drive further pilot opportunities.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Momentum Drivers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm border-b pb-2">
                <span className="text-muted-foreground">Recent Signals</span>
                <span className="font-bold text-emerald-600">+12.5 pts</span>
              </div>
              <div className="flex justify-between text-sm border-b pb-2">
                <span className="text-muted-foreground">New Trackers</span>
                <span className="font-bold text-emerald-600">+8.0 pts</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Opportunities Received</span>
                <span className="font-bold text-emerald-600">+15.0 pts</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
