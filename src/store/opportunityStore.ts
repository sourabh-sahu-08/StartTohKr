/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEMO_OPPORTUNITIES, DEMO_USERS } from '@/repositories/mock/demo-data';
import { OpportunityType, OpportunityStatus } from '@prisma/client';

export type OpportunityWithDetails = typeof DEMO_OPPORTUNITIES[0];

interface OpportunityState {
  opportunities: OpportunityWithDetails[];
  
  sendOpportunity: (requesterId: string, innovationId: string, type: OpportunityType, message: string) => void;
  updateStatus: (id: string, status: OpportunityStatus) => void;
  getOpportunitiesForUser: (userId: string, role: string) => OpportunityWithDetails[];
}

export const useOpportunityStore = create<OpportunityState>()(
  persist(
    (set, get) => ({
      opportunities: DEMO_OPPORTUNITIES as any,
      
      sendOpportunity: (requesterId, innovationId, type, message) => set((state) => {
        const requester = DEMO_USERS.find(u => u.id === requesterId) || DEMO_USERS[8];
        // Note: in a real app, innovation is fetched properly, mocked here
        const newOpp = {
          id: `opp-${Date.now()}`,
          requesterId,
          requester,
          innovationId,
          innovation: {} as any, // Mock relation, UI looks it up anyway
          type,
          message,
          status: "PENDING" as OpportunityStatus,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return { opportunities: [newOpp as any, ...state.opportunities] as any };
      }),
      
      updateStatus: (id, status) => set((state) => ({
        opportunities: state.opportunities.map(opp => 
          opp.id === id ? { ...opp, status, updatedAt: new Date() } : opp
        ) as any
      })),
      
      getOpportunitiesForUser: (userId, role) => {
        // If startup, show received opportunities
        // If investor/gov, show sent opportunities
        return get().opportunities; // Simplify for demo: return all, let UI filter
      }
    }),
    {
      name: 'starttohkr-opportunities',
    }
  )
);
