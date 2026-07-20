"use client";

import { Link } from "@heroui/react";
import { HiMail, HiLocationMarker } from "react-icons/hi";
import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/meals", label: "Explore Meals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const resourceLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/meal-plan", label: "Meal Plan" },
  { href: "/items/add", label: "Add Meal" },
  { href: "/items/manage", label: "Manage Meals" },
];

const socialLinks = [
  { href: "https://github.com", icon: FaGithub, label: "GitHub" },
  { href: "https://x.com", icon: FaXTwitter, label: "Twitter" },
  { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-divider bg-default-50">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" color="foreground" className="text-xl font-bold">
              NutriAI
            </Link>
            <p className="text-sm text-foreground/60">
              AI-powered nutrition and meal planning assistant. Eat smarter,
              live better.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  isExternal
                  aria-label={social.label}
                  className="text-foreground/50 hover:text-foreground transition-colors"
                >
                  <social.icon className="size-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/70">
              Quick Links
            </h3>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                color="foreground"
                size="sm"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/70">
              Resources
            </h3>
            {resourceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                color="foreground"
                size="sm"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/70">
              Contact
            </h3>
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <HiMail className="size-4 shrink-0" />
              <Link
                href="mailto:hello@nutriai.app"
                color="foreground"
                size="sm"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                hello@nutriai.app
              </Link>
            </div>
            <div className="flex items-start gap-2 text-sm text-foreground/60">
              <HiLocationMarker className="size-4 shrink-0 mt-0.5" />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-divider pt-6 text-center text-sm text-foreground/50">
          &copy; {year} NutriAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
