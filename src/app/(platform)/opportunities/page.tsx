"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MessageSquare, CheckCircle2, XCircle, Clock, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { OpportunityStatus } from "@prisma/client";
import { opportunityApi } from "@/lib/api/opportunity.api";

export default function OpportunitiesPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id; 
  
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await opportunityApi.getAll();
      setOpportunities(data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUserId]);

  const handleStatusUpdate = async (oppId: string, status: OpportunityStatus) => {
    try {
      await opportunityApi.updateStatus(oppId, status);
      toast.success(`Opportunity ${status.toLowerCase()}`);
      await loadData();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const myRequests = opportunities.filter(o => o.requesterId === currentUserId);
  const receivedRequests = opportunities.filter(o => o.innovation?.startup?.ownerId === currentUserId);

  const renderOppCard = (opp: any, isReceived: boolean) => (
    <Card key={opp.id} className="overflow-hidden bg-background hover:shadow-md transition-all">
      <CardHeader className="bg-muted/30 pb-4 border-b">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <Avatar className="w-12 h-12 border">
              <AvatarImage src={isReceived ? opp.requester?.image : opp.innovation?.startup?.image} />
              <AvatarFallback>{isReceived ? opp.requester?.name?.charAt(0) : opp.innovation?.startup?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{isReceived ? opp.requester?.name : opp.innovation?.startup?.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1 font-medium">
                <Building2 className="w-3.5 h-3.5" /> 
                {opp.type.replace('_', ' ')}
              </CardDescription>
            </div>
          </div>
          <Badge className={
            opp.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border-amber-200' :
            opp.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
            'bg-rose-100 text-rose-800 border-rose-200'
          }>
            {opp.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Regarding Innovation</span>
          <p className="font-semibold">{opp.innovation?.title}</p>
        </div>
        
        <div className="bg-muted/50 p-3 rounded-lg text-sm italic border-l-4 border-l-primary/30">
          "{opp.message}"
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {new Date(opp.createdAt).toLocaleDateString()}
          </span>
          
          <div className="flex gap-2">
            {isReceived && opp.status === 'PENDING' && (
              <>
                <Button size="sm" variant="outline" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200" onClick={() => handleStatusUpdate(opp.id, 'DECLINED')}>
                  <XCircle className="w-4 h-4 mr-1.5" /> Decline
                </Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleStatusUpdate(opp.id, 'ACCEPTED')}>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Accept & Connect
                </Button>
              </>
            )}
            
            {(opp.status === 'ACCEPTED' || opp.status === 'COMPLETED') && (
              <Button render={<Link href="/messages" />} size="sm" className="bg-indigo-600 hover:bg-indigo-700"><MessageSquare className="w-4 h-4 mr-1.5" /> Message</Button>
            )}
            
            {!isReceived && opp.status === 'PENDING' && (
              <Button size="sm" variant="outline" disabled>Awaiting Response</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Opportunities</h1>
        <p className="text-muted-foreground text-lg mt-2">Manage pilot requests, investments, and collaborations.</p>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="received">Received Requests ({receivedRequests.length})</TabsTrigger>
          <TabsTrigger value="sent">My Requests ({myRequests.length})</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <>
            <TabsContent value="received" className="mt-6 space-y-4">
              {receivedRequests.length === 0 ? (
                <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground">
                  No incoming opportunity requests yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {receivedRequests.map(opp => renderOppCard(opp, true))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sent" className="mt-6 space-y-4">
              {myRequests.length === 0 ? (
                <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground">
                  You haven't sent any opportunity requests.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myRequests.map(opp => renderOppCard(opp, false))}
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
