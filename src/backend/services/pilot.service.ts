import { PilotRepository } from "../repositories/pilot.repository";

export const PilotService = {
  async fetchPilotsForUser(userId: string) {
    const user = await PilotRepository.getUserById(userId);
    
    if (user?.role === 'GOVERNMENT') {
      return PilotRepository.getPilotsByGovernmentDept(user.name || "");
    } else {
      // STARTUP
      const startup = await PilotRepository.getStartupByOwnerId(userId);
      if (!startup) return [];
      
      return PilotRepository.getPilotsByStartupId(startup.id);
    }
  },

  async createTask(pilotId: string, title: string) {
    return PilotRepository.createPilotTask(pilotId, title);
  },

  async updateTaskStatus(taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED') {
    return PilotRepository.updatePilotTaskStatus(taskId, status);
  }
};
