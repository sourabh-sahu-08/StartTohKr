"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, CheckCircle2, Loader2 } from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore";
import Link from "next/link";

export default function NotificationsPage() {
  const { notifications, isLoading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    toast.success("All notifications marked as read");
  };

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your ecosystem activity.</p>
        </div>
        <Button variant="outline" onClick={handleMarkAllRead} className="gap-2">
          <CheckCircle2 className="w-4 h-4" /> Mark all read
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 flex justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-xl text-muted-foreground">
            No notifications yet.
          </div>
        ) : (
          notifications.map((n) => (
            <Card key={n.id} className={`transition-colors ${n.read ? 'bg-muted/30 opacity-70' : 'bg-background shadow-sm border-indigo-100'}`}>
              <CardContent className="p-4 flex gap-4 items-start">
                <Avatar className="mt-1">
                  <AvatarFallback className="bg-primary/10 text-primary">{n.title.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <Link href={n.link} className="font-semibold text-foreground hover:underline text-base block" onClick={() => handleMarkRead(n.id)}>
                    {n.title}
                  </Link>
                  <p className="text-muted-foreground text-sm leading-snug">
                    <span className="font-medium text-foreground mr-1">{n.message}</span>
                  </p>
                  <p className="text-xs text-muted-foreground pt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && (
                  <Button variant="ghost" size="icon" onClick={() => handleMarkRead(n.id)} className="shrink-0 text-muted-foreground hover:text-indigo-600">
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}