import { create } from 'zustand';
import { challengeApi } from '@/lib/api/challenge.api';

export interface Challenge {
  id: string;
  title: string;
  department: string;
  location?: string;
  deadline: Date;
  budget: string;
  category: string;
  status: string;
  description: string;
  authorId: string;
  applications?: any[];
}

interface ChallengeState {
  challenges: Challenge[];
  applications: any[];
  evaluations: any[];
  isLoading: boolean;
  
  fetchChallenges: () => Promise<void>;
  getChallenge: (id: string) => Challenge | undefined;
  createChallenge: (challenge: any) => Promise<void>;
  updateChallengeStatus: (id: string, status: any) => void;
  updateApplicationStatus: (id: string, status: any) => void;
  updateEvaluationStatus: (id: string, status: any) => void;
  
  submitApplication: (app: any) => Promise<void>;
  submitEvaluation: (evalData: any) => void;
}

export const useChallengeStore = create<ChallengeState>()(
  (set, get) => ({
    challenges: [],
    applications: [],
    evaluations: [],
    isLoading: false,
    
    fetchChallenges: async () => {
      set({ isLoading: true });
      try {
        const data = await challengeApi.getAll();
        set({ challenges: data as any[] });
      } catch (err) {
        console.error(err);
      } finally {
        set({ isLoading: false });
      }
    },

    getChallenge: (id) => get().challenges.find(c => c.id === id),
    
    createChallenge: async (challengeData) => {
      try {
        await challengeApi.create({
          title: challengeData.title,
          department: challengeData.department,
          description: challengeData.description,
          category: challengeData.category,
          budget: challengeData.budget,
          deadline: new Date(challengeData.deadline)
        });
        await get().fetchChallenges();
      } catch (err) {
        console.error(err);
      }
    },
    
    updateChallengeStatus: (id, status) => set((state) => ({
      challenges: state.challenges.map(c => c.id === id ? { ...c, status } : c)
    })),
    updateApplicationStatus: (id, status) => set((state) => ({ applications: state.applications.map(a => a.id === id ? { ...a, status } : a) })),
    updateEvaluationStatus: (id, status) => set((state) => ({ evaluations: state.evaluations.map(e => e.id === id ? { ...e, status } : e) })),
    
    submitApplication: async (app) => {
      try {
        await challengeApi.submitApplication(app.challengeId, app.innovationId, app.pitch);
        await get().fetchChallenges();
      } catch (err) {
        console.error(err);
      }
    },
    
    submitEvaluation: (evalData) => set((state) => ({
      evaluations: [...state.evaluations, evalData]
    }))
  })
);
