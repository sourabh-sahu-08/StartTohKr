"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, TrendingUp, Handshake, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { getPromisingInnovations, getMyInvestments } from "@/server/actions/investors";
import { sendOpportunity } from "@/server/actions/interactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InvestorDashboard() {
  const [innovations, setInnovations] = useState<any[]>([]);
  const [myInvestments, setMyInvestments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getPromisingInnovations(),
      getMyInvestments()
    ])
      .then(([invs, investments]) => {
        setInnovations(invs);
        setMyInvestments(investments);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleInvest = async (invId: string) => {
    try {
      setRequestingId(invId);
      await sendOpportunity(invId, "INVESTMENT", "We are interested in discussing investment opportunities with your startup.");
      toast.success("Investment interest sent successfully!");
      
      const updatedInvestments = await getMyInvestments();
      setMyInvestments(updatedInvestments);
    } catch (e: any) {
      toast.error(e.message || "Failed to send investment request");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Investor Dashboard</h1>
        <p className="text-muted-foreground text-lg mt-2">Discover high-momentum startups and manage your investment pipeline.</p>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-muted-foreground" /></div>
      ) : (
        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList>
            <TabsTrigger value="discover">Discover Dealflow</TabsTrigger>
            <TabsTrigger value="portfolio">My Pipeline ({myInvestments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {innovations.map(inv => (
                <Card key={inv.id} className="flex flex-col hover:shadow-lg transition-shadow border-indigo-100">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">{inv.stage}</Badge>
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" /> {inv.momentumScore}
                      </div>
                    </div>
                    <CardTitle className="text-xl line-clamp-1">{inv.title}</CardTitle>
                    <CardDescription className="text-sm font-medium">by {inv.startup?.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">{inv.tagline || inv.problem}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge variant="outline" className="text-xs">{inv.category}</Badge>
                      {inv.startup?.industry && <Badge variant="outline" className="text-xs">{inv.startup.industry}</Badge>}
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2 border-t bg-muted/10 p-4">
                    <Button variant="outline" className="flex-1 bg-white" asChild>
                      <Link href={`/innovation/${inv.id}`}>
                        View Deck
                      </Link>
                    </Button>
                    <Button 
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700" 
                      onClick={() => handleInvest(inv.id)}
                      disabled={requestingId === inv.id}
                    >
                      {requestingId === inv.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Briefcase className="w-4 h-4 mr-2" />} 
                      Invest
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            {myInvestments.length === 0 ? (
              <div className="text-center p-16 border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground">
                You haven't initiated any investment conversations yet.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {myInvestments.map(invReq => (
                  <Card key={invReq.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{invReq.innovation?.startup?.name}</CardTitle>
                          <CardDescription>{invReq.innovation?.title}</CardDescription>
                        </div>
                        <Badge className={
                          invReq.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                          invReq.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }>{invReq.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardFooter className="bg-muted/30 border-t p-4 flex justify-between">
                      <span className="text-xs text-muted-foreground">Requested on {new Date(invReq.createdAt).toLocaleDateString()}</span>
                      {invReq.status === 'ACCEPTED' && (
                        <Button size="sm" asChild>
                          <Link href="/messages"><Handshake className="w-4 h-4 mr-2" /> Message Founders</Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}