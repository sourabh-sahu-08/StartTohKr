/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InnovationPostWithDetails, InnovationWithDetails } from '@/services/innovation/innovation.types';
import { MOCK_POSTS, MOCK_INNOVATIONS, MOCK_USERS } from '@/repositories/mock/mock-data';
import { PostType, SignalType, OpportunityStatus, OpportunityType, CommentCategory } from '@prisma/client';

export type DiscoveryMode = 'MOMENTUM' | 'EARLY_IDEAS' | 'PROTOTYPES' | 'READY_TO_PILOT' | 'SCALING' | 'MATCHED';

interface FeedState {
  posts: InnovationPostWithDetails[];
  innovations: InnovationWithDetails[];
  trackedInnovations: string[]; // innovationIds
  discoveryMode: DiscoveryMode;
  
  // Actions
  setDiscoveryMode: (mode: DiscoveryMode) => void;
  addPost: (post: Omit<InnovationPostWithDetails, 'id' | 'createdAt' | 'updatedAt' | 'signals' | 'comments'>) => void;
  toggleSignal: (userId: string, postId: string, type: SignalType) => void;
  toggleTrack: (innovationId: string) => void;
  addComment: (postId: string, userId: string, category: CommentCategory, content: string) => void;
  requestOpportunity: (innovationId: string, requesterId: string, type: OpportunityType, message: string) => void;
}

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      posts: MOCK_POSTS as any,
      innovations: MOCK_INNOVATIONS as any,
      trackedInnovations: [],
      discoveryMode: 'MOMENTUM',

      setDiscoveryMode: (mode) => set({ discoveryMode: mode }),

      addPost: (postData) => set((state) => {
        const newPost = {
          ...postData,
          id: `post-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          signals: [],
          comments: []
        };
        return { posts: [newPost as any, ...state.posts] };
      }),

      toggleSignal: (userId, postId, type) => set((state) => {
        const newPosts = state.posts.map(post => {
          if (post.id === postId) {
            const hasSignaled = post.signals.some(s => s.userId === userId && s.type === type);
            let newSignals;
            if (hasSignaled) {
              newSignals = post.signals.filter(s => !(s.userId === userId && s.type === type));
            } else {
              // Remove other signals from this user on this post if any
              const filtered = post.signals.filter(s => s.userId !== userId);
              newSignals = [...filtered, { id: `sig-${Date.now()}`, userId, postId, type } as any];
            }
            return { ...post, signals: newSignals };
          }
          return post;
        });
        return { posts: newPosts };
      }),

      toggleTrack: (innovationId) => set((state) => {
        const isTracked = state.trackedInnovations.includes(innovationId);
        if (isTracked) {
          return { trackedInnovations: state.trackedInnovations.filter(id => id !== innovationId) };
        } else {
          return { trackedInnovations: [...state.trackedInnovations, innovationId] };
        }
      }),

      addComment: (postId, userId, category, content) => set((state) => {
        const user = MOCK_USERS.find(u => u.id === userId) || { id: userId, name: "You", role: "STARTUP", image: "" };
        const newComment = {
          id: `com-${Date.now()}`,
          userId,
          user,
          postId,
          category,
          content,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const newPosts = state.posts.map(post => {
          if (post.id === postId) {
            return { ...post, comments: [...post.comments, newComment as any] };
          }
          return post;
        });
        return { posts: newPosts };
      }),

      requestOpportunity: (innovationId, requesterId, type, message) => {
        // Just mock action, no global state needed unless we build opportunity tracking view
        console.log(`Opportunity ${type} requested for ${innovationId} by ${requesterId}: ${message}`);
      }
    }),
    {
      name: 'starttohkr-feed-storage',
      // Partialize to not persist date objects properly if not hydrating correctly, but keeping it simple
    }
  )
);
