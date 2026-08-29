"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, Home, Search, Compass, MessageSquare, Bell, User, LogOut, Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = session?.user?.role?.toLowerCase().replace('_', '-') || 'startup';

  const navItems = [
    { name: "Dashboard", href: `/dashboard/${role}`, icon: Home },
    { name: "Discover", href: "/discover", icon: Search },
    { name: "Innovation Feed", href: "/feed", icon: Compass },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r bg-background md:block">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">StartTohKr</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <span className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  <Icon className="h-4 w-4" />
                  {item.name}
                </span>
              </Link>
            );
          })}
          <Button variant="ghost" className="mt-4 justify-start gap-3 px-3 text-muted-foreground" onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">StartTohKr</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="border-b bg-background p-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <span className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </span>
                  </Link>
                );
              })}
              <Button variant="ghost" className="mt-2 justify-start gap-3 px-3 text-muted-foreground" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
