import { InteractionRepository } from "../repositories/interaction.repository";

export const InteractionService = {
  async toggleTrack(userId: string, innovationId: string) {
    const existing = await InteractionRepository.findTracker(userId, innovationId);

    if (existing) {
      await InteractionRepository.deleteTracker(existing.id);
      return { action: 'untracked' };
    } else {
      await InteractionRepository.createTracker(userId, innovationId);
      return { action: 'tracked' };
    }
  },

  async toggleSave(userId: string, entityType: string, entityId: string) {
    const existing = await InteractionRepository.findSavedItem(userId, entityType, entityId);

    if (existing) {
      await InteractionRepository.deleteSavedItem(existing.id);
      return { action: 'unsaved' };
    } else {
      await InteractionRepository.createSavedItem(userId, entityType, entityId);
      return { action: 'saved' };
    }
  },

  async sendOpportunity(requesterId: string, innovationId: string, type: string, message: string) {
    return InteractionRepository.createOpportunity({
      requesterId,
      innovationId,
      type: type as any,
      message
    });
  }
};
