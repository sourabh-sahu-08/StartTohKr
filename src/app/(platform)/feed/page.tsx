"use client";

import { useState } from "react";
import { useFeedStore } from "@/store/feedStore";
import { CreateInnovationPost } from "@/components/feed/CreateInnovationPost";
import { DiscoveryModeSwitcher } from "@/components/feed/DiscoveryModeSwitcher";
import { InnovationCard } from "@/components/feed/InnovationCard";
import { OpportunityDetectedCard } from "@/components/feed/OpportunityDetectedCard";
import { AdvancedFilters } from "@/components/feed/AdvancedFilters";
import { useSession } from "next-auth/react";
import { InnovationPostWithDetails } from "@/services/innovation/innovation.types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function InnovationFeedPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id || "usr-gov-2"; // default to Smart City Indore
  
  const { posts, discoveryMode } = useFeedStore();
  
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    industry: [], stage: [], tech: [], opps: []
  });

  // Deterministic Discovery Algorithm
  const getSortedPosts = (mode: string, allPosts: InnovationPostWithDetails[]) => {
    let postsCopy = [...allPosts];
    
    // Apply Search
    if (search.trim()) {
      const s = search.toLowerCase();
      postsCopy = postsCopy.filter(p => 
        p.innovation?.title.toLowerCase().includes(s) ||
        p.innovation?.problem.toLowerCase().includes(s) ||
        p.innovation?.category.toLowerCase().includes(s)
      );
    }
    
    // Apply Advanced Filters
    if (activeFilters.industry.length > 0) {
      postsCopy = postsCopy.filter(p => p.innovation && activeFilters.industry.includes(p.innovation.category as never));
    }
    if (activeFilters.stage.length > 0) {
      postsCopy = postsCopy.filter(p => p.innovation && activeFilters.stage.includes(p.innovation.stage as never));
    }

    switch (mode) {
      case 'MOMENTUM':
        return postsCopy.sort((a, b) => (b.innovation?.momentumScore || 0) - (a.innovation?.momentumScore || 0));
      case 'EARLY_IDEAS':
        return postsCopy.filter(p => p.innovation?.stage === 'IDEA' || p.innovation?.stage === 'PROTOTYPE');
      case 'BUILDING':
        return postsCopy.filter(p => p.innovation?.stage === 'PROTOTYPE' || p.innovation?.stage === 'MVP');
      case 'READY_TO_PILOT':
        return postsCopy.filter(p => p.innovation?.stage === 'MVP' || p.innovation?.stage === 'PILOT');
      case 'SCALING':
        return postsCopy.filter(p => p.innovation?.stage === 'SCALING');
      case 'FRESH':
        return postsCopy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'MATCHED':
        // For demo, sort by Smart City / Climate Tech
        return postsCopy.sort((a, b) => {
          if (a.innovation?.category === 'Smart Cities' || a.innovation?.category === 'WaterTech') return -1;
          return 1;
        });
      default:
        return postsCopy;
    }
  };

  const filteredPosts = getSortedPosts(discoveryMode, posts);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-600">
          Innovation Discovery
        </h1>
        <p className="text-muted-foreground font-medium">
          Where ideas don&apos;t just get likes. They find opportunities.
        </p>
      </div>

      <CreateInnovationPost currentUserId={currentUserId} />
      
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search innovations, technologies, problems..." 
            className="pl-9 h-11 rounded-xl bg-background border-dashed focus-visible:border-solid" 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <AdvancedFilters activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
      </div>

      <DiscoveryModeSwitcher />

      <div className="space-y-8 mt-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center p-16 border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground font-medium flex flex-col items-center">
            <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg">No innovations match your discovery.</p>
            <p className="text-sm mt-1 mb-6">Try adjusting your filters or search terms.</p>
            <button 
              className="text-indigo-600 font-bold hover:underline"
              onClick={() => { setSearch(""); setActiveFilters({ industry: [], stage: [], tech: [], opps: [] }); }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <div key={post.id}>
              {index === 1 && discoveryMode === 'MATCHED' && (
                <OpportunityDetectedCard 
                  matchPercentage={94}
                  reasons={[
                    "Matches your Smart City infrastructure focus",
                    "Pilot stage aligns with your current procurement capacity",
                    "High momentum among other municipal agencies"
                  ]}
                  innovationName="CleanRoute Systems"
                />
              )}
              
              <InnovationCard post={post} currentUserId={currentUserId} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}