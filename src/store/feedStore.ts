/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InnovationPostWithDetails } from '@/services/innovation/innovation.types';
import { DEMO_POSTS, DEMO_USERS } from '@/repositories/mock/demo-data';
import { PostType, SignalType, CommentCategory } from '@prisma/client';
import { useInnovationStore } from './innovationStore';

export type DiscoveryMode = 'MOMENTUM' | 'EARLY_IDEAS' | 'BUILDING' | 'READY_TO_PILOT' | 'SCALING' | 'MATCHED' | 'FRESH';

interface FeedState {
  posts: InnovationPostWithDetails[];
  discoveryMode: DiscoveryMode;
  
  setDiscoveryMode: (mode: DiscoveryMode) => void;
  addPost: (post: Omit<InnovationPostWithDetails, 'id' | 'createdAt' | 'updatedAt' | 'signals' | 'comments'>) => void;
  toggleSignal: (userId: string, postId: string | null, innovationId: string | null, type: SignalType) => void;
  addComment: (postId: string | null, innovationId: string | null, userId: string, category: CommentCategory, content: string) => void;
}

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      posts: DEMO_POSTS as any,
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

      toggleSignal: (userId, postId, innovationId, type) => set((state) => {
        // Handle post signals
        if (postId) {
          const newPosts = state.posts.map(post => {
            if (post.id === postId) {
              const hasSignaled = post.signals.some(s => s.userId === userId && s.type === type);
              let newSignals;
              if (hasSignaled) {
                newSignals = post.signals.filter(s => !(s.userId === userId && s.type === type));
              } else {
                const filtered = post.signals.filter(s => s.userId !== userId);
                newSignals = [...filtered, { id: `sig-${Date.now()}`, userId, postId, innovationId: null, type, createdAt: new Date() } as any];
              }
              return { ...post, signals: newSignals };
            }
            return post;
          });
          
          // Trigger momentum recalculation if it's tied to an innovation
          const post = state.posts.find(p => p.id === postId);
          if (post && post.innovationId) {
             const sigCount = newPosts.find(p => p.id === postId)?.signals.length || 0;
             useInnovationStore.getState().recalculateMomentum(post.innovationId, sigCount, 10, 2);
          }
          
          return { posts: newPosts };
        }
        return state;
      }),

      addComment: (postId, innovationId, userId, category, content) => set((state) => {
        const user = DEMO_USERS.find(u => u.id === userId) || { id: userId, name: "You", role: "STARTUP", image: "" };
        const newComment = {
          id: `com-${Date.now()}`,
          userId,
          user,
          postId,
          innovationId,
          category,
          content,
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        if (postId) {
          const newPosts = state.posts.map(post => {
            if (post.id === postId) {
              return { ...post, comments: [...post.comments, newComment as any] };
            }
            return post;
          });
          return { posts: newPosts };
        }
        
        return state;
      }),
    }),
    {
      name: 'starttohkr-feed',
    }
  )
);
