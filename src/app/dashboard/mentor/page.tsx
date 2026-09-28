"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Handshake, Loader2 } from "lucide-react";
import Link from "next/link";
import { getMentorshipCandidates, getMyMentorships } from "@/server/actions/mentors";
import { interactionApi } from "@/lib/api/interaction.api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MentorshipCandidate = Awaited<ReturnType<typeof getMentorshipCandidates>>[0];
type MentorshipRequest = Awaited<ReturnType<typeof getMyMentorships>>[0];

export default function MentorDashboard() {
  const [innovations, setInnovations] = useState<MentorshipCandidate[]>([]);
  const [myMentorships, setMyMentorships] = useState<MentorshipRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getMentorshipCandidates(),
      getMyMentorships()
    ])
      .then(([invs, mentorships]) => {
        setInnovations(invs);
        setMyMentorships(mentorships);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleOfferMentorship = async (invId: string) => {
    try {
      setRequestingId(invId);
      await interactionApi.sendOpportunity({ innovationId: invId, type: "MENTORSHIP", message: "I would love to offer my mentorship to help guide your startup." });
      toast.success("Mentorship offer sent successfully!");
      
      const updatedMentorships = await getMyMentorships();
      setMyMentorships(updatedMentorships);
    } catch (e: unknown) {
      toast.error((e as Error).message || "Failed to send mentorship offer");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Mentor Dashboard</h1>
        <p className="text-muted-foreground text-lg mt-2">Discover early-stage startups and guide them to success.</p>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-muted-foreground" /></div>
      ) : (
        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList>
            <TabsTrigger value="discover">Discover Mentees</TabsTrigger>
            <TabsTrigger value="portfolio">My Mentees ({myMentorships.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {innovations.map(inv => (
                <Card key={inv.id} className="flex flex-col hover:shadow-lg transition-shadow border-amber-100">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">{inv.stage}</Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-1">{inv.title}</CardTitle>
                    <CardDescription className="text-sm font-medium">by {inv.startup?.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">{inv.tagline || inv.problem}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge variant="outline" className="text-xs">{inv.category}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2 border-t bg-muted/10 p-4">
                    <Button variant="outline" className="flex-1 bg-white" render={<Link href={`/innovation/${inv.id}`} />}>View Detail</Button>
                    <Button 
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white" 
                      onClick={() => handleOfferMentorship(inv.id)}
                      disabled={requestingId === inv.id}
                    >
                      {requestingId === inv.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <GraduationCap className="w-4 h-4 mr-2" />} 
                      Offer Mentorship
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            {myMentorships.length === 0 ? (
              <div className="text-center p-16 border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground">
                You haven&apos;t initiated any mentorship conversations yet.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {myMentorships.map(invReq => (
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
                        <Button size="sm" render={<Link href="/messages" />}><Handshake className="w-4 h-4 mr-2" /> Message Mentee</Button>
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