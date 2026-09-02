"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Lightbulb, LineChart, Rocket, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">StartTohKr</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
            <Link href="#ecosystem" className="text-muted-foreground hover:text-foreground transition-colors">Ecosystem</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Join StartTohKr</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-3xl space-y-8"
            >
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Where Ideas Meet <span className="text-primary">Opportunities.</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
                The ultimate AI-powered innovation ecosystem connecting Startups, Government Departments, Investors, Mentors, and Industry Partners.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/discover">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Explore Innovations <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Join StartTohKr
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { label: "Active Startups", value: "5,000+" },
                { label: "Govt Challenges", value: "350+" },
                { label: "Investors", value: "1,200+" },
                { label: "Successful Pilots", value: "850+" },
              ].map((stat, i) => (
                <div key={i} className="text-center space-y-2">
                  <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ecosystem Section */}
        <section id="ecosystem" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">A Complete Innovation Ecosystem</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Traditional procurement starts when a tender is published. StartTohKr starts when an innovation is born and supports it until real-world scale.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">For Startups</h3>
                <p className="text-muted-foreground">Showcase your innovations, apply for government challenges, and connect directly with investors and mentors.</p>
              </div>
              <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">For Government</h3>
                <p className="text-muted-foreground">Publish problem statements, discover AI-matched startups, evaluate proposals, and manage digital pilots seamlessly.</p>
              </div>
              <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">For Investors</h3>
                <p className="text-muted-foreground">Discover trending innovations, track startup traction, and express intent-based investment interest.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-24 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Ready to accelerate innovation?</h2>
            <p className="max-w-2xl mx-auto mb-10 text-primary-foreground/80 text-lg">
              Join thousands of founders, officials, and investors already building the future on StartTohKr.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="px-8">
                Create Your Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/20 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">StartTohKr</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 StartTohKr Innovation Ecosystem. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
