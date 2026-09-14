import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useInnovationStore } from './innovationStore';

export interface WatchlistAlertSettings {
  milestones: boolean;
  stageChange: boolean;
  impactReport: boolean;
  funding: boolean;
  pilots: boolean;
  collabs: boolean;
}

interface UserState {
  trackedInnovations: string[]; // innovationIds
  savedInnovations: string[]; // Bookmarked for later
  alertSettings: Record<string, WatchlistAlertSettings>; // innovationId -> settings
  
  toggleTrack: (innovationId: string) => boolean; // returns true if now tracked
  toggleSave: (innovationId: string) => boolean;
  updateAlerts: (innovationId: string, settings: Partial<WatchlistAlertSettings>) => void;
}

const DEFAULT_ALERTS = {
  milestones: true,
  stageChange: true,
  impactReport: true,
  funding: true,
  pilots: true,
  collabs: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      trackedInnovations: [],
      savedInnovations: [],
      alertSettings: {},

      toggleTrack: (innovationId) => {
        const state = get();
        const isTracked = state.trackedInnovations.includes(innovationId);
        
        if (isTracked) {
          set({ 
            trackedInnovations: state.trackedInnovations.filter(id => id !== innovationId) 
          });
        } else {
          set({ 
            trackedInnovations: [...state.trackedInnovations, innovationId],
            alertSettings: { ...state.alertSettings, [innovationId]: DEFAULT_ALERTS }
          });
        }
        
        // Trigger momentum recalculation in a real app, but here we can just update the count manually
        // We will do this via the Feed ecosystem dispatcher
        return !isTracked;
      },

      toggleSave: (innovationId) => {
        const state = get();
        const isSaved = state.savedInnovations.includes(innovationId);
        if (isSaved) {
          set({ savedInnovations: state.savedInnovations.filter(id => id !== innovationId) });
        } else {
          set({ savedInnovations: [...state.savedInnovations, innovationId] });
        }
        return !isSaved;
      },
      
      updateAlerts: (innovationId, settings) => set((state) => ({
        alertSettings: {
          ...state.alertSettings,
          [innovationId]: { ...(state.alertSettings[innovationId] || DEFAULT_ALERTS), ...settings }
        }
      }))
    }),
    {
      name: 'starttohkr-user',
    }
  )
);
