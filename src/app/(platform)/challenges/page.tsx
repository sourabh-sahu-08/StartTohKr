"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Calendar, MapPin, Building2, Send, Loader2 } from "lucide-react";
import { useChallengeStore } from "@/store/challengeStore";
import { Textarea } from "@/components/ui/textarea";

export default function ChallengesPage() {
  const { challenges, isLoading, fetchChallenges, submitApplication } = useChallengeStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isApplyingId, setIsApplyingId] = useState<string | null>(null);
  const [pitch, setPitch] = useState("");

  useEffect(() => {
    fetchChallenges();
  }, []);

  const filteredChallenges = challenges.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApply = async (id: string) => {
    if (!pitch.trim()) {
      toast.error("Please enter a pitch");
      return;
    }
    
    // For demo, we assume the user has an innovation to select. 
    // In a full UI they would pick their innovation from a dropdown.
    await submitApplication({
      challengeId: id,
      innovationId: "demo-innovation-id", // mock default if needed, or null if they don't have one
      pitch
    });
    
    setIsApplyingId(null);
    setPitch("");
    toast.success("Application submitted successfully!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Government Challenges
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Solve critical public problems and secure pilot procurement.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-background/50 p-4 rounded-xl border border-muted">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by title, department, or keyword..." 
            className="pl-10 h-12 text-md rounded-lg bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="col-span-full text-center p-12 border border-dashed rounded-xl text-muted-foreground">
            No challenges found matching your criteria.
          </div>
        ) : filteredChallenges.map((challenge) => (
          <Card key={challenge.id} className="flex flex-col hover:shadow-md transition-shadow bg-background/60">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <Badge className={challenge.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100' : 'bg-muted text-muted-foreground'}>
                  {challenge.status}
                </Badge>
                <span className="text-lg font-bold text-indigo-600">{challenge.budget}</span>
              </div>
              <CardTitle className="line-clamp-2 text-xl">{challenge.title}</CardTitle>
              <CardDescription className="flex items-center gap-1.5 mt-2 font-medium text-foreground/80">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                {challenge.department}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {challenge.description}
              </p>
              
              <div className="space-y-2 pt-2 text-sm font-medium">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {challenge.location || "India"}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline" className="bg-background">{challenge.category}</Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-muted/50">
              <Dialog open={isApplyingId === challenge.id} onOpenChange={(open) => !open && setIsApplyingId(null)}>
                <DialogTrigger render={<Button className="w-full font-semibold" variant={challenge.status === 'OPEN' ? 'default' : 'secondary'} disabled={challenge.status !== 'OPEN'} onClick={() => setIsApplyingId(challenge.id)} />}>
                    {challenge.status === 'OPEN' ? 'Apply Now' : 'Closed'}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apply for Challenge</DialogTitle>
                    <DialogDescription>
                      Submit your innovation for {challenge.title}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pitch / Alignment</label>
                      <Textarea 
                        placeholder="Explain how your innovation solves this specific challenge..."
                        value={pitch}
                        onChange={(e) => setPitch(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsApplyingId(null)}>Cancel</Button>
                    <Button onClick={() => handleApply(challenge.id)} className="bg-indigo-600">
                      <Send className="w-4 h-4 mr-2" /> Submit Application
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}