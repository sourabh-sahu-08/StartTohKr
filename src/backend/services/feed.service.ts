import { FeedRepository, FeedFilters } from "../repositories/feed.repository";
import { Prisma } from "@prisma/client";

export const FeedService = {
  async fetchFeed(filters: FeedFilters) {
    const { search, discoveryMode = 'MOMENTUM' } = filters;

    let innovationWhere: Prisma.InnovationWhereInput = {};
    
    if (search?.trim()) {
      const s = search.toLowerCase();
      innovationWhere.OR = [
        { title: { contains: s, mode: 'insensitive' } },
        { problem: { contains: s, mode: 'insensitive' } },
        { category: { contains: s, mode: 'insensitive' } },
      ];
    }

    if (filters.industry?.length) {
      innovationWhere.category = { in: filters.industry };
    }

    if (filters.stage?.length) {
      innovationWhere.stage = { in: filters.stage as any[] };
    }

    switch (discoveryMode) {
      case 'EARLY_IDEAS':
        innovationWhere.stage = { in: ['IDEA', 'PROTOTYPE'] };
        break;
      case 'BUILDING':
        innovationWhere.stage = { in: ['PROTOTYPE', 'MVP'] };
        break;
      case 'READY_TO_PILOT':
        innovationWhere.stage = { in: ['MVP', 'PILOT'] };
        break;
      case 'SCALING':
        innovationWhere.stage = 'SCALING';
        break;
    }

    let orderBy: any = { createdAt: 'desc' };

    if (discoveryMode === 'MOMENTUM') {
      orderBy = { innovation: { momentumScore: 'desc' } };
    } else if (discoveryMode === 'MATCHED') {
      orderBy = [
        { innovation: { category: 'desc' } },
        { createdAt: 'desc' }
      ];
    }

    return FeedRepository.getFeedPosts(innovationWhere, orderBy);
  },

  async publishPost(data: { content: string; innovationId: string; type: string }, userId: string) {
    return FeedRepository.createPost({ ...data, authorId: userId });
  },

  async toggleSignal(postId: string, type: string, userId: string) {
    const existing = await FeedRepository.findSignal(userId, postId);

    if (existing) {
      if (existing.type === type) {
        await FeedRepository.deleteSignal(existing.id);
        return { action: 'removed' };
      } else {
        await FeedRepository.updateSignal(existing.id, type);
        return { action: 'updated' };
      }
    } else {
      await FeedRepository.createSignal(userId, postId, type);
      const post = await FeedRepository.findPostById(postId);
      if (post?.innovationId) {
        await FeedRepository.incrementMomentum(post.innovationId, 5);
      }
      return { action: 'added' };
    }
  }
};
