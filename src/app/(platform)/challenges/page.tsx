"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter, Calendar, MapPin, Building2, Share2, Bookmark, Send, HelpCircle } from "lucide-react";

const INITIAL_CHALLENGES = [
  {
    id: 1,
    title: "AI for Crop Disease Detection",
    department: "Ministry of Agriculture",
    location: "National",
    deadline: "2026-10-15",
    budget: "$50,000 Pilot",
    tags: ["Agriculture", "AI/ML", "Computer Vision"],
    status: "Open",
    description: "We are seeking scalable AI solutions that can detect early signs of common crop diseases via drone imagery. The solution must operate effectively in low-bandwidth rural areas."
  },
  {
    id: 2,
    title: "Smart Traffic Optimization",
    department: "Municipal Corporation",
    location: "Bangalore",
    deadline: "2026-09-30",
    budget: "$75,000 Pilot",
    tags: ["Smart City", "IoT", "Mobility"],
    status: "Open",
    description: "Looking for intelligent traffic management systems to optimize signal timings in real-time based on traffic density and emergency vehicle routing."
  },
  {
    id: 3,
    title: "Secure Health Records Blockchain",
    department: "Department of Health",
    location: "State Level",
    deadline: "2026-11-01",
    budget: "$120,000",
    tags: ["Healthcare", "Blockchain", "Security"],
    status: "Open",
    description: "Develop a secure, decentralized health record management system ensuring interoperability between state hospitals while maintaining patient privacy."
  }
];

export default function ChallengesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isApplying, setIsApplying] = useState<number | null>(null);

  const filteredChallenges = INITIAL_CHALLENGES.filter(c => 
    (c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     c.department.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filter === "all" || c.tags.includes(filter))
  );

  const handleApply = (id: number) => {
    setIsApplying(id);
    setTimeout(() => {
      setIsApplying(null);
      toast.success("Application submitted successfully! You can track its status in your dashboard.");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Government Challenges</h1>
          <p className="text-muted-foreground mt-1">Discover and apply for active government procurement and pilot opportunities.</p>
        </div>
        <Button onClick={() => toast.info("Challenge Creation portal opening soon.")}>
          <Plus className="w-4 h-4 mr-2" />
          Publish Challenge
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title or department..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v || "all")}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Industry Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="Agriculture">Agriculture</SelectItem>
            <SelectItem value="Smart City">Smart City</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredChallenges.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
            No challenges found matching your filters.
          </div>
        ) : (
          filteredChallenges.map((challenge) => (
            <Card key={challenge.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">{challenge.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" /> {challenge.department}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{challenge.budget}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {challenge.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Deadline: {challenge.deadline}</div>
                  <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {challenge.location}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {challenge.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/20 p-4">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toast.success("Saved to bookmarks")}>
                    <Bookmark className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}>
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                </div>
                
                <Dialog>
                  <DialogTrigger render={<Button>Apply Now</Button>} />
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Apply for Challenge</DialogTitle>
                      <DialogDescription>
                        {challenge.title} • {challenge.department}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      <div className="space-y-2 border-t pt-4">
                        <h4 className="font-medium text-sm">Quick Actions</h4>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info("Requirements downloaded.")}>
                            Download Requirements
                          </Button>
                          <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info("Chat opened with department.")}>
                            <HelpCircle className="w-4 h-4 mr-2" /> Ask Question
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button 
                        onClick={() => handleApply(challenge.id)}
                        disabled={isApplying === challenge.id}
                      >
                        {isApplying === challenge.id ? "Submitting..." : (
                          <>
                            <Send className="w-4 h-4 mr-2" /> Submit Proposal
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}