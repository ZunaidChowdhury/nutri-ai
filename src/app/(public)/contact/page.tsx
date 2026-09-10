"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HiMail,
  HiLocationMarker,
  HiClock,
  HiCheckCircle,
  HiArrowRight,
  HiSparkles,
  HiChatAlt2,
} from "react-icons/hi";
import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const contactChannels = [
  {
    icon: HiMail,
    title: "Direct Email",
    value: "support@nutriai.app",
    subtitle: "Average response time: under 12 hours",
    href: "mailto:support@nutriai.app",
    action: "Send Email",
  },
  {
    icon: HiLocationMarker,
    title: "Headquarters",
    value: "San Francisco, CA",
    subtitle: "Silicon Valley, United States",
    href: "https://maps.google.com/?q=San+Francisco+CA",
    action: "View Map",
  },
  {
    icon: HiClock,
    title: "Support Hours",
    value: "Mon - Fri: 9:00 AM - 6:00 PM",
    subtitle: "Pacific Standard Time (PST)",
    action: "Active Support",
  },
];

const socialLinks = [
  { href: "https://github.com", icon: FaGithub, label: "GitHub" },
  { href: "https://x.com", icon: FaXTwitter, label: "Twitter / X" },
  { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Please enter your name";
    if (!email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!subject.trim()) newErrors.subject = "Please enter a subject";
    if (!message.trim()) {
      newErrors.message = "Please enter your message";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setErrors({});
  };

  return (
    <div className="w-full bg-[#F7FAF8] min-h-screen dark:bg-[#0a0a0a]">
      {/* 1. Page Header Section */}
      <section className="w-full border-b border-[#DCE9E4] bg-white/80 backdrop-blur-md dark:border-border dark:bg-[#121c19]/80">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-[#F7FAF8] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#007F78] shadow-2xs dark:border-border dark:bg-surface-secondary dark:text-accent">
            <HiSparkles className="h-3.5 w-3.5" />
            <span>We&apos;re Here to Help</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#163330] dark:text-foreground">
            Get in Touch with the{" "}
            <span className="text-[#007F78] dark:text-accent">NutriAI Team</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-[#55706B] dark:text-muted">
            Have questions about our AI meal planner, need custom dietary support, or want to explore partnership opportunities? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* 2. Main Content Grid (1280px Max-Width) */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Direct Contact & Help Resources (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Quick Contact Cards */}
            <div className="rounded-[1.5rem] border border-[#DCE9E4] bg-white p-6 sm:p-8 shadow-xs dark:border-border dark:bg-[#141f1c]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDF5F0] text-[#007F78] dark:bg-accent/20 dark:text-accent">
                  <HiChatAlt2 className="h-4 w-4" />
                </span>
                <h2 className="text-xl font-bold tracking-tight text-[#163330] dark:text-foreground">
                  Contact Information
                </h2>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-[#55706B] dark:text-muted">
                Reach out directly or send us a message through the form. We respond to all inquiries promptly.
              </p>

              <div className="mt-6 space-y-4">
                {contactChannels.map((channel) => (
                  <div
                    key={channel.title}
                    className="flex items-start gap-3.5 rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] p-4 transition-all hover:border-[#007F78]/30 hover:bg-white dark:border-border dark:bg-surface-secondary dark:hover:bg-[#1a2924]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DDF5F0] text-[#007F78] dark:bg-accent/20 dark:text-accent">
                      <channel.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#849A95] dark:text-muted">
                        {channel.title}
                      </span>
                      {channel.href ? (
                        <a
                          href={channel.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm font-bold text-[#163330] transition-colors hover:text-[#007F78] dark:text-foreground dark:hover:text-accent"
                        >
                          {channel.value}
                        </a>
                      ) : (
                        <p className="text-sm font-bold text-[#163330] dark:text-foreground">
                          {channel.value}
                        </p>
                      )}
                      <p className="mt-0.5 text-xs text-[#55706B] dark:text-muted">
                        {channel.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Channels */}
              <div className="mt-8 border-t border-[#DCE9E4] pt-6 dark:border-border">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#163330] dark:text-foreground mb-3">
                  Connect on Social Media
                </span>
                <div className="flex items-center gap-2.5">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] text-[#55706B] shadow-2xs transition-all hover:-translate-y-0.5 hover:border-[#007F78]/40 hover:bg-[#007F78] hover:text-white dark:border-border dark:bg-surface-secondary dark:text-muted dark:hover:bg-accent dark:hover:text-white"
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Link Card to FAQ & About */}
            <div className="rounded-[1.5rem] border border-[#DCE9E4] bg-[#EEF7F3] p-6 dark:border-border dark:bg-[#121c19]">
              <h3 className="text-sm font-bold text-[#163330] dark:text-foreground">
                Looking for Immediate Answers?
              </h3>
              <p className="mt-1 text-xs text-[#55706B] dark:text-muted leading-relaxed">
                Check our Frequently Asked Questions or learn more about our autonomous Tri-Agent architecture.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/#faq"
                  className="!no-underline inline-flex items-center gap-1.5 rounded-xl border border-[#DCE9E4] bg-white px-3.5 py-2 text-xs font-semibold text-[#163330] shadow-2xs hover:border-[#007F78]/40 hover:text-[#007F78] dark:border-border dark:bg-[#1a1a1a] dark:text-foreground"
                >
                  <span>Explore FAQ</span>
                  <HiArrowRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/about"
                  className="!no-underline inline-flex items-center gap-1.5 rounded-xl border border-[#DCE9E4] bg-white px-3.5 py-2 text-xs font-semibold text-[#163330] shadow-2xs hover:border-[#007F78]/40 hover:text-[#007F78] dark:border-border dark:bg-[#1a1a1a] dark:text-foreground"
                >
                  <span>About NutriAI</span>
                  <HiArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-[1.5rem] border border-[#DCE9E4] bg-white p-7 sm:p-10 shadow-xs dark:border-border dark:bg-[#141f1c]">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF7DE] text-[#65B82E] dark:bg-[#65B82E]/20 mb-4">
                    <HiCheckCircle className="h-9 w-9" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#163330] dark:text-foreground">
                    Message Sent Successfully!
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-[#55706B] dark:text-muted">
                    Thank you for reaching out to NutriAI. A member of our nutrition intelligence team will review your message and reply to <strong className="text-[#163330] dark:text-foreground">{email}</strong> within 12 hours.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#007F78] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-[#005F5A] hover:shadow-sm cursor-pointer dark:bg-accent dark:hover:bg-accent/90"
                  >
                    <span>Send Another Message</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-[#163330] dark:text-foreground">
                      Send Us a Message
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-[#55706B] dark:text-muted">
                      Fill out the form below and we&apos;ll get back to you as soon as possible.
                    </p>
                  </div>

                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1.5 block text-xs font-semibold text-[#163330] dark:text-foreground"
                      >
                        Your Name <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Sarah Connor"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                        }}
                        className={`w-full rounded-xl border bg-[#F7FAF8] px-4 py-3 text-xs sm:text-sm text-[#163330] outline-none transition-all placeholder:text-[#849A95] focus:bg-white focus:ring-2 dark:bg-surface-secondary dark:text-foreground ${
                          errors.name
                            ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20"
                            : "border-[#DCE9E4] focus:border-[#007F78] focus:ring-[#007F78]/20 dark:border-border dark:focus:border-accent"
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-[#EF4444]">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-1.5 block text-xs font-semibold text-[#163330] dark:text-foreground"
                      >
                        Email Address <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        className={`w-full rounded-xl border bg-[#F7FAF8] px-4 py-3 text-xs sm:text-sm text-[#163330] outline-none transition-all placeholder:text-[#849A95] focus:bg-white focus:ring-2 dark:bg-surface-secondary dark:text-foreground ${
                          errors.email
                            ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20"
                            : "border-[#DCE9E4] focus:border-[#007F78] focus:ring-[#007F78]/20 dark:border-border dark:focus:border-accent"
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-[#EF4444]">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="mb-1.5 block text-xs font-semibold text-[#163330] dark:text-foreground"
                    >
                      Subject <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      placeholder="e.g. Question about AI Meal Planning algorithms"
                      value={subject}
                      onChange={(e) => {
                        setSubject(e.target.value);
                        if (errors.subject) setErrors((prev) => ({ ...prev, subject: "" }));
                      }}
                      className={`w-full rounded-xl border bg-[#F7FAF8] px-4 py-3 text-xs sm:text-sm text-[#163330] outline-none transition-all placeholder:text-[#849A95] focus:bg-white focus:ring-2 dark:bg-surface-secondary dark:text-foreground ${
                        errors.subject
                          ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20"
                          : "border-[#DCE9E4] focus:border-[#007F78] focus:ring-[#007F78]/20 dark:border-border dark:focus:border-accent"
                      }`}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-[#EF4444]">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message Area */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-1.5 block text-xs font-semibold text-[#163330] dark:text-foreground"
                    >
                      Message <span className="text-[#EF4444]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="How can our team help you with your nutritional goals?"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
                      }}
                      className={`w-full rounded-xl border bg-[#F7FAF8] p-4 text-xs sm:text-sm text-[#163330] outline-none transition-all placeholder:text-[#849A95] focus:bg-white focus:ring-2 dark:bg-surface-secondary dark:text-foreground ${
                        errors.message
                          ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20"
                          : "border-[#DCE9E4] focus:border-[#007F78] focus:ring-[#007F78]/20 dark:border-border dark:focus:border-accent"
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-[#EF4444]">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#007F78] px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-[#005F5A] hover:shadow-sm cursor-pointer dark:bg-accent dark:hover:bg-accent/90"
                    >
                      <span>Send Message</span>
                      <HiArrowRight className="h-4 w-4" />
                    </button>
                    <span className="text-xs text-[#849A95] dark:text-muted">
                      🔒 Your information is private & secure
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}