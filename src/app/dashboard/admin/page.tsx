"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ShieldAlert, CheckCircle2, UserX, Settings, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  
  const [users, setUsers] = useState([
    { id: 1, name: "EcoTech Innovations", role: "STARTUP", status: "pending_kyc", joinedAt: "Today" },
    { id: 2, name: "Global Ventures", role: "INVESTOR", status: "active", joinedAt: "Yesterday" },
    { id: 3, name: "Suspicious Account", role: "STARTUP", status: "flagged", joinedAt: "2 days ago" }
  ]);

  const handleVerify = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'active' } : u));
    toast.success("User KYC verified successfully.");
  };

  const handleBan = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'banned' } : u));
    toast.error("User has been banned from the platform.");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Control Center</h1>
          <p className="text-muted-foreground mt-1">Platform analytics, user moderation, and system settings.</p>
        </div>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          System Settings
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total Users <Users className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14,239</div>
            <p className="text-xs text-green-600 mt-1 flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> +12% this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Active Challenges <Shield className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">342</div>
            <p className="text-xs text-green-600 mt-1 flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> +4 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Ongoing Pilots <CheckCircle2 className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">89</div>
            <p className="text-xs text-muted-foreground mt-1">Across 12 states</p>
          </CardContent>
        </Card>
        <Card className="border-rose-200 bg-rose-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-800 flex items-center justify-between">
              Pending KYC / Flagged <AlertTriangle className="h-4 w-4 text-rose-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-700">42</div>
            <p className="text-xs text-rose-600 mt-1">Requires immediate review</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="moderation" className="w-full">
        <TabsList>
          <TabsTrigger value="moderation">User Moderation</TabsTrigger>
          <TabsTrigger value="reports">System Reports</TabsTrigger>
          <TabsTrigger value="content">Content Flagging</TabsTrigger>
        </TabsList>

        <TabsContent value="moderation" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Review Queue</CardTitle>
              <CardDescription>Accounts requiring KYC verification or manual intervention.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-muted/50 p-4 font-medium text-sm">
                  <div className="col-span-2">User / Entity</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div className="text-right">Actions</div>
                </div>
                {users.map(user => (
                  <div key={user.id} className="grid grid-cols-5 p-4 items-center border-t text-sm">
                    <div className="col-span-2">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">Joined {user.joinedAt}</p>
                    </div>
                    <div>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                    <div>
                      {user.status === 'active' && <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Active</Badge>}
                      {user.status === 'pending_kyc' && <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">Pending KYC</Badge>}
                      {user.status === 'flagged' && <Badge variant="destructive">Flagged</Badge>}
                      {user.status === 'banned' && <Badge variant="outline" className="bg-muted text-muted-foreground">Banned</Badge>}
                    </div>
                    <div className="flex justify-end gap-2">
                      {user.status === 'pending_kyc' && (
                        <Button size="sm" variant="outline" className="text-green-600 border-green-200 bg-green-50" onClick={() => handleVerify(user.id)}>
                          Approve KYC
                        </Button>
                      )}
                      {user.status !== 'banned' && (
                        <Button size="sm" variant="ghost" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={() => handleBan(user.id)}>
                          <UserX className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Reports</CardTitle>
              <CardDescription>Generated reports for cross-platform activity are currently compiling.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center border-t border-dashed bg-muted/10">
              <p className="text-muted-foreground flex items-center">
                <Settings className="w-5 h-5 mr-2 animate-spin" />
                Aggregating analytics data...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Content</CardTitle>
              <CardDescription>Posts and applications flagged by users or automated AI filters.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center border-t border-dashed bg-muted/10">
              <p className="text-muted-foreground flex items-center">
                <ShieldAlert className="w-5 h-5 mr-2" />
                No content currently flagged.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}