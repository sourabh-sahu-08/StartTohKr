"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Discover", href: "/discover" },
  { label: "Challenges", href: "/challenges" },
  { label: "Feed", href: "/feed" },
  { label: "Pilots", href: "/pilots" },
  { label: "Scaling Hub", href: "/scaling-hub" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3"
        role="banner"
      >
        <nav
          aria-label="Main navigation"
          className={`
            flex items-center justify-between w-full max-w-[1280px]
            h-16 px-6 rounded-2xl
            border transition-all duration-300 ease-out
            ${
              scrolled
                ? "bg-[oklch(0.04_0_0/0.4)] border-white/[0.1] backdrop-blur-3xl shadow-[0_8px_32px_oklch(0_0_0/0.5),inset_0_1px_0_oklch(1_0_0/0.1)]"
                : "bg-white/[0.03] border-white/[0.08] backdrop-blur-2xl shadow-[inset_0_1px_0_oklch(1_0_0/0.05)]"
            }
          `}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0"
            aria-label="StartTohKr Home"
          >
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7"
                aria-hidden="true"
              >
                <path
                  d="M14 2L4 8v12l10 6 10-6V8L14 2z"
                  fill="white"
                  fillOpacity="0.9"
                />
                <path
                  d="M14 2L4 8l10 6 10-6-10-6z"
                  fill="white"
                />
                <path
                  d="M14 14v14l10-6V8l-10 6z"
                  fill="white"
                  fillOpacity="0.8"
                />
                <path
                  d="M14 14v14L4 22V8l10 6z"
                  fill="white"
                  fillOpacity="0.6"
                />
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-white">
              StartTohKr
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  px-3 py-1.5 text-[14px] font-medium
                  text-white/60 hover:text-white
                  transition-colors duration-200
                  rounded-lg hover:bg-white/[0.08]
                "
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="
                text-[14px] font-medium
                text-white/60 hover:text-white
                transition-colors duration-200
              "
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="
                inline-flex items-center gap-2 px-4 py-1.5
                text-[14px] font-medium
                text-black bg-white
                rounded-lg
                hover:bg-white/90
                transition-colors duration-200
                shadow-[0_2px_10px_oklch(1_0_0/0.15)]
              "
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path
                  d="M2 4.5L8 8l6-3.5M2 4.5v7l6 3.5m-6-10.5L8 1l6 3.5M8 8v7m6-10.5v7L8 15"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
              Join Platform
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-8 h-8 flex items-center justify-center"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <div className="flex flex-col gap-[5px]">
              <span
                className={`block w-[18px] h-[1.5px] bg-white/80 transition-all duration-300 origin-center ${
                  mobileOpen
                    ? "rotate-45 translate-y-[3.25px]"
                    : ""
                }`}
              />
              <span
                className={`block w-[18px] h-[1.5px] bg-white/80 transition-all duration-300 origin-center ${
                  mobileOpen
                    ? "-rotate-45 -translate-y-[3.25px]"
                    : ""
                }`}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[oklch(0.06_0_0/0.95)] backdrop-blur-lg md:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="flex flex-col gap-1 pt-24 px-6"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="
                      block py-3 px-4 text-lg font-medium
                      text-white/70 hover:text-white
                      hover:bg-white/[0.06] rounded-xl
                      transition-colors duration-200
                    "
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-6 pt-6 border-t border-[oklch(1_0_0/0.08)] flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="
                    block py-3 px-4 text-center text-base font-medium
                    text-white/80 hover:text-white
                    border border-white/10 rounded-xl
                    transition-colors duration-200
                  "
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="
                    block py-3 px-4 text-center text-base font-medium
                    text-black bg-white
                    rounded-xl
                    transition-colors duration-200
                  "
                >
                  Join Platform
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
