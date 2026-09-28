"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Target, Activity, Loader2 } from "lucide-react";
import { getStartupDashboardData } from "@/server/actions/dashboards";

export default function StartupDashboard() {
  const { data: session } = useSession();

  const [myInnovations, setMyInnovations] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      getStartupDashboardData()
        .then(data => {
          setMyInnovations(data.myInnovations);
          setMyApplications(data.myApplications);
        })
        .finally(() => setIsLoading(false));
    }
  }, [session?.user?.id]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Startup Hub</h1>
        <p className="text-muted-foreground mt-1">Track your innovations and government challenge applications.</p>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Innovations</CardTitle>
                <Rocket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{myInnovations.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{myApplications.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
                <Activity className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{myApplications.filter(a => a.status === 'SHORTLISTED' || a.status === 'SELECTED').length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Status of your challenge submissions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myApplications.length === 0 ? (
                    <div className="text-sm text-muted-foreground">You haven't applied to any challenges yet.</div>
                  ) : (
                    myApplications.map((app) => (
                      <div key={app.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{app.challenge?.title}</p>
                          <p className="text-xs text-muted-foreground">{app.innovation?.title}</p>
                        </div>
                        <Badge variant="outline">{app.status}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Innovations</CardTitle>
                <CardDescription>Innovations you have published to the network.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myInnovations.length === 0 ? (
                    <div className="text-sm text-muted-foreground">You haven't published any innovations yet.</div>
                  ) : (
                    myInnovations.map((inv) => (
                      <div key={inv.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <p className="font-medium text-sm">{inv.title}</p>
                        <Badge variant="outline">{inv.stage}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}