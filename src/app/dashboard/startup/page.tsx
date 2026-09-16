"use client";

import { useSession } from "next-auth/react";
import { useChallengeStore } from "@/store/challengeStore";
import { useInnovationStore } from "@/store/innovationStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Target, Activity } from "lucide-react";

export default function StartupDashboard() {
  const { data: session } = useSession();
  const { applications, challenges } = useChallengeStore();
  const { innovations } = useInnovationStore();

  const myInnovations = innovations.filter(inv => inv.startupId === session?.user?.id);
  const myApplications = Object.values(applications).filter(a => a.startupId === session?.user?.id);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Startup Hub</h1>
        <p className="text-muted-foreground mt-1">Track your innovations and government challenge applications.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Innovations</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myInnovations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Submitted</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted/Selected</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {myApplications.filter(a => a.status === 'SHORTLISTED' || a.status === 'SELECTED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Application Status</h2>
        {myApplications.length === 0 ? (
          <div className="text-center p-12 bg-muted/50 rounded-lg border border-dashed">
            <h3 className="text-lg font-semibold">No applications yet</h3>
            <p className="text-muted-foreground">Visit the Challenges page to discover opportunities.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {myApplications.map(app => {
              const challenge = challenges[app.challengeId];
              return (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className={
                          app.status === 'SHORTLISTED' || app.status === 'SELECTED' ? 'bg-green-50 text-green-700 border-green-200' :
                          app.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                        }>
                          {app.status}
                        </Badge>
                        <CardTitle className="text-xl mt-2">{challenge?.title || "Unknown Challenge"}</CardTitle>
                        <CardDescription>{challenge?.department}</CardDescription>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}