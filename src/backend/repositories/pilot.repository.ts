import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PilotRepository = {
  async getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async getStartupByOwnerId(ownerId: string) {
    return prisma.startup.findUnique({ where: { ownerId } });
  },

  async getPilotsByGovernmentDept(department: string) {
    return prisma.pilot.findMany({
      where: { governmentDept: department },
      include: {
        startup: { select: { name: true, ownerId: true } },
        innovation: { select: { title: true } },
        tasks: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getPilotsByStartupId(startupId: string) {
    return prisma.pilot.findMany({
      where: { startupId },
      include: {
        startup: { select: { name: true, ownerId: true } },
        innovation: { select: { title: true } },
        tasks: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async createPilotTask(pilotId: string, title: string) {
    return prisma.pilotTask.create({
      data: {
        pilotId,
        title
      }
    });
  },

  async updatePilotTaskStatus(taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED') {
    return prisma.pilotTask.update({
      where: { id: taskId },
      data: { status }
    });
  }
};
