import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ChallengeRepository = {
  async getAll() {
    return prisma.challenge.findMany({
      include: {
        applications: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getById(id: string) {
    return prisma.challenge.findUnique({
      where: { id },
      include: {
        applications: {
          include: { startup: true, innovation: true }
        }
      }
    });
  },

  async create(data: {
    title: string;
    department: string;
    description: string;
    category: string;
    budget: string;
    deadline: Date;
    status: any;
  }) {
    return prisma.challenge.create({
      data
    });
  },

  async findStartupByOwnerId(ownerId: string) {
    return prisma.startup.findUnique({ where: { ownerId } });
  },

  async createApplication(data: {
    challengeId: string;
    innovationId: string;
    startupId: string;
    pitch: string;
    status: any;
  }) {
    return prisma.application.create({
      data
    });
  }
};
