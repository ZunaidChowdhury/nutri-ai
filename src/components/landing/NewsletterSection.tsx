"use client";

import { useState } from "react";
import { HiMail, HiCheckCircle, HiSparkles, HiShieldCheck } from "react-icons/hi";

const categories = ["All Topics", "High Protein", "Quick Prep", "Plant-Based"];

const benefits = [
  {
    icon: "🥑",
    title: "Macro-Optimized Recipes",
    description: "Chef-tested, 15-minute meals designed by nutritionists and AI algorithms.",
  },
  {
    icon: "⚡",
    title: "Metabolic & Energy Insights",
    description: "Actionable tips on nutrient timing, blood sugar balance, and gut health.",
  },
  {
    icon: "📋",
    title: "Weekly Prep & Grocery Sheet",
    description: "A printable Sunday prep checklist to cut your weekly cooking time in half.",
  },
];

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="w-full bg-white py-20 sm:py-24 dark:bg-background">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-[#DCE9E4] bg-[#EEF7F3] p-8 sm:p-12 lg:p-14 shadow-sm dark:border-border dark:bg-[#121c19]">
          {/* Subtle background ambient glows */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#DDF5F0]/70 blur-3xl dark:bg-accent/10 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#EAF7DE]/70 blur-3xl dark:bg-[#65B82E]/10 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Value Proposition & Benefit Highlights */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#007F78] shadow-xs dark:border-border dark:bg-surface-secondary dark:text-accent">
                <HiSparkles className="h-3.5 w-3.5" />
                <span>The NutriAI Weekly Digest</span>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#163330] sm:text-4xl lg:text-4xl leading-tight dark:text-foreground">
                Smart Nutrition Insights in Your Inbox
              </h2>

              <p className="mt-3 text-base sm:text-lg leading-relaxed text-[#55706B] dark:text-muted max-w-xl">
                No restrictive fads or pseudoscience. Receive high-protein meal guides, science-backed nutritional breakdowns, and AI-curated prep tips every Friday.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {benefits.map((b) => (
                  <div
                    key={b.title}
                    className="rounded-xl border border-[#DCE9E4] bg-white/80 p-4 backdrop-blur-xs transition-all hover:bg-white dark:border-border dark:bg-[#1a1a1a]/80 dark:hover:bg-[#1a1a1a]"
                  >
                    <span className="text-2xl" role="img" aria-label={b.title}>
                      {b.icon}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-[#163330] dark:text-foreground">
                      {b.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#55706B] dark:text-muted">
                      {b.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Interactive Subscription Box */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#DCE9E4] bg-white p-6 sm:p-8 shadow-md dark:border-border dark:bg-[#1a1a1a]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDF5F0] text-[#007F78] dark:bg-accent/20 dark:text-accent">
                    <HiMail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#163330] dark:text-foreground">
                      Join 15,000+ Mindful Eaters
                    </h3>
                    <p className="text-xs text-[#55706B] dark:text-muted">
                      Delivered free every Friday morning.
                    </p>
                  </div>
                </div>

                {subscribed ? (
                  <div className="mt-6 rounded-xl border border-[#65B82E]/30 bg-[#EAF7DE] p-5 text-center dark:bg-[#65B82E]/10">
                    <HiCheckCircle className="mx-auto h-8 w-8 text-[#65B82E]" />
                    <p className="mt-2 text-base font-bold text-[#163330] dark:text-foreground">
                      You&apos;re officially on the list!
                    </p>
                    <p className="mt-1 text-xs text-[#55706B] dark:text-muted">
                      Check your inbox this Friday for your first personalized AI nutrition digest.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="mt-6 flex flex-col gap-4">
                    {/* Category preference selector */}
                    <div>
                      <label className="block text-xs font-semibold text-[#55706B] dark:text-muted mb-2">
                        Tailor your primary focus:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                              selectedCategory === cat
                                ? "bg-[#007F78] text-white shadow-xs dark:bg-accent"
                                : "bg-[#F7FAF8] text-[#55706B] border border-[#DCE9E4] hover:border-[#007F78]/40 dark:bg-surface-secondary dark:border-border dark:text-muted"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label htmlFor="newsletter-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="newsletter-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] px-4 py-3 text-sm text-[#163330] outline-none transition-all placeholder:text-[#849A95] focus:border-[#007F78] focus:bg-white focus:ring-2 focus:ring-[#007F78]/20 dark:border-border dark:bg-surface-secondary dark:text-foreground dark:focus:border-accent"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-[#007F78] py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#005F5A] hover:shadow-md cursor-pointer dark:bg-accent dark:hover:bg-accent/90"
                    >
                      Subscribe Free
                    </button>

                    {/* Privacy Guarantee */}
                    <div className="flex items-center justify-center gap-1.5 text-center text-xs text-[#849A95] dark:text-muted">
                      <HiShieldCheck className="h-4 w-4 text-[#65B82E]" />
                      <span>Zero spam. 1-click unsubscribe anytime.</span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}