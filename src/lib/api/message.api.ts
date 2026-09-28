import {
  getConversationsAction,
  sendMessageAction
} from "@/backend/actions/message.action";

export const messageApi = {
  async getConversations() {
    const response = await getConversationsAction();
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch conversations");
    return response.data;
  },

  async sendMessage(receiverId: string, content: string) {
    const response = await sendMessageAction(receiverId, content);
    if (!response.success) throw new Error(response.error?.message || "Failed to send message");
    return response.data;
  }
};
