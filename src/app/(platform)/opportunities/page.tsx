/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useOpportunityStore } from "@/store/opportunityStore";
import { useNotificationStore } from "@/store/notificationStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MessageSquare, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { OpportunityStatus } from "@prisma/client";

export default function OpportunitiesPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id || "usr-startup-1"; 
  
  const { opportunities, updateStatus } = useOpportunityStore();
  const { addNotification } = useNotificationStore();

  const handleStatusUpdate = (oppId: string, status: OpportunityStatus, requesterId: string) => {
    updateStatus(oppId, status);
    
    if (status === 'ACCEPTED') {
      addNotification({
        userId: requesterId,
        title: "Opportunity Accepted!",
        message: "Your opportunity request has been accepted. You can now collaborate.",
        link: "/messages"
      });
      toast.success("Opportunity accepted! A new conversation has been started in Messages.");
    } else {
      toast.info("Opportunity declined.");
    }
  };

  const received = opportunities.filter(o => o.innovation?.startupId === currentUserId);
  const sent = opportunities.filter(o => o.requesterId === currentUserId);

  const renderOppCard = (opp: any, isReceived: boolean) => (
    <Card key={opp.id} className="overflow-hidden border-primary/10 transition-all hover:shadow-md">
      <CardHeader className="bg-muted/30 pb-4 border-b">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={isReceived ? opp.requester.image : opp.innovation?.startup?.image} />
              <AvatarFallback>{isReceived ? opp.requester.name?.substring(0,2) : opp.innovation?.title?.substring(0,2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold">{isReceived ? opp.requester.name : opp.innovation?.title}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Building2 className="w-3 h-3" /> {isReceived ? opp.requester.role : "Innovation"}
              </p>
            </div>
          </div>
          <Badge variant={
            opp.status === 'ACCEPTED' ? 'default' : 
            opp.status === 'PENDING' ? 'outline' : 'secondary'
          } className={opp.status === 'ACCEPTED' ? 'bg-emerald-500' : ''}>
            {opp.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Opportunity Type</span>
          <p className="font-semibold text-primary">{opp.type.replace('_', ' ')}</p>
        </div>
        
        <div className="bg-muted/50 p-3 rounded-lg text-sm border border-dashed">
          <p className="italic text-muted-foreground">&quot;{opp.message}&quot;</p>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {new Date(opp.createdAt).toLocaleDateString()}
          </span>
          
          <div className="flex gap-2">
            {isReceived && opp.status === 'PENDING' && (
              <>
                <Button variant="outline" size="sm" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => handleStatusUpdate(opp.id, 'DECLINED', opp.requesterId)}>
                  <XCircle className="w-4 h-4 mr-1" /> Decline
                </Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleStatusUpdate(opp.id, 'ACCEPTED', opp.requesterId)}>
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Accept
                </Button>
              </>
            )}
            
            {opp.status === 'ACCEPTED' && (
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" render={
                <Link href="/messages"><MessageSquare className="w-4 h-4 mr-1" /> Open Conversation</Link>
              } />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Opportunity Inbox</h1>
        <p className="text-muted-foreground">Manage your incoming and outgoing collaboration requests.</p>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="received">Received ({received.length})</TabsTrigger>
          <TabsTrigger value="sent">Sent ({sent.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="received" className="mt-6 space-y-4">
          {received.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground">
              No received opportunities yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {received.map(o => renderOppCard(o, true))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sent" className="mt-6 space-y-4">
          {sent.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground">
              You haven&apos;t sent any opportunity requests yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {sent.map(o => renderOppCard(o, false))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
