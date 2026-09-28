import { MessageRepository } from "../repositories/message.repository";

export const MessageService = {
  async fetchConversations(userId: string) {
    const messages = await MessageRepository.getMessagesByUserId(userId);
    const conversationsMap = new Map();

    for (const m of messages) {
      const partnerId = m.senderId === userId ? m.receiverId : m.senderId;
      const partner = m.senderId === userId ? m.receiver : m.sender;
      
      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partner,
          lastMessage: m.content,
          updatedAt: m.createdAt,
          messages: []
        });
      }
      conversationsMap.get(partnerId).messages.unshift(m); // older first
    }

    return Array.from(conversationsMap.values());
  },

  async sendMessage(senderId: string, receiverId: string, content: string) {
    let conversation = await MessageRepository.findConversation(senderId, receiverId);

    if (!conversation) {
      conversation = await MessageRepository.createConversation(senderId, receiverId);
    }

    const msg = await MessageRepository.createMessage(senderId, receiverId, content, conversation.id);

    // Also create a notification for the receiver
    await MessageRepository.createNotification({
      recipientId: receiverId,
      type: "MESSAGE",
      title: `New message from ${msg.sender.name}`,
      body: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      relatedEntity: '/messages',
      read: false
    });

    return msg;
  }
};
