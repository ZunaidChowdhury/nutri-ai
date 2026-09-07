"use client";

import { motion } from "framer-motion";
import { HiCheck, HiX, HiSparkles, HiShieldCheck } from "react-icons/hi";

const comparisons = [
  {
    feature: "Meal Plan Creation",
    traditional: "Hours searching recipes and manually calculating portions on spreadsheets.",
    nutriai: "Autonomous 7-day meal plan tailored to your macros in under 3 seconds.",
  },
  {
    feature: "Handling Cravings & Swaps",
    traditional: "Start over from scratch or break your daily macro targets completely.",
    nutriai: "1-Click intelligent swap with dishes calibrated to exact identical macro ratios.",
  },
  {
    feature: "Ingredient & Grocery Prep",
    traditional: "Disjointed shopping lists resulting in spoiled produce and high food bills.",
    nutriai: "Consolidated aisle-by-aisle grocery checklist designed for zero food waste.",
  },
  {
    feature: "Nutritional Guidance",
    traditional: "Generic calorie counting without context for micronutrients or energy.",
    nutriai: "Three specialized AI agents analyzing deficits, meal density, and habits.",
  },
  {
    feature: "Cost & Accessibility",
    traditional: "$15–$30/month subscriptions behind aggressive paywalls.",
    nutriai: "100% Free full access. No hidden tiers or credit cards required.",
  },
];

export default function ComparisonSection() {
  return (
    <section className="w-full bg-white py-20 sm:py-28 dark:bg-background">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-[#F7FAF8] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#007F78] shadow-xs dark:border-border dark:bg-surface-secondary dark:text-accent">
            <HiShieldCheck className="h-3.5 w-3.5" />
            <span>The Modern Standard</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#163330] sm:text-4xl lg:text-5xl dark:text-foreground">
            Why Nutri AI Outperforms Traditional Dieting
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-[#55706B] dark:text-muted">
            Stop tracking numbers like an accountant. Let autonomous AI intelligence handle the planning so you can simply enjoy delicious, healthy food.
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
            className="flex flex-col justify-between rounded-[1.75rem] border border-[#DCE9E4] bg-[#F7FAF8] p-8 sm:p-10 dark:border-border dark:bg-[#151a19]"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-[#EF4444] dark:bg-red-900/30">
                  <HiX className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#163330] dark:text-foreground">
                    Traditional Calorie Trackers
                  </h3>
                  <p className="text-xs text-[#55706B] dark:text-muted">
                    Tedious, manual, and prone to burnout
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {comparisons.map((item) => (
                  <div key={item.feature} className="border-b border-[#DCE9E4] pb-4 last:border-0 dark:border-border">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#849A95] dark:text-muted">
                      {item.feature}
                    </p>
                    <div className="mt-2 flex items-start gap-3">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-100 text-[#EF4444] text-xs font-bold dark:bg-red-900/40">
                        ✕
                      </span>
                      <p className="text-sm text-[#55706B] dark:text-muted leading-relaxed">
                        {item.traditional}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-white p-4 text-center border border-[#DCE9E4] text-xs text-[#849A95] dark:bg-surface-secondary dark:border-border dark:text-muted">
              Average user drops off within 18 days due to tracking fatigue.
            </div>
          </motion.div>

          {/* Column 2: NutriAI Engine */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col justify-between rounded-[1.75rem] border-2 border-[#007F78] bg-gradient-to-b from-[#EEF7F3] to-white p-8 sm:p-10 shadow-lg dark:border-accent dark:from-[#13221e] dark:to-[#171f1d]"
          >
            {/* Top highlight badge */}
            <div className="absolute -top-3.5 right-8 rounded-full bg-[#007F78] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm dark:bg-accent">
              The AI Advantage
            </div>

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007F78] text-white shadow-xs dark:bg-accent">
                  <HiSparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#163330] dark:text-foreground">
                    Nutri AI Autonomous Platform
                  </h3>
                  <p className="text-xs text-[#007F78] dark:text-accent font-semibold">
                    Intelligent, frictionless & fully personalized
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {comparisons.map((item) => (
                  <div key={item.feature} className="border-b border-[#DCE9E4] pb-4 last:border-0 dark:border-border">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#007F78] dark:text-accent">
                      {item.feature}
                    </p>
                    <div className="mt-2 flex items-start gap-3">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EAF7DE] text-[#65B82E] text-xs font-bold dark:bg-[#65B82E]/30">
                        ✓
                      </span>
                      <p className="text-sm font-medium text-[#163330] dark:text-foreground leading-relaxed">
                        {item.nutriai}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-white p-4 text-center border border-[#007F78]/20 text-xs font-semibold text-[#007F78] dark:bg-surface-secondary dark:border-accent/30 dark:text-accent">
              ✨ 94% of users maintain consistent healthy nutrition past 90 days.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
