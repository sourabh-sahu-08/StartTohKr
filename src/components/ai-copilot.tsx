"use client";

import { useState } from "react";
import { Bot, X, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your StartTohKr AI Assistant. I can help you find relevant challenges, draft pilot proposals, or discover compatible investors. What are you looking for today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Based on your ecosystem profile, I found 3 highly relevant challenges in Smart Mobility and 1 active investor matching your criteria. Would you like me to draft an initial proposal for the top challenge?" 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all p-0 flex items-center justify-center"
      >
        <Sparkles className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] shadow-2xl flex flex-col z-50 border-primary/20 animate-in slide-in-from-bottom-5">
      <CardHeader className="p-4 border-b bg-muted/30 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 p-1.5 rounded-md">
            <Bot className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">StartTohKr AI</CardTitle>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Online
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 text-sm ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-8 w-8 mt-auto shrink-0">
                  <AvatarFallback className={msg.role === 'ai' ? 'bg-indigo-100 text-indigo-700' : 'bg-primary/10'}>
                    {msg.role === 'ai' ? <Bot className="h-4 w-4" /> : 'ME'}
                  </AvatarFallback>
                </Avatar>
                <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 text-sm">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-indigo-100 text-indigo-700">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-2xl bg-muted rounded-bl-sm flex items-center gap-1.5 h-10 w-16">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-3 border-t bg-background">
        <form 
          className="flex w-full gap-2 items-center"
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <Input 
            placeholder="Ask AI for insights or drafting..." 
            className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:bg-background"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" size="icon" className="h-9 w-9 rounded-full shrink-0" disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
