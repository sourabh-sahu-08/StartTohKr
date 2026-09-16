import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const footerColumns = [
  {
    title: "Platform",
    links: [
      { label: "Discover Startups", href: "/discover" },
      { label: "Challenge Marketplace", href: "/challenges" },
      { label: "Innovation Feed", href: "/feed" },
      { label: "Pilot Sandbox", href: "/pilots" },
      { label: "Scaling Hub", href: "/scaling-hub" },
      { label: "AI Copilot", href: "#" },
    ],
  },
  {
    title: "For Stakeholders",
    links: [
      { label: "Startups", href: "/dashboard/startup" },
      { label: "Government", href: "/dashboard/government" },
      { label: "Investors", href: "/dashboard/investor" },
      { label: "Industry Partners", href: "/dashboard/industry-partner" },
      { label: "Evaluators", href: "/dashboard/evaluator" },
      { label: "Mentors", href: "/dashboard/mentor" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#", external: true },
      { label: "API Reference", href: "#", external: true },
      { label: "Innovation Passport", href: "#" },
      { label: "Evaluation Guide", href: "#" },
      { label: "Procurement Guide", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About StartTohKr", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Press Kit", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Acceptable Use", href: "#" },
      { label: "DPA", href: "#" },
      { label: "Trust Center", href: "#", external: true },
    ],
  },
];

const socialLinks = [
  {
    label: "X / Twitter",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/sourabh-sahu-08/StartTohKr",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer
      className="relative border-t border-white/[0.06] bg-[oklch(0.04_0_0/0.8)] backdrop-blur-xl"
      role="contentinfo"
    >
      {/* Main Footer Grid */}
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-5">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[13px] font-semibold text-[oklch(0.85_0_0)] mb-4 tracking-[-0.01em]">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="
                        group inline-flex items-center gap-1
                        text-[13px] text-[oklch(0.5_0_0)]
                        hover:text-[oklch(0.78_0_0)]
                        transition-colors duration-200
                      "
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                      {link.external && (
                        <ArrowUpRight
                          className="w-3 h-3 opacity-50 group-hover:opacity-80 transition-opacity"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.05]">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo + Copyright */}
          <div className="flex items-center gap-3">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <svg
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  d="M14 2L4 8v12l10 6 10-6V8L14 2z"
                  fill="white"
                  fillOpacity="0.6"
                />
                <path
                  d="M14 2L4 8l10 6 10-6-10-6z"
                  fill="white"
                  fillOpacity="0.5"
                />
                <path
                  d="M14 14v14l10-6V8l-10 6z"
                  fill="white"
                  fillOpacity="0.4"
                />
              </svg>
            </div>
            <span className="text-[12px] text-[oklch(0.4_0_0)]">
              © {new Date().getFullYear()} StartTohKr Innovation Ecosystem
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="
                  text-[oklch(0.4_0_0)] hover:text-[oklch(0.7_0_0)]
                  transition-colors duration-200
                "
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
