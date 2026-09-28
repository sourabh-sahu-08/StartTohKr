import { ChallengeRepository } from "../repositories/challenge.repository";

export const ChallengeService = {
  async fetchAll() {
    return ChallengeRepository.getAll();
  },

  async fetchById(id: string) {
    const challenge = await ChallengeRepository.getById(id);
    if (!challenge) throw new Error("Challenge not found");
    return challenge;
  },

  async createChallenge(data: {
    title: string;
    department: string;
    description: string;
    category: string;
    budget: string;
    deadline: Date;
  }) {
    return ChallengeRepository.create({
      ...data,
      status: 'OPEN'
    });
  },

  async submitApplication(userId: string, challengeId: string, innovationId: string, pitch: string) {
    const startup = await ChallengeRepository.findStartupByOwnerId(userId);
    if (!startup) throw new Error("No startup profile found for this user");

    return ChallengeRepository.createApplication({
      challengeId,
      innovationId,
      startupId: startup.id,
      pitch,
      status: 'SUBMITTED'
    });
  }
};
