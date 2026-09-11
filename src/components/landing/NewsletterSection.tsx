"use client";

import { useState } from "react";
import { HiMail, HiCheckCircle, HiSparkles, HiShieldCheck } from "react-icons/hi";

const categories = [
  "All Plans",
  "Weight Loss",
  "Muscle Building",
  "Keto & Low-Carb",
  "Plant-Based",
];

const benefits = [
  {
    icon: "🗓️",
    title: "Curated 7-Day Roadmaps",
    description: "Weekly meal plan strategies calibrated to your exact calorie targets, macro ratios, and budget tier.",
  },
  {
    icon: "📊",
    title: "Nutrient Deficit Audits",
    description: "Practical advice on identifying micronutrient gaps (Iron, Vitamin D, Fiber) and balancing your food logs.",
  },
  {
    icon: "🍽️",
    title: "Verified Catalog Recipes",
    description: "Discover community & verified recipes complete with macro breakdowns, ingredients, and cooking steps.",
  },
];

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Plans");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="w-full bg-white py-20 sm:py-24 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#DCE9E4] bg-[#EEF7F3] p-8 sm:p-12 lg:p-14 shadow-sm dark:border-[#263835] dark:bg-[#121c19]">
          {/* Subtle background ambient glows */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#DDF5F0]/70 blur-3xl dark:bg-[#007F78]/10 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#EAF7DE]/70 blur-3xl dark:bg-[#65B82E]/10 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Value Proposition & Benefit Highlights */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#007F78] shadow-xs dark:border-[#263835] dark:bg-[#161f1e] dark:text-[#2DD4BF]">
                <HiSparkles className="h-3.5 w-3.5" />
                <span>Nutri AI Weekly Insights</span>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#163330] sm:text-4xl lg:text-4xl leading-tight dark:text-[#E8F2EF]">
                Smart Nutrition Insights in Your Inbox
              </h2>

              <p className="mt-3 text-base sm:text-lg leading-relaxed text-[#55706B] dark:text-[#A1B8B3] max-w-xl">
                Receive practical meal planning strategies, macro-balanced recipe highlights from our catalog, and tips to eliminate nutrient deficiencies from your weekly routine.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {benefits.map((b) => (
                  <div
                    key={b.title}
                    className="rounded-2xl border border-[#DCE9E4] bg-white/80 p-4 backdrop-blur-xs transition-all hover:bg-white dark:border-[#263835] dark:bg-[#151f1c]/80 dark:hover:bg-[#151f1c]"
                  >
                    <span className="text-2xl" role="img" aria-label={b.title}>
                      {b.icon}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-[#163330] dark:text-[#E8F2EF]">
                      {b.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#55706B] dark:text-[#A1B8B3]">
                      {b.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Interactive Subscription Box */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-[#DCE9E4] bg-white p-6 sm:p-8 shadow-md dark:border-[#263835] dark:bg-[#151f1c]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDF5F0] text-[#007F78] dark:bg-[#007F78]/25 dark:text-[#2DD4BF]">
                    <HiMail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#163330] dark:text-[#E8F2EF]">
                      Stay Ahead with Nutri AI
                    </h3>
                    <p className="text-xs text-[#55706B] dark:text-[#A1B8B3]">
                      Weekly nutrition digests delivered free.
                    </p>
                  </div>
                </div>

                {subscribed ? (
                  <div className="mt-6 rounded-2xl border border-[#65B82E]/30 bg-[#EAF7DE] p-5 text-center dark:bg-[#65B82E]/10">
                    <HiCheckCircle className="mx-auto h-8 w-8 text-[#65B82E]" />
                    <p className="mt-2 text-base font-bold text-[#163330] dark:text-[#E8F2EF]">
                      You&apos;re subscribed!
                    </p>
                    <p className="mt-1 text-xs text-[#55706B] dark:text-[#A1B8B3]">
                      Look out for your weekly meal planning digest and nutrition tips.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="mt-6 flex flex-col gap-4">
                    {/* Category preference selector */}
                    <div>
                      <label className="block text-xs font-semibold text-[#55706B] dark:text-[#A1B8B3] mb-2">
                        Customize your nutrition interest:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`rounded-xl px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                              selectedCategory === cat
                                ? "bg-[#007F78] text-white shadow-xs"
                                : "bg-[#F7FAF8] text-[#55706B] border border-[#DCE9E4] hover:border-[#007F78]/40 dark:bg-[#121918] dark:border-[#263835] dark:text-[#A1B8B3]"
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
                        className="w-full rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] px-4 py-3 text-sm text-[#163330] outline-none transition-all placeholder:text-[#849A95] focus:border-[#007F78] focus:bg-white focus:ring-2 focus:ring-[#007F78]/20 dark:border-[#263835] dark:bg-[#121918] dark:text-[#E8F2EF] dark:placeholder:text-[#6E8883] dark:focus:border-[#007F78]"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-[#007F78] py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#005F5A] hover:shadow-md cursor-pointer"
                    >
                      Subscribe Free
                    </button>

                    {/* Privacy Guarantee */}
                    <div className="flex items-center justify-center gap-1.5 text-center text-xs text-[#849A95] dark:text-[#6E8883]">
                      <HiShieldCheck className="h-4 w-4 text-[#65B82E]" />
                      <span>Zero spam. Unsubscribe anytime in 1-click.</span>
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