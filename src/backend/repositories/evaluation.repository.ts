import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const EvaluationRepository = {
  async getShortlistedApplications() {
    return prisma.application.findMany({
      where: { status: 'SHORTLISTED' },
      include: {
        challenge: true,
        startup: { select: { name: true } },
        innovation: { select: { title: true, problem: true, solution: true } },
        evaluations: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getEvaluationsByUserId(userId: string) {
    return prisma.evaluation.findMany({
      where: { evaluatorId: userId },
      include: {
        application: {
          include: {
            challenge: true,
            startup: { select: { name: true } }
          }
        }
      }
    });
  },

  async findExistingEvaluation(applicationId: string, evaluatorId: string) {
    return prisma.evaluation.findFirst({
      where: { applicationId, evaluatorId }
    });
  },

  async createEvaluation(data: {
    applicationId: string;
    evaluatorId: string;
    scores: number[];
    totalScore: number;
    feedback: string;
  }) {
    return prisma.evaluation.create({
      data
    });
  },

  async updateApplicationStatus(id: string, status: any) {
    return prisma.application.update({
      where: { id },
      data: { status }
    });
  },

  async getApplicationsByDepartment(departmentName: string) {
    return prisma.application.findMany({
      where: { challenge: { department: departmentName } },
      include: {
        challenge: true,
        startup: { select: { name: true } },
        innovation: true,
        evaluations: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};
