import { InnovationRepository } from "../repositories/innovation.repository";

export const InnovationService = {
  async fetchInnovationDetails(id: string) {
    const innovation = await InnovationRepository.getById(id);
    if (!innovation) {
      throw new Error("Innovation not found");
    }
    return innovation;
  },

  async fetchSimilarInnovations(category: string, excludeId: string) {
    return InnovationRepository.getSimilar(category, excludeId);
  }
};
