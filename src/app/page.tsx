"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Lightbulb, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[oklch(0.04_0_0)]">
      {/* ───── Fixed Background Video ───── */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay to ensure readability */}
        <div className="absolute inset-0 bg-[oklch(0.03_0_0/0.55)]" />
        {/* Subtle gradient vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.03_0_0/0.7)_100%)]" />
      </div>

      {/* ───── Navbar ───── */}
      <Navbar />

      {/* ───── Main Content (above video) ───── */}
      <main className="relative z-10 flex-1">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden pt-36 pb-28 lg:pt-44 lg:pb-36">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl space-y-8"
            >
              <h1 className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-[0_2px_24px_oklch(0_0_0/0.5)]">
                Where Ideas Meet{" "}
                <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">
                  Opportunities.
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-[oklch(0.72_0_0)] sm:text-xl leading-relaxed">
                The ultimate AI-powered innovation ecosystem connecting
                Startups, Government Departments, Investors, Mentors, and
                Industry Partners.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                <Link href="/discover">
                  <Button
                    size="lg"
                    className="
                      w-full sm:w-auto gap-2
                      bg-white/95 text-[oklch(0.08_0_0)]
                      hover:bg-white
                      border-0 shadow-[0_2px_20px_oklch(1_0_0/0.15)]
                      backdrop-blur-sm
                    "
                  >
                    Explore Innovations <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="
                      w-full sm:w-auto
                      border-white/15 text-white/80
                      hover:text-white hover:bg-white/10
                      hover:border-white/25
                      bg-white/5 backdrop-blur-sm
                    "
                  >
                    Join StartTohKr
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Stats Section — Glass Card ── */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="
                rounded-2xl
                border border-white/[0.08]
                bg-white/[0.04] backdrop-blur-xl
                shadow-[0_8px_40px_oklch(0_0_0/0.3),inset_0_1px_0_oklch(1_0_0/0.06)]
                p-10
              "
            >
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {[
                  { label: "Active Startups", value: "5,000+" },
                  { label: "Govt Challenges", value: "350+" },
                  { label: "Investors", value: "1,200+" },
                  { label: "Successful Pilots", value: "850+" },
                ].map((stat, i) => (
                  <div key={i} className="text-center space-y-2">
                    <h3 className="text-3xl font-bold text-white font-[family-name:var(--font-geist-mono)] tracking-tight">
                      {stat.value}
                    </h3>
                    <p className="text-sm font-medium text-white/40">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Ecosystem Section — Glass Cards ── */}
        <section id="ecosystem" className="py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16 space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl text-white"
              >
                A Complete Innovation Ecosystem
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-white/45 max-w-2xl mx-auto leading-relaxed"
              >
                Traditional procurement starts when a tender is published.
                StartTohKr starts when an innovation is born and supports it
                until real-world scale.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {[
                {
                  icon: Lightbulb,
                  title: "For Startups",
                  desc: "Showcase your innovations, apply for government challenges, and connect directly with investors and mentors.",
                },
                {
                  icon: Building2,
                  title: "For Government",
                  desc: "Publish problem statements, discover AI-matched startups, evaluate proposals, and manage digital pilots seamlessly.",
                },
                {
                  icon: LineChart,
                  title: "For Investors",
                  desc: "Discover trending innovations, track startup traction, and express intent-based investment interest.",
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="
                    group p-7 rounded-2xl
                    border border-white/[0.07]
                    bg-white/[0.03] backdrop-blur-xl
                    shadow-[inset_0_1px_0_oklch(1_0_0/0.05)]
                    hover:bg-white/[0.07]
                    hover:border-white/[0.12]
                    hover:shadow-[0_8px_30px_oklch(0_0_0/0.25),inset_0_1px_0_oklch(1_0_0/0.08)]
                    transition-all duration-300
                  "
                >
                  <div className="h-10 w-10 rounded-lg bg-white/[0.1] border border-white/[0.15] flex items-center justify-center mb-5">
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white/90 group-hover:text-white transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/50 transition-colors">
                    {card.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section — Glass Panel ── */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="
                max-w-3xl mx-auto text-center
                rounded-3xl p-14
                border border-white/[0.08]
                bg-white/[0.04] backdrop-blur-xl
                shadow-[0_8px_40px_oklch(0_0_0/0.3),inset_0_1px_0_oklch(1_0_0/0.06)]
              "
            >
              <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl mb-5 text-white">
                Ready to accelerate innovation?
              </h2>
              <p className="max-w-xl mx-auto mb-10 text-white/45 text-lg leading-relaxed">
                Join thousands of founders, officials, and investors already
                building the future on StartTohKr.
              </p>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="
                    px-8 bg-white/95 text-[oklch(0.08_0_0)]
                    hover:bg-white border-0
                    shadow-[0_2px_20px_oklch(1_0_0/0.12)]
                  "
                >
                  Create Your Account
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ───── Footer (glass bottom) ───── */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
