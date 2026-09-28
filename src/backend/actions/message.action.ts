"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { MessageService } from "../services/message.service";
import { ApiResponse } from "@/shared/types/api.types";

export async function getConversationsAction(): Promise<ApiResponse<any[]>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const data = await MessageService.fetchConversations(session.user.id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}

export async function sendMessageAction(receiverId: string, content: string): Promise<ApiResponse<any>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const data = await MessageService.sendMessage(session.user.id, receiverId, content);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}
