"use client";

import { useEffect } from "react";
import { useFeedStore } from "@/store/feedStore";
import { CreateInnovationPost } from "@/components/feed/CreateInnovationPost";
import { DiscoveryModeSwitcher } from "@/components/feed/DiscoveryModeSwitcher";
import { InnovationCard } from "@/components/feed/InnovationCard";
import { OpportunityDetectedCard } from "@/components/feed/OpportunityDetectedCard";
import { AdvancedFilters } from "@/components/feed/AdvancedFilters";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

export default function InnovationFeedPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id || "";
  
  const { posts, discoveryMode, search, setSearch, filters, setFilters, isLoading, fetchPosts } = useFeedStore();
  
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-600">
          Innovation Discovery
        </h1>
        <p className="text-muted-foreground font-medium">
          Where ideas don't just get likes. They find opportunities.
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
        <AdvancedFilters activeFilters={filters} setActiveFilters={setFilters} />
      </div>

      <DiscoveryModeSwitcher />

      <div className="space-y-8 mt-6">
        {isLoading ? (
          <div className="text-center p-16 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Discovering innovations...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center p-16 border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground font-medium flex flex-col items-center">
            <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg">No innovations match your discovery.</p>
            <p className="text-sm mt-1 mb-6">Try adjusting your filters or search terms.</p>
            <button 
              className="text-indigo-600 font-bold hover:underline"
              onClick={() => { setSearch(""); setFilters({ industry: [], stage: [], tech: [], opps: [] }); }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          posts.map((post: any, index: number) => (
            <div key={post.id}>
              {index === 1 && discoveryMode === 'MATCHED' && (
                <OpportunityDetectedCard 
                  matchPercentage={94}
                  reasons={[
                    "Matches your infrastructure focus",
                    "Pilot stage aligns with your current procurement capacity",
                    "High momentum among other agencies"
                  ]}
                  innovationName={post.innovation?.title || "Solution"}
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