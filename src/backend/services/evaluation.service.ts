import { EvaluationRepository } from "../repositories/evaluation.repository";

export const EvaluationService = {
  async fetchApplicationsForEvaluation() {
    return EvaluationRepository.getShortlistedApplications();
  },

  async fetchMyEvaluations(userId: string) {
    return EvaluationRepository.getEvaluationsByUserId(userId);
  },

  async submitEvaluation(applicationId: string, evaluatorId: string, score: number, feedback: string) {
    const existing = await EvaluationRepository.findExistingEvaluation(applicationId, evaluatorId);
    if (existing) {
      throw new Error("You have already evaluated this application");
    }

    return EvaluationRepository.createEvaluation({
      applicationId,
      evaluatorId,
      scores: [score],
      totalScore: score,
      feedback
    });
  },

  async updateApplicationStatus(id: string, status: any) {
    return EvaluationRepository.updateApplicationStatus(id, status);
  },

  async fetchGovernmentApplications(departmentName: string) {
    return EvaluationRepository.getApplicationsByDepartment(departmentName);
  }
};
