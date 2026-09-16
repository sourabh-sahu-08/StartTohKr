import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StartTohKr — Where Ideas Meet Opportunities",
  description:
    "India's AI-powered innovation ecosystem connecting startups, government departments, investors, mentors, and industry partners. Discover, collaborate, pilot, procure, and scale.",
};

import { Toaster } from "@/components/ui/sonner";
import { AICopilot } from "@/components/ai-copilot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
          <AICopilot />
        </Providers>
      </body>
    </html>
  );
}
