/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InnovationWithDetails } from '@/services/innovation/innovation.types';
import { DEMO_INNOVATIONS } from '@/repositories/mock/demo-data';

interface InnovationState {
  innovations: InnovationWithDetails[];
  
  getInnovation: (id: string) => InnovationWithDetails | undefined;
  recalculateMomentum: (id: string, signalCount: number, trackerCount: number, opportunityCount: number) => void;
  updateStage: (id: string, stage: any) => void;
}

export const useInnovationStore = create<InnovationState>()(
  persist(
    (set, get) => ({
      innovations: DEMO_INNOVATIONS as any,
      
      getInnovation: (id) => {
        return get().innovations.find(i => i.id === id);
      },
      
      recalculateMomentum: (id, signalCount, trackerCount, opportunityCount) => set((state) => {
        // Momentum Score = Signals*0.3 + Trackers*0.2 + Opportunities*0.25 + ...
        // Simplification for mock deterministic engine
        const rawScore = (signalCount * 5) + (trackerCount * 8) + (opportunityCount * 15);
        // normalize to 100 roughly
        const normalized = Math.min(100, rawScore + (Math.random() * 5)); // add slight noise for realism if tied
        
        const newInns = state.innovations.map(inv => 
          inv.id === id ? { ...inv, momentumScore: parseFloat(normalized.toFixed(1)) } : inv
        );
        return { innovations: newInns };
      }),
      
      updateStage: (id, stage) => set((state) => ({
        innovations: state.innovations.map(inv => inv.id === id ? { ...inv, stage } : inv)
      }))
    }),
    {
      name: 'starttohkr-innovations',
    }
  )
);
