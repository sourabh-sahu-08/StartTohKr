import { create } from 'zustand';
import { feedApi } from '@/lib/api/feed.api';

export type DiscoveryMode = 'MOMENTUM' | 'EARLY_IDEAS' | 'BUILDING' | 'READY_TO_PILOT' | 'SCALING' | 'MATCHED' | 'FRESH';

interface FeedState {
  posts: any[];
  discoveryMode: DiscoveryMode;
  search: string;
  filters: {
    industry: string[];
    stage: string[];
    tech: string[];
    opps: string[];
  };
  isLoading: boolean;
  
  setDiscoveryMode: (mode: DiscoveryMode) => void;
  setSearch: (search: string) => void;
  setFilters: (filters: any) => void;
  
  fetchPosts: () => Promise<void>;
  
  addPost: (post: any) => Promise<void>;
  toggleSignal: (postId: string, type: string) => Promise<void>;
}

export const useFeedStore = create<FeedState>()(
  (set, get) => ({
    posts: [],
    discoveryMode: 'MOMENTUM',
    search: '',
    filters: { industry: [], stage: [], tech: [], opps: [] },
    isLoading: false,

    setDiscoveryMode: (mode) => {
      set({ discoveryMode: mode });
      get().fetchPosts();
    },
    
    setSearch: (search) => {
      set({ search });
      get().fetchPosts();
    },

    setFilters: (filters) => {
      set({ filters });
      get().fetchPosts();
    },

    fetchPosts: async () => {
      set({ isLoading: true });
      try {
        const { discoveryMode, search, filters } = get();
        const data = await feedApi.getPosts({ discoveryMode, search, filters });
        set({ posts: data });
      } catch (err) {
        console.error(err);
      } finally {
        set({ isLoading: false });
      }
    },

    addPost: async (postData: any) => {
      try {
        await feedApi.createPost({ 
          content: typeof postData.content === 'string' ? postData.content : JSON.stringify(postData.content), 
          type: postData.type, 
          innovationId: postData.innovationId || "" 
        });
        await get().fetchPosts();
      } catch (err) {
        console.error(err);
      }
    },

    toggleSignal: async (postId, type) => {
      try {
        await feedApi.toggleSignal(postId, type);
        await get().fetchPosts();
      } catch (err) {
        console.error(err);
      }
    }
  })
);
