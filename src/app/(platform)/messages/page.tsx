"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Send, Phone, Video, MoreVertical } from "lucide-react";

export default function MessagesPage() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    toast.success("Message sent");
    setMessage("");
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
          {[1, 2, 3].map((i) => (
            <div key={i} className={`p-4 flex gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${i === 1 ? 'bg-muted' : ''}`}>
              <Avatar>
                <AvatarFallback>U{i}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-sm truncate">Department of IT</span>
                  <span className="text-xs text-muted-foreground">10:42 AM</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {i === 1 ? "Please review the attached pilot requirements." : "Can we schedule a call?"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b flex items-center justify-between px-6 bg-background">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>DI</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Department of IT</h3>
              <p className="text-xs text-green-600 font-medium">Online</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => toast.info("Audio calls coming soon.")}>
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => toast.info("Video calls coming soon.")}>
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/5">
          <div className="flex flex-col gap-4">
            <div className="self-center bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
              Today
            </div>
            
            <div className="flex gap-3 max-w-[80%]">
              <Avatar className="h-8 w-8 mt-auto">
                <AvatarFallback>DI</AvatarFallback>
              </Avatar>
              <div className="bg-muted p-3 rounded-2xl rounded-bl-sm">
                <p className="text-sm">Hello! We reviewed your proposal for the Smart City challenge.</p>
              </div>
            </div>

            <div className="flex gap-3 max-w-[80%]">
              <Avatar className="h-8 w-8 mt-auto">
                <AvatarFallback>DI</AvatarFallback>
              </Avatar>
              <div className="bg-muted p-3 rounded-2xl rounded-bl-sm">
                <p className="text-sm">Please review the attached pilot requirements and let us know if the timeline works for you.</p>
              </div>
            </div>

            <div className="flex gap-3 max-w-[80%] self-end flex-row-reverse">
              <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-br-sm">
                <p className="text-sm">Thank you! We are reviewing it now and will get back to you shortly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-background border-t">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Input 
              placeholder="Type your message..." 
              className="flex-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}