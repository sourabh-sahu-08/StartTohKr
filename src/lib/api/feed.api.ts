import { getFeedPostsAction, createInnovationPostAction, toggleSignalAction } from "@/backend/actions/feed.action";

export const feedApi = {
  async getPosts(filters: any = {}) {
    const response = await getFeedPostsAction(filters);
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch feed");
    return response.data;
  },

  async createPost(data: { content: string; innovationId: string; type: string }) {
    const response = await createInnovationPostAction(data);
    if (!response.success) throw new Error(response.error?.message || "Failed to create post");
    return response.data;
  },

  async toggleSignal(postId: string, type: string) {
    const response = await toggleSignalAction(postId, type);
    if (!response.success) throw new Error(response.error?.message || "Failed to toggle signal");
    return response.data;
  }
};
