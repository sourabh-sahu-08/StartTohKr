import {
  getChallengesAction,
  getChallengeByIdAction,
  createChallengeAction,
  submitApplicationAction
} from "@/backend/actions/challenge.action";

export const challengeApi = {
  async getAll() {
    const response = await getChallengesAction();
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch challenges");
    return response.data;
  },

  async getById(id: string) {
    const response = await getChallengeByIdAction(id);
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch challenge");
    return response.data;
  },

  async create(data: {
    title: string;
    department: string;
    description: string;
    category: string;
    budget: string;
    deadline: Date;
  }) {
    const response = await createChallengeAction(data);
    if (!response.success) throw new Error(response.error?.message || "Failed to create challenge");
    return response.data;
  },

  async submitApplication(challengeId: string, innovationId: string, pitch: string) {
    const response = await submitApplicationAction({ challengeId, innovationId, pitch });
    if (!response.success) throw new Error(response.error?.message || "Failed to submit application");
    return response.data;
  }
};
