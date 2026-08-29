import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEMO_USERS } from '@/repositories/mock/demo-data';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  bio?: string;
  location?: string;
  website?: string;
  industry?: string;
  organization?: string;
  skills?: string[];
  interests?: string[];
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
}

interface ProfileState {
  currentProfile: UserProfile | null;
  profiles: Record<string, UserProfile>;
  
  initializeSessionProfile: (sessionUser: { id: string; name?: string | null; email?: string | null; role?: string; image?: string | null }) => void;
  updateProfile: (id: string, updates: Partial<UserProfile>) => void;
  getProfile: (id: string) => UserProfile | undefined;
}

// Generate initial profiles from demo data
const initialProfiles: Record<string, UserProfile> = {};
DEMO_USERS.forEach(u => {
  initialProfiles[u.id] = {
    ...u,
    email: `${u.id}@example.com`,
    followersCount: Math.floor(Math.random() * 500) + 10,
    followingCount: Math.floor(Math.random() * 100) + 5,
    isVerified: true,
  };
});

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      currentProfile: null,
      profiles: initialProfiles,
      
      initializeSessionProfile: (sessionUser) => {
        set((state) => {
          // If the profile already exists, don't overwrite it entirely, just update the session fields
          const existing = state.profiles[sessionUser.id];
          const updatedProfile = existing ? {
            ...existing,
            // If session has newer data (like a name change in DB), we could overwrite here,
            // but for now we just let existing edits win, or merge carefully
          } : {
            id: sessionUser.id,
            name: sessionUser.name || "User",
            email: sessionUser.email || "",
            role: sessionUser.role || "STARTUP",
            image: sessionUser.image || "",
            followersCount: 0,
            followingCount: 0,
            isVerified: false,
          };
          
          return {
            profiles: {
              ...state.profiles,
              [sessionUser.id]: updatedProfile
            },
            currentProfile: updatedProfile
          };
        });
      },
      
      updateProfile: (id, updates) => {
        set((state) => {
          const existing = state.profiles[id];
          if (!existing) return state;
          
          const updatedProfile = { ...existing, ...updates };
          return {
            profiles: {
              ...state.profiles,
              [id]: updatedProfile
            },
            currentProfile: state.currentProfile?.id === id ? updatedProfile : state.currentProfile
          };
        });
      },
      
      getProfile: (id) => get().profiles[id],
    }),
    {
      name: 'starttohkr-profile-storage',
    }
  )
);
