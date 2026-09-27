import { ScalingRepository } from "../repositories/scaling.repository";

export const ScalingService = {
  async fetchScalingHubInnovations() {
    return ScalingRepository.getScalingInnovations();
  }
};
