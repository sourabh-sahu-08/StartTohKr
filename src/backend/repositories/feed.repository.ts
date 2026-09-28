import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type FeedFilters = {
  search?: string;
  discoveryMode?: string;
  industry?: string[];
  stage?: string[];
  tech?: string[];
  opps?: string[];
};

export const FeedRepository = {
  async getFeedPosts(whereClause: Prisma.InnovationWhereInput, orderByClause: any) {
    return prisma.innovationPost.findMany({
      where: {
        innovation: whereClause,
      },
      orderBy: orderByClause,
      take: 50,
      include: {
        author: {
          select: { id: true, name: true, image: true, role: true }
        },
        innovation: {
          include: {
            startup: {
              select: { id: true, name: true, startupProfile: true }
            },
            _count: {
              select: { signals: true, trackers: true, comments: true }
            }
          }
        },
        signals: true,
        comments: {
          include: { user: true }
        }
      }
    });
  },

  async createPost(data: { content: string; type: any; innovationId: string; authorId: string }) {
    return prisma.innovationPost.create({
      data: {
        content: { text: data.content },
        type: data.type,
        innovationId: data.innovationId,
        authorId: data.authorId
      }
    });
  },

  async findSignal(userId: string, postId: string) {
    return prisma.innovationSignal.findFirst({
      where: { userId, postId }
    });
  },

  async createSignal(userId: string, postId: string, type: any) {
    return prisma.innovationSignal.create({
      data: { userId, postId, type }
    });
  },

  async updateSignal(id: string, type: any) {
    return prisma.innovationSignal.update({
      where: { id },
      data: { type }
    });
  },

  async deleteSignal(id: string) {
    return prisma.innovationSignal.delete({ where: { id } });
  },

  async findPostById(postId: string) {
    return prisma.innovationPost.findUnique({ where: { id: postId } });
  },

  async incrementMomentum(innovationId: string, amount: number = 5) {
    return prisma.innovation.update({
      where: { id: innovationId },
      data: { momentumScore: { increment: amount } }
    });
  }
};
