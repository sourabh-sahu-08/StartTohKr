import { OpportunityRepository } from "../repositories/opportunity.repository";
import { OpportunityStatus } from "@prisma/client";

export const OpportunityService = {
  async fetchOpportunities(userId: string) {
    return OpportunityRepository.getByUserId(userId);
  },

  async updateStatus(id: string, status: OpportunityStatus) {
    const opp = await OpportunityRepository.updateStatus(id, status);

    // Notify the requester about the status change
    await OpportunityRepository.createNotification({
      recipientId: opp.requesterId,
      type: "OPPORTUNITY",
      title: `Opportunity ${status}`,
      body: `Your opportunity request was ${status.toLowerCase()}`,
      relatedEntity: '/opportunities',
      read: false
    });

    return opp;
  }
};
