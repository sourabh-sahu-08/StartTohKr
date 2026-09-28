import { InvestorRepository } from "../repositories/investor.repository";

export const InvestorService = {
  async fetchPromisingInnovations() {
    return InvestorRepository.getPromisingInnovations();
  },

  async fetchMyInvestments(userId: string) {
    return InvestorRepository.getInvestmentsByUserId(userId);
  }
};
