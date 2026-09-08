"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, CheckCircle2 } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'pilot', message: 'Ministry of IT accepted your proposal for Smart City.', time: '2 mins ago', read: false },
    { id: 2, type: 'connection', message: 'Global Ventures wants to connect with you.', time: '1 hour ago', read: false },
    { id: 3, type: 'mention', message: 'Dr. Sharma mentioned you in a comment.', time: '3 hours ago', read: true },
    { id: 4, type: 'like', message: 'EcoTech Innovations liked your post.', time: '1 day ago', read: true },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const markRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated on your ecosystem activity.</p>
        </div>
        <Button variant="outline" onClick={markAllRead}>
          <CheckCircle2 className="h-4 w-4 mr-2" /> Mark all read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <Card key={notif.id} className={`transition-colors ${notif.read ? 'opacity-70 bg-muted/30' : 'bg-background shadow-sm border-primary/20'}`}>
            <CardContent className="p-4 flex gap-4 items-center">
              <Avatar>
                <AvatarFallback className={notif.read ? '' : 'bg-primary/20 text-primary font-bold'}>
                  {notif.type.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className={`text-sm ${notif.read ? 'text-muted-foreground' : 'font-medium'}`}>{notif.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
              </div>
              {!notif.read && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => markRead(notif.id)}>
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}