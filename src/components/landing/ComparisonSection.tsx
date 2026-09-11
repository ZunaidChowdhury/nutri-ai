"use client";

import { motion } from "framer-motion";
import { HiSparkles, HiShieldCheck } from "react-icons/hi";

const comparisons = [
  {
    feature: "7-Day Meal Planning",
    traditional: "Hours researching recipes, calculating calories, and juggling portion spreadsheets.",
    nutriai: "Automated 7-day schedule (21 meals) tailored to your fitness goal, calorie target, and budget.",
  },
  {
    feature: "Dietary Restrictions & Allergens",
    traditional: "Manually vetting ingredient lists to ensure compliance with dietary rules.",
    nutriai: "Built-in filter engine for Keto, Vegan, Gluten-Free, Dairy-Free, Halal, Kosher, and more.",
  },
  {
    feature: "Recipe Catalog & Bookmarking",
    traditional: "Cluttered, unverified recipe databases with unreliable nutrition info.",
    nutriai: "Curated personal catalog where you can save favorites and build plans from your selected meals.",
  },
  {
    feature: "Automated Food Classification",
    traditional: "Manually searching through endless cuisine categories and tags when saving recipes.",
    nutriai: "AI classification agent predicts cuisine origin and confidence score from recipe title and description.",
  },
  {
    feature: "30-Day Nutrition Audit & Guidance",
    traditional: "Flat calorie counters that show daily totals without highlighting nutritional deficiencies.",
    nutriai: "AI Nutrition Analysis agent evaluates 30-day logs, flags nutrient gaps, and recommends targeted improvements.",
  },
  {
    feature: "Tracking & Offline Export",
    traditional: "Rigid tracking interfaces and PDF/print exports locked behind paywalls.",
    nutriai: "1-Click logging directly from your active meal plan, real-time macro charts, and instant PDF download.",
  },
];

export default function ComparisonSection() {
  return (
    <section className="w-full bg-white py-20 sm:py-28 dark:bg-[#0c1613]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-[#F7FAF8] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#007F78] shadow-xs dark:border-[#263835] dark:bg-[#161f1e] dark:text-[#2DD4BF]">
            <HiShieldCheck className="h-3.5 w-3.5" />
            <span>The Modern Standard</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#163330] sm:text-4xl lg:text-5xl dark:text-[#E8F2EF]">
            Why Nutri AI Outperforms Traditional Dieting
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-[#55706B] dark:text-[#A1B8B3]">
            Move beyond manual spreadsheets and fragmented tools. Experience an integrated platform built around personalized planning, verified catalog meals, and intelligent dietary analysis.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-8 items-stretch">
          {/* Column 1: Traditional Dieting */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between rounded-[2rem] border border-[#DCE9E4] bg-[#F7FAF8] p-7 sm:p-10 dark:border-[#263835] dark:bg-[#151a19]"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-[#EF4444] dark:bg-red-900/30">
                  <span className="text-base font-bold">✕</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#163330] dark:text-[#E8F2EF]">
                    Traditional Dieting & Trackers
                  </h3>
                  <p className="text-xs text-[#55706B] dark:text-[#A1B8B3]">
                    Manual, fragmented, and time-consuming
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {comparisons.map((item) => (
                  <div key={item.feature} className="border-b border-[#DCE9E4] pb-4 last:border-0 dark:border-[#263835]">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#849A95] dark:text-[#6E8883]">
                      {item.feature}
                    </p>
                    <div className="mt-2 flex items-start gap-3">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-100 text-[#EF4444] text-[10px] font-bold dark:bg-red-900/40">
                        ✕
                      </span>
                      <p className="text-sm text-[#55706B] dark:text-[#A1B8B3] leading-relaxed">
                        {item.traditional}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-white p-4 text-center border border-[#DCE9E4] text-xs text-[#849A95] dark:bg-[#161f1e] dark:border-[#263835] dark:text-[#6E8883]">
              Fragmented tracking leads to planning fatigue and inconsistent nutrition.
            </div>
          </motion.div>

          {/* Column 2: NutriAI Platform */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col justify-between rounded-[2rem] border-2 border-[#007F78] bg-gradient-to-b from-[#EEF7F3] to-white p-7 sm:p-10 shadow-lg dark:border-[#007F78] dark:from-[#13221e] dark:to-[#171f1d]"
          >
            {/* Top highlight badge */}
            <div className="absolute -top-3.5 right-8 rounded-full bg-[#007F78] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
              Nutri AI System
            </div>

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007F78] text-white shadow-xs">
                  <HiSparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#163330] dark:text-[#E8F2EF]">
                    Nutri AI Unified Platform
                  </h3>
                  <p className="text-xs text-[#007F78] dark:text-[#2DD4BF] font-semibold">
                    Personalized, automated & grounded in your data
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {comparisons.map((item) => (
                  <div key={item.feature} className="border-b border-[#DCE9E4] pb-4 last:border-0 dark:border-[#263835]">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#007F78] dark:text-[#2DD4BF]">
                      {item.feature}
                    </p>
                    <div className="mt-2 flex items-start gap-3">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EAF7DE] text-[#65B82E] text-[10px] font-bold dark:bg-[#65B82E]/30">
                        ✓
                      </span>
                      <p className="text-sm font-medium text-[#163330] dark:text-[#E8F2EF] leading-relaxed">
                        {item.nutriai}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-white p-4 text-center border border-[#007F78]/20 text-xs font-semibold text-[#007F78] dark:bg-[#161f1e] dark:border-[#007F78]/30 dark:text-[#2DD4BF]">
              ✨ Unified AI planning, meal classification, and 30-day nutrition diagnosis.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
