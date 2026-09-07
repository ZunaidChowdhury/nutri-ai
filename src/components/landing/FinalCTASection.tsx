"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth/client";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { HiSparkles, HiArrowRight, HiCheck, HiFire } from "react-icons/hi";

export default function FinalCTASection() {
  const { data: session } = useSession();
  const isLoggedIn = useHydrated() && !!session?.user;

  return (
    <section className="w-full bg-[#F7FAF8] py-20 sm:py-24 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#007F78] p-8 sm:p-12 lg:p-16 shadow-xl dark:bg-[#005F5A]">
          {/* Subtle ambient lighting */}
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-[#65B82E]/25 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Compelling Pitch & Action */}
            <div className="text-white lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-md mb-6">
                <HiSparkles className="h-4 w-4 text-[#FACC15]" />
                <span>Start In Under 60 Seconds</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
                Ready to Transform How You Eat?
              </h2>

              <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/90 max-w-xl">
                Eliminate dietary guesswork, endless calorie calculations, and repetitive meal prep. Let NutriAI&apos;s intelligent agents craft and optimize your personal nutrition blueprint.
              </p>

              {/* Value proposition checklist */}
              <div className="mt-6 space-y-2.5 text-sm font-medium text-white/95">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[#FACC15]">
                    <HiCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>100% Free forever — no credit card or subscription required</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[#FACC15]">
                    <HiCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>Instant 7-day personalized meal plan tailored to your macros</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[#FACC15]">
                    <HiCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>Backed by 3 autonomous agents for planning, logging & analysis</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href={isLoggedIn ? "/meal-plan" : "/register"}
                  className="!no-underline group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-[#007F78] shadow-md transition-all hover:bg-[#F7FAF8] hover:shadow-lg dark:text-[#005F5A]"
                >
                  <span>{isLoggedIn ? "Generate Your Meal Plan" : "Get Started For Free"}</span>
                  <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/meals"
                  className="!no-underline inline-flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  Explore Meals
                </Link>
              </div>
            </div>

            {/* Right Column: Live Plan Preview Demonstration */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/20 bg-white p-6 sm:p-7 text-[#163330] shadow-2xl dark:border-white/10 dark:bg-[#15231f] dark:text-foreground">
                <div className="flex items-center justify-between border-b border-[#DCE9E4] pb-4 dark:border-border">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#007F78] dark:text-accent">
                      AI Nutrition Blueprint
                    </span>
                    <h3 className="text-base font-extrabold text-[#163330] dark:text-foreground">
                      Target: 2,150 kcal / day
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#EAF7DE] px-2.5 py-1 text-xs font-semibold text-[#65B82E] dark:bg-[#65B82E]/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#65B82E] animate-pulse" />
                    <span>Optimized</span>
                  </div>
                </div>

                {/* Macro progress indicators */}
                <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
                  <div className="rounded-xl bg-[#F7FAF8] p-2.5 border border-[#DCE9E4] dark:bg-surface-secondary dark:border-border">
                    <span className="text-[11px] font-bold text-[#65B82E] block">PROTEIN</span>
                    <span className="text-sm font-extrabold text-[#163330] dark:text-foreground">165g</span>
                    <span className="text-[10px] text-[#55706B] block dark:text-muted">32%</span>
                  </div>
                  <div className="rounded-xl bg-[#F7FAF8] p-2.5 border border-[#DCE9E4] dark:bg-surface-secondary dark:border-border">
                    <span className="text-[11px] font-bold text-[#F59E0B] block">CARBS</span>
                    <span className="text-sm font-extrabold text-[#163330] dark:text-foreground">210g</span>
                    <span className="text-[10px] text-[#55706B] block dark:text-muted">40%</span>
                  </div>
                  <div className="rounded-xl bg-[#F7FAF8] p-2.5 border border-[#DCE9E4] dark:bg-surface-secondary dark:border-border">
                    <span className="text-[11px] font-bold text-[#EF4444] block">FATS</span>
                    <span className="text-sm font-extrabold text-[#163330] dark:text-foreground">62g</span>
                    <span className="text-[10px] text-[#55706B] block dark:text-muted">28%</span>
                  </div>
                </div>

                {/* Day sample snippet */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-[#F7FAF8] px-3 py-2 text-xs dark:bg-surface-secondary">
                    <span className="font-semibold text-[#163330] dark:text-foreground truncate">
                      🥣 Berry Protein Oat Bowl
                    </span>
                    <span className="font-bold text-[#F59E0B] shrink-0">480 kcal</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#F7FAF8] px-3 py-2 text-xs dark:bg-surface-secondary">
                    <span className="font-semibold text-[#163330] dark:text-foreground truncate">
                      🥗 Mediterranean Salmon & Quinoa
                    </span>
                    <span className="font-bold text-[#F59E0B] shrink-0">620 kcal</span>
                  </div>
                </div>

                {/* Footer AI Status */}
                <div className="mt-4 flex items-center justify-between border-t border-[#DCE9E4] pt-3 text-[11px] text-[#55706B] dark:border-border dark:text-muted">
                  <span className="flex items-center gap-1">
                    <HiFire className="h-3.5 w-3.5 text-[#F59E0B]" />
                    <span>Calculated by AI Agent</span>
                  </span>
                  <span className="font-semibold text-[#007F78] dark:text-accent">Ready in 30s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}