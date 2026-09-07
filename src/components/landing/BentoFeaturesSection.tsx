"use client";

import { motion } from "framer-motion";
import { HiSparkles, HiCheck, HiSwitchHorizontal, HiShoppingCart, HiLightningBolt, HiTag } from "react-icons/hi";

export default function BentoFeaturesSection() {
  return (
    <section className="w-full bg-[#F7FAF8] py-20 sm:py-28 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#007F78] shadow-xs dark:border-border dark:bg-surface-secondary dark:text-accent">
            <HiSparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Architecture</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#163330] sm:text-4xl lg:text-5xl dark:text-foreground">
            Engineered for Total Nutrition Clarity
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-[#55706B] dark:text-muted">
            Move beyond manual calorie counting. Nutri AI unites autonomous meal generation, visual classification, and smart grocery logistics in one seamless system.
          </p>
        </div>

        {/* Complex Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Bento Item 1: Autonomous 7-Day Meal Scheduler (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-[#DCE9E4] bg-white p-7 sm:p-9 shadow-sm transition-all duration-300 hover:border-[#007F78]/40 hover:shadow-md md:col-span-7 dark:border-border dark:bg-[#151f1c]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF5F0] text-[#007F78] dark:bg-accent/20 dark:text-accent">
                  <HiLightningBolt className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-[#EAF7DE] px-3 py-1 text-xs font-bold text-[#65B82E] dark:bg-[#65B82E]/20">
                  Autonomous Engine
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold tracking-tight text-[#163330] dark:text-foreground">
                Autonomous 7-Day Menu Optimization
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#55706B] dark:text-muted max-w-lg">
                Our algorithm solves the multidimensional macro puzzle in seconds, distributing 21 distinct meals that balance your caloric targets, preferences, and dietary restrictions.
              </p>
            </div>

            {/* Micro UI: Visual Schedule Preview */}
            <div className="mt-8 rounded-2xl border border-[#DCE9E4] bg-[#F7FAF8] p-4 dark:border-border dark:bg-[#1a2824]">
              <div className="flex items-center justify-between border-b border-[#DCE9E4] pb-3 text-xs font-bold text-[#163330] dark:border-border dark:text-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#007F78] animate-pulse" />
                  Weekly Target: 2,150 kcal / day
                </span>
                <span className="text-[#007F78] dark:text-accent">100% Balanced</span>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                {["Mon", "Tue", "Wed", "Thu"].map((day, i) => (
                  <div
                    key={day}
                    className={`rounded-xl p-2.5 transition-all ${
                      i === 0
                        ? "bg-[#007F78] text-white shadow-xs dark:bg-accent"
                        : "bg-white border border-[#DCE9E4] text-[#55706B] dark:bg-[#1f302b] dark:border-border dark:text-muted"
                    }`}
                  >
                    <span className="block font-bold">{day}</span>
                    <span className="mt-1 block text-[11px] opacity-90">
                      {2100 + i * 20} cal
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bento Item 2: AI Food Classifier (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-[#DCE9E4] bg-white p-7 sm:p-9 shadow-sm transition-all duration-300 hover:border-[#007F78]/40 hover:shadow-md md:col-span-5 dark:border-border dark:bg-[#151f1c]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFFBEB] text-[#F59E0B] dark:bg-[#F59E0B]/20">
                  <HiTag className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-[#DDF5F0] px-3 py-1 text-xs font-bold text-[#007F78] dark:bg-accent/20 dark:text-accent">
                  99.4% Confidence
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold tracking-tight text-[#163330] dark:text-foreground">
                Instant Food Classification
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#55706B] dark:text-muted">
                Log any meal and watch the Classifier Agent detect cuisine tags, ingredient groups, and nutritional densities automatically.
              </p>
            </div>

            {/* Micro UI: Tag Badge Widget */}
            <div className="mt-6 rounded-2xl border border-[#DCE9E4] bg-[#F7FAF8] p-4 dark:border-border dark:bg-[#1a2824]">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=160&q=80"
                  alt="Avocado Salmon Salad"
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#163330] dark:text-foreground">
                    Avocado Salmon Salad
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="rounded-md bg-[#DDF5F0] px-1.5 py-0.5 text-[10px] font-semibold text-[#007F78] dark:bg-accent/20 dark:text-accent">
                      Pescatarian
                    </span>
                    <span className="rounded-md bg-[#EAF7DE] px-1.5 py-0.5 text-[10px] font-semibold text-[#65B82E] dark:bg-[#65B82E]/20">
                      High Protein
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 3: Smart Grocery List (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-[#DCE9E4] bg-white p-7 sm:p-9 shadow-sm transition-all duration-300 hover:border-[#007F78]/40 hover:shadow-md md:col-span-5 dark:border-border dark:bg-[#151f1c]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF7DE] text-[#65B82E] dark:bg-[#65B82E]/20">
                  <HiShoppingCart className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-[#F7FAF8] border border-[#DCE9E4] px-3 py-1 text-xs font-bold text-[#55706B] dark:bg-surface-secondary dark:border-border dark:text-muted">
                  Zero Food Waste
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold tracking-tight text-[#163330] dark:text-foreground">
                Unified Grocery Aggregator
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#55706B] dark:text-muted">
                Consolidates every ingredient across your entire weekly plan into organized supermarket aisles, preventing duplicate purchases and spoiled food.
              </p>
            </div>

            {/* Micro UI: Interactive Grocery Items */}
            <div className="mt-6 space-y-2 rounded-2xl border border-[#DCE9E4] bg-[#F7FAF8] p-3.5 dark:border-border dark:bg-[#1a2824]">
              {[
                { name: "Organic Baby Spinach (300g)", aisle: "Produce", checked: true },
                { name: "Wild Alaskan Salmon Fillets (4x)", aisle: "Seafood", checked: true },
                { name: "Cold-Pressed Extra Virgin Olive Oil", aisle: "Pantry", checked: false },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs text-[#163330] shadow-2xs dark:bg-[#1f302b] dark:text-foreground"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-sm ${
                        item.checked
                          ? "bg-[#007F78] text-white"
                          : "border border-[#DCE9E4] dark:border-border"
                      }`}
                    >
                      {item.checked && <HiCheck className="h-3 w-3" />}
                    </span>
                    <span className={item.checked ? "line-through opacity-60" : "font-medium"}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#849A95] dark:text-muted">{item.aisle}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bento Item 4: Adaptive 1-Click Recipe Swaps (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-[#DCE9E4] bg-white p-7 sm:p-9 shadow-sm transition-all duration-300 hover:border-[#007F78]/40 hover:shadow-md md:col-span-7 dark:border-border dark:bg-[#151f1c]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF5F0] text-[#007F78] dark:bg-accent/20 dark:text-accent">
                  <HiSwitchHorizontal className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-[#FFFBEB] px-3 py-1 text-xs font-bold text-[#F59E0B] dark:bg-[#F59E0B]/20">
                  Real-Time Recalibration
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold tracking-tight text-[#163330] dark:text-foreground">
                Adaptive 1-Click Recipe Swaps
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#55706B] dark:text-muted max-w-lg">
                Craving something else? Swap any dish on the fly. The Meal Planner Agent instantly recalculates and presents delicious alternative meals with identical macro ratios.
              </p>
            </div>

            {/* Micro UI: Meal Swap Comparison */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] p-3 text-xs dark:border-border dark:bg-[#1a2824]">
                <span className="text-[10px] font-bold text-[#849A95] uppercase">Current Meal</span>
                <p className="mt-1 font-bold text-[#163330] dark:text-foreground">
                  Grilled Lemon Chicken Bowl
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-[#55706B] dark:text-muted">
                  <span className="text-[#F59E0B] font-bold">520 kcal</span>
                  <span>•</span>
                  <span className="text-[#65B82E] font-bold">42g P</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#007F78]/40 bg-[#DDF5F0]/30 p-3 text-xs dark:border-accent/40 dark:bg-accent/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#007F78] dark:text-accent uppercase">
                    AI Suggested Swap
                  </span>
                  <span className="text-[10px] font-bold text-[#65B82E]">100% Match</span>
                </div>
                <p className="mt-1 font-bold text-[#163330] dark:text-foreground">
                  Seared Salmon & Asparagus
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-[#55706B] dark:text-muted">
                  <span className="text-[#F59E0B] font-bold">515 kcal</span>
                  <span>•</span>
                  <span className="text-[#65B82E] font-bold">41g P</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
