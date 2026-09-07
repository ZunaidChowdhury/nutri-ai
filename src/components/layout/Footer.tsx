"use client";

import Link from "next/link";
import { HiMail, HiLocationMarker, HiArrowRight, HiShieldCheck } from "react-icons/hi";
import { FaGithub, FaXTwitter, FaLinkedin, FaInstagram } from "react-icons/fa6";

const productLinks = [
  { href: "/meal-plan", label: "AI Meal Planner", badge: "Core" },
  { href: "/dashboard", label: "Nutrition Dashboard" },
  { href: "/meals", label: "Explore Meals", badge: "500+" },
  { href: "/items/add", label: "Add Custom Meal" },
  { href: "/items/manage", label: "Manage Saved Meals" },
];

const resourceLinks = [
  { href: "/meals", label: "Macro-Balanced Recipes" },
  { href: "/about", label: "Dietary Science & BMR" },
  { href: "/about", label: "Agent Architecture" },
  { href: "/contact", label: "Help Center & FAQs" },
];

const companyLinks = [
  { href: "/about", label: "About NutriAI" },
  { href: "/contact", label: "Contact Us" },
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Nutritional Disclaimer" },
];

const socialLinks = [
  { href: "https://github.com", icon: FaGithub, label: "GitHub" },
  { href: "https://x.com", icon: FaXTwitter, label: "Twitter / X" },
  { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn" },
  { href: "https://instagram.com", icon: FaInstagram, label: "Instagram" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#DCE9E4] bg-white dark:border-border dark:bg-[#0a0a0a]">
      {/* Pre-Footer Highlight Bar */}
      <div className="border-b border-[#DCE9E4]/60 bg-[#F7FAF8] py-4 dark:border-border/60 dark:bg-[#121c19]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-[#55706B] dark:text-muted">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#65B82E] animate-pulse" />
              <span className="text-[#163330] dark:text-foreground font-bold">
                All AI Systems Active
              </span>
              <span>•</span>
              <span>Llama-3 Tri-Agent Core v2.4</span>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <span>🌿 Organic & AI Synergized</span>
              <span>⚡ Sub-Second Plan Synthesis</span>
              <span>🛡️ 100% Private Health Logs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 pr-0 lg:pr-6">
            <Link
              href="/"
              className="!no-underline flex items-center gap-2.5 text-[#163330] transition-opacity hover:opacity-85 dark:text-foreground"
            >
              <img src="/NutriAI-logo.png" alt="NutriAI" className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight">NutriAI</span>
              <span className="rounded-full bg-[#DDF5F0] px-2 py-0.5 text-[10px] font-bold text-[#007F78] dark:bg-accent/20 dark:text-accent">
                AI SaaS
              </span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-[#55706B] dark:text-muted max-w-sm">
              The intelligent nutrition platform empowering mindful eaters with autonomous meal planning, real-time macro analysis, and custom recipe curation.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] text-[#55706B] transition-all hover:-translate-y-0.5 hover:border-[#007F78]/40 hover:bg-[#007F78] hover:text-white dark:border-border dark:bg-surface-secondary dark:text-muted dark:hover:bg-accent dark:hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Direct Contact Info */}
            <div className="mt-6 space-y-1.5 text-xs text-[#55706B] dark:text-muted">
              <div className="flex items-center gap-2">
                <HiMail className="h-4 w-4 text-[#007F78] dark:text-accent" />
                <a href="mailto:support@nutriai.app" className="hover:text-[#007F78] dark:hover:text-accent">
                  support@nutriai.app
                </a>
              </div>
              <div className="flex items-center gap-2">
                <HiLocationMarker className="h-4 w-4 text-[#007F78] dark:text-accent" />
                <span>San Francisco, California</span>
              </div>
            </div>
          </div>

          {/* Product Links (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#163330] dark:text-foreground">
              Product & Agents
            </h3>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="!no-underline group inline-flex items-center gap-2 text-sm text-[#55706B] transition-colors hover:text-[#007F78] dark:text-muted dark:hover:text-accent"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="rounded-full bg-[#EAF7DE] px-1.5 py-0.2 text-[10px] font-bold text-[#65B82E] dark:bg-[#65B82E]/20">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Science (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#163330] dark:text-foreground">
              Resources
            </h3>
            <ul className="mt-4 space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="!no-underline text-sm text-[#55706B] transition-colors hover:text-[#007F78] dark:text-muted dark:hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Start Free Card Widget (3 cols) */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[#DCE9E4] bg-[#F7FAF8] p-5 shadow-xs dark:border-border dark:bg-[#14201c]">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#007F78] text-white text-xs">
                  🥗
                </span>
                <span className="text-xs font-bold text-[#163330] dark:text-foreground">
                  Get Started Free
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#55706B] dark:text-muted">
                Generate your personalized 7-day meal plan with zero cost or credit card commitments.
              </p>
              <Link
                href="/register"
                className="!no-underline mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#007F78] py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#005F5A] dark:bg-accent dark:hover:bg-accent/90"
              >
                <span>Launch Planner</span>
                <HiArrowRight className="h-3.5 w-3.5" />
              </Link>
              <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-[#849A95] dark:text-muted">
                <HiShieldCheck className="h-3.5 w-3.5 text-[#65B82E]" />
                <span>Zero spam, private data guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#DCE9E4] pt-8 text-xs text-[#849A95] dark:border-border dark:text-muted">
          <p>&copy; {year} NutriAI Inc. Designed with care for healthy living.</p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="hover:text-[#007F78] dark:hover:text-accent">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#007F78] dark:hover:text-accent">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#007F78] dark:hover:text-accent">
              Medical Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}