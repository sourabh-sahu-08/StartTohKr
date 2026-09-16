import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Challenge {
  id: string;
  title: string;
  department: string;
  location: string;
  deadline: string;
  budget: string;
  tags: string[];
  status: 'DRAFT' | 'OPEN' | 'IN_REVIEW' | 'CLOSED';
  description: string;
  authorId: string;
}

export interface Application {
  id: string;
  challengeId: string;
  startupId: string;
  innovationId: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'SELECTED' | 'REJECTED';
  submittedAt: string;
  pitch: string;
}

export interface Evaluation {
  id: string;
  applicationId: string;
  evaluatorId: string;
  score: number;
  feedback: string;
  submittedAt: string;
}

interface ChallengeState {
  challenges: Record<string, Challenge>;
  applications: Record<string, Application>;
  evaluations: Record<string, Evaluation>;

  createChallenge: (challenge: Omit<Challenge, 'id'>) => Challenge;
  updateChallengeStatus: (id: string, status: Challenge['status']) => void;
  
  applyToChallenge: (application: Omit<Application, 'id' | 'status' | 'submittedAt'>) => Application;
  updateApplicationStatus: (id: string, status: Application['status']) => void;

  submitEvaluation: (evaluation: Omit<Evaluation, 'id' | 'submittedAt'>) => Evaluation;
}

const INITIAL_CHALLENGES: Record<string, Challenge> = {
  "chal-1": {
    id: "chal-1",
    title: "AI for Crop Disease Detection",
    department: "Ministry of Agriculture",
    location: "National",
    deadline: "2026-10-15",
    budget: "$50,000 Pilot",
    tags: ["Agriculture", "AI/ML", "Computer Vision"],
    status: "OPEN",
    description: "We are seeking scalable AI solutions that can detect early signs of common crop diseases via drone imagery. The solution must operate effectively in low-bandwidth rural areas.",
    authorId: "usr-gov-3"
  },
  "chal-2": {
    id: "chal-2",
    title: "Smart Traffic Optimization",
    department: "Municipal Corporation",
    location: "Bangalore",
    deadline: "2026-09-30",
    budget: "$120,000 Deployment",
    tags: ["Smart City", "IoT", "Traffic"],
    status: "OPEN",
    description: "Looking for an integrated IoT and AI solution to optimize traffic light timings based on real-time vehicle density to reduce average wait times by 20%.",
    authorId: "usr-gov-2"
  }
};

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set, get) => ({
      challenges: INITIAL_CHALLENGES,
      applications: {},
      evaluations: {},

      createChallenge: (challenge) => {
        const id = `chal-${Date.now()}`;
        const newChallenge = { ...challenge, id };
        set(state => ({ challenges: { ...state.challenges, [id]: newChallenge } }));
        return newChallenge;
      },
      
      updateChallengeStatus: (id, status) => {
        set(state => ({
          challenges: {
            ...state.challenges,
            [id]: { ...state.challenges[id], status }
          }
        }));
      },

      applyToChallenge: (app) => {
        const id = `app-${Date.now()}`;
        const newApp: Application = { ...app, id, status: 'SUBMITTED', submittedAt: new Date().toISOString() };
        set(state => ({ applications: { ...state.applications, [id]: newApp } }));
        return newApp;
      },

      updateApplicationStatus: (id, status) => {
        set(state => ({
          applications: {
            ...state.applications,
            [id]: { ...state.applications[id], status }
          }
        }));
      },

      submitEvaluation: (evalData) => {
        const id = `eval-${Date.now()}`;
        const newEval: Evaluation = { ...evalData, id, submittedAt: new Date().toISOString() };
        set(state => ({ evaluations: { ...state.evaluations, [id]: newEval } }));
        return newEval;
      }
    }),
    { name: 'starttohkr-challenge-storage' }
  )
);
