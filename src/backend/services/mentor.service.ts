import { MentorRepository } from "../repositories/mentor.repository";

export const MentorService = {
  async fetchMentorshipCandidates() {
    return MentorRepository.getMentorshipCandidates();
  },

  async fetchMyMentorships(userId: string) {
    return MentorRepository.getMentorshipsByUserId(userId);
  }
};
