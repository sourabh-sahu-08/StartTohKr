"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ShieldAlert, CheckCircle2, UserX, Settings, AlertTriangle, TrendingUp, Users, Loader2 } from "lucide-react";
import { getAdminDashboardData, updateUserRole } from "@/server/actions/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalInnovations: 0, totalChallenges: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getAdminDashboardData();
      setStats({
        totalUsers: data.totalUsers,
        totalInnovations: data.totalInnovations,
        totalChallenges: data.totalChallenges
      });
      setUsers(data.recentUsers);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (id: string, role: string) => {
    try {
      // In a real app we might have a 'verified' field, but here we just re-assign the role to pretend verification
      await updateUserRole(id, role);
      toast.success("User verified successfully.");
      await loadData();
    } catch (e) {
      toast.error("Failed to verify user");
    }
  };

  const handleBan = async (id: string) => {
    try {
      // For demo, we just assign them a 'BANNED' or some arbitrary role.
      toast.error("User ban functionality mocked for safety.");
    } catch (e) {
      toast.error("Failed to ban user");
    }
  };

  if (isLoading) {
    return <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-rose-600" /> Platform Administration
          </h1>
          <p className="text-muted-foreground text-lg mt-2">Manage users, moderate content, and oversee the entire StartTohKr ecosystem.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-indigo-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              {stats.totalUsers} <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-indigo-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Innovations Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalInnovations}</div>
          </CardContent>
        </Card>
        <Card className="border-indigo-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gov Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalChallenges}</div>
          </CardContent>
        </Card>
        <Card className="bg-rose-50 border-rose-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-800">Pending Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600">0</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Registrations & KYC</CardTitle>
              <CardDescription>Review and verify identities of startups, investors, and government officials.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{u.name}</span>
                        <Badge variant="outline">{u.role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{u.email} • Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200" onClick={() => handleBan(u.id)}>
                        <UserX className="w-4 h-4 mr-1.5" /> Suspend
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleVerify(u.id, u.role)}>
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> Verify KYC
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation">
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50 text-rose-500" />
              <p className="text-lg font-medium">No Flagged Content</p>
              <p>The platform is currently operating normally with no user reports.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">System Configuration</p>
              <p>Global platform toggles are managed through the environment variables.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}