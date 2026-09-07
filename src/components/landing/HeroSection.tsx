"use client";

import { useSession } from "@/lib/auth/client";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { Link } from "@heroui/react";
import { motion } from "framer-motion";
import { HiSparkles, HiChartPie, HiLightningBolt } from "react-icons/hi";
import { CheckIcon } from "@/components/ui/icons";

export default function HeroSection() {
  const { data: session } = useSession();
  const isLoggedIn = useHydrated() && !!session?.user;

  return (
    <section className="relative w-full overflow-hidden bg-[#F7FAF8] dark:bg-[#0a0a0a] pt-16 pb-20 md:pt-24 md:pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] h-[70%] w-[50%] rounded-full bg-[#DDF5F0]/50 blur-3xl dark:bg-accent/5" />
        <div className="absolute -bottom-[20%] -left-[10%] h-[60%] w-[40%] rounded-full bg-[#EAF7DE]/50 blur-3xl dark:bg-[#65B82E]/5" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left: Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-white px-3 py-1.5 text-sm font-medium text-[#007F78] shadow-sm mb-6 dark:border-border dark:bg-surface-secondary dark:text-accent">
              <HiSparkles className="h-4 w-4" />
              <span>Nutri AI 2.0 is here</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#163330] tracking-tight leading-[1.15] dark:text-foreground">
              Intelligent <span className="text-[#007F78] dark:text-accent">Meal Planning</span> & Nutrition Analyst
            </h1>
            
            <p className="mt-6 text-lg text-[#55706B] md:text-xl leading-relaxed dark:text-muted">
              Eat smarter and live better. Our three specialized AI agents work together to generate custom meal plans, analyze your daily intake, and provide actionable nutrition insights tailored just for you.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href={isLoggedIn ? "/dashboard" : "/register"}
                className="!no-underline inline-flex items-center justify-center rounded-lg bg-[#007F78] px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-[#005F5A] hover:shadow-md dark:bg-accent dark:hover:bg-accent/90"
              >
                {isLoggedIn ? "Go to Dashboard" : "Start Planning Free"}
              </Link>
              <Link
                href="/meals"
                className="!no-underline inline-flex items-center justify-center rounded-lg border-2 border-[#DCE9E4] bg-white px-8 py-3.5 text-base font-semibold text-[#163330] transition-all hover:border-[#007F78]/40 hover:bg-[#F7FAF8] dark:border-border dark:bg-transparent dark:text-foreground dark:hover:border-accent/40 dark:hover:bg-surface-secondary"
              >
                Explore Meals
              </Link>
            </div>
            
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm font-medium text-[#55706B] dark:text-muted">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF7DE] dark:bg-[#65B82E]/20">
                  <CheckIcon className="h-3 w-3 text-[#65B82E]" />
                </div>
                <span>AI Meal Planner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF7DE] dark:bg-[#65B82E]/20">
                  <CheckIcon className="h-3 w-3 text-[#65B82E]" />
                </div>
                <span>Meal Analyzer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF7DE] dark:bg-[#65B82E]/20">
                  <CheckIcon className="h-3 w-3 text-[#65B82E]" />
                </div>
                <span>Nutrition Insights</span>
              </div>
            </div>
          </motion.div>
          
          {/* Right: Visual Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none lg:ml-auto"
          >
            {/* Main Image Base */}
            <div className="relative rounded-[1.25rem] bg-white p-2 shadow-xl ring-1 ring-[#DCE9E4] dark:bg-[#1a1a1a] dark:ring-border">
              <img
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80"
                alt="Healthy nutritious meal"
                className="h-[380px] sm:h-[480px] w-full object-cover rounded-xl"
              />
              <div className="absolute inset-2 rounded-xl bg-gradient-to-t from-[#163330]/40 to-transparent dark:from-black/60 pointer-events-none" />
            </div>

            {/* Floating Card 1 - Meal Planner */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -left-4 sm:-left-10 top-12 rounded-xl bg-white p-3 sm:p-4 shadow-xl shadow-black/5 ring-1 ring-[#DCE9E4] dark:bg-[#1a1a1a] dark:ring-border"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#DDF5F0] text-[#007F78] dark:bg-accent/20 dark:text-accent">
                  <HiSparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-[#163330] dark:text-foreground">AI Meal Planner</p>
                  <p className="text-xs sm:text-sm text-[#55706B] dark:text-muted">7-day plan ready</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2 - Analyzer */}
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 rounded-xl bg-white p-3 sm:p-4 shadow-xl shadow-black/5 ring-1 ring-[#DCE9E4] dark:bg-[#1a1a1a] dark:ring-border"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF7DE] text-[#65B82E] dark:bg-[#65B82E]/20 dark:text-[#65B82E]">
                  <HiLightningBolt className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-[#163330] dark:text-foreground">Meal Analyzer</p>
                  <p className="text-xs sm:text-sm text-[#55706B] dark:text-muted">Macro balance optimal</p>
                </div>
              </div>
            </motion.div>
            
            {/* Floating Card 3 - Nutrition */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
              className="absolute left-6 sm:left-12 -bottom-6 rounded-xl bg-white p-3 sm:p-4 shadow-xl shadow-black/5 ring-1 ring-[#DCE9E4] dark:bg-[#1a1a1a] dark:ring-border"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#FFFBEB] text-[#F59E0B] dark:bg-[#F59E0B]/20 dark:text-[#F59E0B]">
                  <HiChartPie className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-[#163330] dark:text-foreground">Nutrition Insights</p>
                  <p className="text-xs sm:text-sm text-[#55706B] dark:text-muted">420 kcal · 32g Protein</p>
                </div>
              </div>
            </motion.div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}