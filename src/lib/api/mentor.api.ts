import {
  getMentorshipCandidatesAction,
  getMyMentorshipsAction
} from "@/backend/actions/mentor.action";

export const mentorApi = {
  async getMentorshipCandidates() {
    const response = await getMentorshipCandidatesAction();
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch mentorship candidates");
    return response.data;
  },

  async getMyMentorships() {
    const response = await getMyMentorshipsAction();
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch your mentorships");
    return response.data;
  }
};
