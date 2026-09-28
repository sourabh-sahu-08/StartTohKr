"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Send, Phone, Video, MoreVertical, Loader2 } from "lucide-react";
import { messageApi } from "@/lib/api/message.api";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await messageApi.getConversations();
      setConversations(data ?? []);
      if (data && data.length > 0 && !activePartnerId) {
        setActivePartnerId(data[0].partner.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // In a real app we'd use WebSockets. For now we poll every 10s.
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeConversation = conversations.find(c => c.partner.id === activePartnerId);

  const handleSend = async () => {
    if (!message.trim() || !activePartnerId) return;
    try {
      await messageApi.sendMessage(activePartnerId, message);
      setMessage("");
      await loadData();
    } catch (e) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] border rounded-xl overflow-hidden bg-background shadow-sm">
      {/* Sidebar - Chat List */}
      <div className="w-80 border-r flex flex-col bg-muted/10">
        <div className="p-4 border-b bg-background">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-9 bg-muted/50" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No messages yet.</div>
          ) : (
            conversations.map((conv) => (
              <div 
                key={conv.partner.id}
                onClick={() => setActivePartnerId(conv.partner.id)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b last:border-0 ${activePartnerId === conv.partner.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
              >
                <Avatar>
                  <AvatarFallback className="bg-indigo-100 text-indigo-700">{conv.partner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-semibold truncate text-sm">{conv.partner.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{new Date(conv.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
        {activeConversation ? (
          <>
            <div className="h-16 border-b flex items-center justify-between px-6 bg-background">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-indigo-100 text-indigo-700">{activeConversation.partner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{activeConversation.partner.name}</h3>
                  <p className="text-xs text-green-600 font-medium">Active now</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon"><Phone className="w-4 h-4 text-muted-foreground" /></Button>
                <Button variant="ghost" size="icon"><Video className="w-4 h-4 text-muted-foreground" /></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4 text-muted-foreground" /></Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {activeConversation.messages.map((msg: any) => {
                const isMe = msg.senderId !== activeConversation.partner.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-white border shadow-sm text-foreground rounded-tl-sm'}`}>
                      {msg.content}
                      <div className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-background border-t">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
                <Input 
                  placeholder="Type your message..." 
                  className="flex-1 rounded-full bg-muted/30 border-muted"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <Button type="submit" size="icon" className="rounded-full shrink-0 h-10 w-10">
                  <Send className="w-4 h-4 ml-0.5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Send className="w-6 h-6 opacity-50" />
            </div>
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}