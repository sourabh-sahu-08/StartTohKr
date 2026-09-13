"use client";

import { useFeedStore } from "@/store/feedStore";
import { CreateInnovationPost } from "@/components/feed/CreateInnovationPost";
import { DiscoveryModeSwitcher } from "@/components/feed/DiscoveryModeSwitcher";
import { InnovationCard } from "@/components/feed/InnovationCard";
import { OpportunityDetectedCard } from "@/components/feed/OpportunityDetectedCard";
import { useSession } from "next-auth/react";
import { InnovationPostWithDetails } from "@/services/innovation/innovation.types";

export default function InnovationFeedPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id || "usr-2"; // default to gov user for demo
  
  const { posts, discoveryMode } = useFeedStore();

  // Deterministic Discovery Algorithm
  const getSortedPosts = (mode: string, allPosts: InnovationPostWithDetails[]) => {
    const postsCopy = [...allPosts];
    
    switch (mode) {
      case 'MOMENTUM':
        return postsCopy.sort((a, b) => (b.innovation?.momentumScore || 0) - (a.innovation?.momentumScore || 0));
      case 'EARLY_IDEAS':
        return postsCopy.filter(p => p.innovation?.stage === 'IDEA');
      case 'PROTOTYPES':
        return postsCopy.filter(p => p.innovation?.stage === 'PROTOTYPE');
      case 'READY_TO_PILOT':
        return postsCopy.filter(p => p.innovation?.stage === 'MVP' || p.innovation?.stage === 'PILOT');
      case 'SCALING':
        return postsCopy.filter(p => p.innovation?.stage === 'SCALING');
      case 'MATCHED':
        // For demo, just simulate matching by pushing WaterTech / AgriTech high depending on mock rules
        return postsCopy.sort((a, b) => {
          if (a.innovation?.category === 'WaterTech') return -1;
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
      
      <DiscoveryModeSwitcher />

      <div className="space-y-8 mt-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center p-16 border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground font-medium">
            No innovations found for this discovery mode.
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <div key={post.id}>
              {/* Insert AI Opportunity Match card after the first post if Matched mode */}
              {index === 1 && discoveryMode === 'MATCHED' && (
                <OpportunityDetectedCard 
                  matchPercentage={92}
                  reasons={[
                    "Matches your Smart City infrastructure focus",
                    "Pilot stage aligns with your current procurement capacity"
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