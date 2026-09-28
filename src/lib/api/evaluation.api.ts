import {
  getApplicationsForEvaluationAction,
  getEvaluationsByMeAction,
  submitEvaluationAction,
  updateApplicationStatusAction,
  getGovernmentApplicationsAction
} from "@/backend/actions/evaluation.action";

export const evaluationApi = {
  async getApplicationsToEvaluate() {
    const response = await getApplicationsForEvaluationAction();
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch applications for evaluation");
    return response.data;
  },

  async getMyEvaluations() {
    const response = await getEvaluationsByMeAction();
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch your evaluations");
    return response.data;
  },

  async submit(applicationId: string, score: number, feedback: string) {
    const response = await submitEvaluationAction(applicationId, score, feedback);
    if (!response.success) throw new Error(response.error?.message || "Failed to submit evaluation");
    return response.data;
  },

  async updateApplicationStatus(id: string, status: any) {
    const response = await updateApplicationStatusAction(id, status);
    if (!response.success) throw new Error(response.error?.message || "Failed to update application status");
    return response.data;
  },

  async getGovernmentApplications() {
    const response = await getGovernmentApplicationsAction();
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch government applications");
    return response.data;
  }
};
