"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiSparkles,
  HiLightningBolt,
  HiCheckCircle,
  HiChartBar,
  HiArrowRight,
  HiAdjustments,
  HiCamera,
  HiCalendar,
  HiTrendingUp,
  HiShieldCheck,
} from "react-icons/hi";

interface StepData {
  id: string;
  stepNumber: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  icon: typeof HiSparkles;
  badgeColor: string;
  highlight: string;
  metrics: { label: string; value: string };
}

const steps: StepData[] = [
  {
    id: "goals",
    stepNumber: "01",
    title: "Configure Your Goals & Macros",
    shortTitle: "Target Profile",
    eyebrow: "Personalization Engine",
    description:
      "Specify your target calories, weight objective, dietary restrictions, and budget. Nutri AI calculates your optimal metabolic baseline in real time.",
    icon: HiAdjustments,
    badgeColor: "bg-[#DDF5F0] text-[#007F78] dark:bg-[#007F78]/25 dark:text-[#2DD4BF]",
    highlight: "Autonomous Macro Balancing",
    metrics: { label: "Optimization Time", value: "< 500ms" },
  },
  {
    id: "planner",
    stepNumber: "02",
    title: "Autonomous 7-Day Plan Generation",
    shortTitle: "AI Plan Synthesis",
    eyebrow: "Multi-Agent Planner",
    description:
      "Our AI Planning Agent analyzes millions of culinary combinations to craft a synchronized 7-day meal plan with zero dietary conflicts.",
    icon: HiCalendar,
    badgeColor: "bg-[#EAF7DE] text-[#65B82E] dark:bg-[#65B82E]/20 dark:text-[#86EFAC]",
    highlight: "21 Cohesive Balanced Meals",
    metrics: { label: "Dietary Match Rate", value: "99.8%" },
  },
  {
    id: "log",
    stepNumber: "03",
    title: "Visual Logging & Instant Classification",
    shortTitle: "Smart Food Logging",
    eyebrow: "Computer Vision & NLP",
    description:
      "Log meals with a quick photo or name. Our Classification Agent instantly tags the cuisine, estimates portion sizes, and extracts accurate macros.",
    icon: HiCamera,
    badgeColor: "bg-[#FEF3C7] text-[#92400E] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]",
    highlight: "Zero Manual Calculation",
    metrics: { label: "Confidence Score", value: "98.4%" },
  },
  {
    id: "analytics",
    stepNumber: "04",
    title: "Metabolic Analytics & AI Coaching",
    shortTitle: "Adaptive Analytics",
    eyebrow: "Continuous Intelligence",
    description:
      "Track daily adherence, identify micro and macro nutrient deficits, and receive predictive dietary suggestions to keep you consistently on course.",
    icon: HiTrendingUp,
    badgeColor: "bg-[#EEF7F3] text-[#007F78] dark:bg-[#1b2b28] dark:text-[#2DD4BF]",
    highlight: "Dynamic Daily Calibration",
    metrics: { label: "Adherence Boost", value: "+3.4x" },
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const currentStep = steps[activeStep];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-[#F7FAF8] to-white py-24 sm:py-32 dark:from-[#0c1211] dark:via-[#101918] dark:to-[#0c1211]">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -left-48 top-1/4 h-96 w-96 rounded-full bg-[#007F78]/10 blur-3xl dark:bg-[#007F78]/15" />
      <div className="pointer-events-none absolute -right-48 bottom-1/4 h-96 w-96 rounded-full bg-[#65B82E]/10 blur-3xl dark:bg-[#65B82E]/10" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-white px-4 py-1.5 shadow-xs dark:border-[#263835] dark:bg-[#161f1e]"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#007F78] animate-pulse dark:bg-[#2DD4BF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#007F78] dark:text-[#2DD4BF]">
              Autonomous Nutrition Workflow
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-3xl font-extrabold tracking-tight text-[#163330] sm:text-4xl lg:text-5xl dark:text-[#E8F2EF]"
          >
            From Preferences to Plate in{" "}
            <span className="bg-gradient-to-r from-[#007F78] via-[#00A896] to-[#65B82E] bg-clip-text text-transparent">
              Four Intelligent Steps
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg leading-relaxed text-[#55706B] dark:text-[#A1B8B3]"
          >
            Move past static spreadsheets and tedious calorie tracking. Experience how
            Nutri AI orchestrates meal planning, real-time computer vision logging, and
            metabolic coaching seamlessly.
          </motion.p>
        </div>

        {/* Interactive Step Navigator Tabs */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-[#DCE9E4] bg-white p-1.5 shadow-xs dark:border-[#263835] dark:bg-[#161f1e]">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-white shadow-sm"
                      : "text-[#55706B] hover:text-[#163330] dark:text-[#A1B8B3] dark:hover:text-[#E8F2EF]"
                  }`}
                  aria-selected={isActive}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeStepPill"
                      className="absolute inset-0 rounded-xl bg-[#007F78] dark:bg-[#007F78]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md text-[11px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#EEF7F3] text-[#007F78] dark:bg-[#1b2b28] dark:text-[#2DD4BF]"
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <span className="hidden md:inline">{step.shortTitle}</span>
                    <span className="inline md:hidden">{step.stepNumber}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero Interactive Spotlight Display */}
        <div className="mt-8 rounded-[2rem] border border-[#DCE9E4] bg-white p-6 sm:p-10 shadow-lg dark:border-[#263835] dark:bg-[#161f1e]">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left Content Area (5 Cols) */}
            <div className="flex flex-col gap-5 lg:col-span-5">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold ${currentStep.badgeColor}`}
                >
                  <currentStep.icon className="h-3.5 w-3.5" />
                  {currentStep.eyebrow}
                </span>
                <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">
                  Step {currentStep.stepNumber} of 04
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#163330] dark:text-[#E8F2EF]">
                {currentStep.title}
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#55706B] dark:text-[#A1B8B3]">
                {currentStep.description}
              </p>

              {/* Highlight & Live Metric Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] p-3 dark:border-[#263835] dark:bg-[#1b2b28]">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#849A95] dark:text-[#6E8883]">
                    Core Capability
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-[#163330] dark:text-[#E8F2EF]">
                    {currentStep.highlight}
                  </p>
                </div>
                <div className="rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] p-3 dark:border-[#263835] dark:bg-[#1b2b28]">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#849A95] dark:text-[#6E8883]">
                    {currentStep.metrics.label}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-[#007F78] dark:text-[#2DD4BF]">
                    {currentStep.metrics.value}
                  </p>
                </div>
              </div>

              {/* Action link */}
              <div className="pt-2">
                <Link
                  href={activeStep === 1 ? "/meal-plan" : "/meals"}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#007F78] hover:text-[#005F5A] dark:text-[#2DD4BF] dark:hover:text-[#5eead4] transition-colors !no-underline"
                >
                  <span>Experience this in the app</span>
                  <HiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Micro-UI Simulation Area (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-[#DCE9E4] bg-[#F7FAF8] p-5 sm:p-7 dark:border-[#263835] dark:bg-[#121918]">
                <AnimatePresence mode="wait">
                  {/* Step 1 Simulation: Target Profile & Macro Sliders */}
                  {activeStep === 0 && (
                    <motion.div
                      key="step-0"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-5"
                    >
                      <div className="flex items-center justify-between border-b border-[#DCE9E4] pb-3 dark:border-[#263835]">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#007F78]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-[#163330] dark:text-[#E8F2EF]">
                            Biometric Target Calculator
                          </span>
                        </div>
                        <span className="rounded-md bg-[#DDF5F0] px-2 py-0.5 text-xs font-bold text-[#007F78] dark:bg-[#007F78]/25 dark:text-[#2DD4BF]">
                          Live Calibration
                        </span>
                      </div>

                      {/* Goal Toggle Options */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#55706B] dark:text-[#A1B8B3]">
                          Primary Objective
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {["Weight Loss", "Maintain Weight", "Muscle Building"].map(
                            (goal, i) => (
                              <div
                                key={goal}
                                className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-colors ${
                                  i === 0
                                    ? "border-[#007F78] bg-[#DDF5F0] text-[#007F78] dark:border-[#2DD4BF] dark:bg-[#007F78]/25 dark:text-[#2DD4BF]"
                                    : "border-[#DCE9E4] bg-white text-[#55706B] dark:border-[#263835] dark:bg-[#161f1e] dark:text-[#A1B8B3]"
                                }`}
                              >
                                {goal}
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Dietary Filters Pill Row */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#55706B] dark:text-[#A1B8B3]">
                          Active Dietary Filters
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["High-Protein", "Gluten-Free", "Low-Sodium", "Halal"].map(
                            (tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-lg border border-[#007F78]/30 bg-white px-2.5 py-1 text-xs font-medium text-[#007F78] shadow-2xs dark:border-[#007F78]/50 dark:bg-[#161f1e] dark:text-[#2DD4BF]"
                              >
                                <HiCheckCircle className="h-3.5 w-3.5 text-[#65B82E]" />
                                {tag}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      {/* Calculated Daily Target & Macro Breakdown */}
                      <div className="rounded-xl border border-[#DCE9E4] bg-white p-4 shadow-xs dark:border-[#263835] dark:bg-[#161f1e]">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-[#163330] dark:text-[#E8F2EF]">
                            Synthesized Daily Target
                          </span>
                          <span className="text-base font-extrabold text-[#007F78] dark:text-[#2DD4BF]">
                            2,150 kcal
                          </span>
                        </div>
                        <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-[#EEF7F3] dark:bg-[#1b2b28]">
                          <div
                            className="bg-[#007F78] transition-all"
                            style={{ width: "35%" }}
                            title="Protein 35%"
                          />
                          <div
                            className="bg-[#F59E0B] transition-all"
                            style={{ width: "40%" }}
                            title="Carbs 40%"
                          />
                          <div
                            className="bg-[#EF4444] transition-all"
                            style={{ width: "25%" }}
                            title="Fat 25%"
                          />
                        </div>
                        <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-[#55706B] dark:text-[#A1B8B3]">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#007F78]" />
                            Protein: 188g (35%)
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                            Carbs: 215g (40%)
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
                            Fat: 60g (25%)
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 Simulation: 7-Day Autonomous Meal Plan */}
                  {activeStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex items-center justify-between border-b border-[#DCE9E4] pb-3 dark:border-[#263835]">
                        <div className="flex items-center gap-2">
                          <HiSparkles className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-[#163330] dark:text-[#E8F2EF]">
                            Weekly Schedule Synthesis
                          </span>
                        </div>
                        <span className="flex items-center gap-1 rounded-md bg-[#EAF7DE] px-2 py-0.5 text-xs font-bold text-[#65B82E] dark:bg-[#65B82E]/20">
                          <HiShieldCheck className="h-3.5 w-3.5" /> 7/7 Days Validated
                        </span>
                      </div>

                      {/* Mini Day-of-week bar */}
                      <div className="grid grid-cols-7 gap-1.5">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                          (day, i) => (
                            <div
                              key={day}
                              className={`rounded-lg py-1.5 text-center text-xs font-bold transition-all ${
                                i === 0
                                  ? "bg-[#007F78] text-white shadow-xs"
                                  : "border border-[#DCE9E4] bg-white text-[#55706B] dark:border-[#263835] dark:bg-[#161f1e] dark:text-[#A1B8B3]"
                              }`}
                            >
                              {day}
                            </div>
                          )
                        )}
                      </div>

                      {/* Featured AI Curated Meal Card */}
                      <div className="rounded-2xl border border-[#DCE9E4] bg-white p-4 shadow-sm dark:border-[#263835] dark:bg-[#161f1e]">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#DDF5F0] text-2xl dark:bg-[#007F78]/25">
                            🥗
                          </div>
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#007F78] dark:text-[#2DD4BF]">
                                Day 1 • Lunch
                              </span>
                              <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-bold text-[#92400E] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">
                                520 kcal
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-[#163330] dark:text-[#E8F2EF]">
                              Mediterranean Quinoa Power Bowl
                            </h4>
                            <div className="mt-1 flex items-center gap-2 text-xs text-[#55706B] dark:text-[#A1B8B3]">
                              <span>P: 36g</span>
                              <span>•</span>
                              <span>C: 54g</span>
                              <span>•</span>
                              <span>F: 18g</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] px-3 py-2 text-xs font-medium dark:border-[#263835] dark:bg-[#1b2b28]">
                          <span className="text-[#55706B] dark:text-[#A1B8B3]">
                            Generated ingredients list & preparation instructions
                          </span>
                          <span className="font-bold text-[#007F78] dark:text-[#2DD4BF]">
                            Ready to cook
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-[#EEF7F3] px-3.5 py-2.5 text-xs text-[#007F78] dark:bg-[#1b2b28] dark:text-[#2DD4BF]">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <HiLightningBolt className="h-4 w-4" />
                          Generated in 1.4s by AI Planning Agent
                        </span>
                        <span className="font-bold">PDF Ready</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 Simulation: Instant Photo & NLP Logging */}
                  {activeStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex items-center justify-between border-b border-[#DCE9E4] pb-3 dark:border-[#263835]">
                        <div className="flex items-center gap-2">
                          <HiCamera className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-[#163330] dark:text-[#E8F2EF]">
                            Computer Vision Classifier
                          </span>
                        </div>
                        <span className="rounded-md bg-[#DDF5F0] px-2 py-0.5 text-xs font-bold text-[#007F78] dark:bg-[#007F78]/25 dark:text-[#2DD4BF]">
                          98.6% Match
                        </span>
                      </div>

                      {/* Visual Scanner Simulation */}
                      <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-[#007F78]/30 bg-white p-4 shadow-sm dark:border-[#007F78]/50 dark:bg-[#161f1e]">
                        <div className="flex items-center gap-4">
                          <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-[#EEF7F3] text-4xl dark:bg-[#1b2b28]">
                            🥩
                            <div className="absolute inset-x-0 bottom-0 top-0 animate-pulse bg-[#007F78]/10" />
                          </div>
                          <div className="flex flex-1 flex-col gap-1">
                            <span className="inline-flex w-fit items-center gap-1 rounded-md bg-[#EAF7DE] px-2 py-0.5 text-[10px] font-bold text-[#65B82E] dark:bg-[#65B82E]/20">
                              <HiCheckCircle className="h-3 w-3" /> Auto-Identified
                            </span>
                            <h4 className="text-sm font-bold text-[#163330] dark:text-[#E8F2EF]">
                              Grilled Grass-Fed Flank Steak
                            </h4>
                            <p className="text-xs text-[#55706B] dark:text-[#A1B8B3]">
                              Cuisine: American • Portion: 240g
                            </p>
                          </div>
                        </div>

                        {/* Extracted Metrics Chips */}
                        <div className="mt-3 grid grid-cols-4 gap-2 pt-2 border-t border-[#DCE9E4] dark:border-[#263835]">
                          <div className="rounded-lg bg-[#F7FAF8] p-2 text-center dark:bg-[#1b2b28]">
                            <p className="text-[10px] text-[#849A95] dark:text-[#6E8883]">Calories</p>
                            <p className="text-xs font-bold text-[#163330] dark:text-[#E8F2EF]">460</p>
                          </div>
                          <div className="rounded-lg bg-[#DDF5F0] p-2 text-center dark:bg-[#007F78]/25">
                            <p className="text-[10px] text-[#007F78] dark:text-[#2DD4BF]">Protein</p>
                            <p className="text-xs font-bold text-[#007F78] dark:text-[#2DD4BF]">52g</p>
                          </div>
                          <div className="rounded-lg bg-[#FEF3C7] p-2 text-center dark:bg-[#F59E0B]/20">
                            <p className="text-[10px] text-[#92400E] dark:text-[#FCD34D]">Carbs</p>
                            <p className="text-xs font-bold text-[#92400E] dark:text-[#FCD34D]">0g</p>
                          </div>
                          <div className="rounded-lg bg-red-50 p-2 text-center dark:bg-red-500/10">
                            <p className="text-[10px] text-red-600 dark:text-red-400">Fat</p>
                            <p className="text-xs font-bold text-red-600 dark:text-red-400">26g</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-[#DCE9E4] bg-white p-3 text-xs text-[#55706B] dark:border-[#263835] dark:bg-[#161f1e] dark:text-[#A1B8B3]">
                        <span className="font-bold text-[#163330] dark:text-[#E8F2EF]">
                          Instant Sync:
                        </span>{" "}
                        Logged to daily metabolic diary and re-balances remaining meals.
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4 Simulation: Metabolic Analytics & AI Insights */}
                  {activeStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex items-center justify-between border-b border-[#DCE9E4] pb-3 dark:border-[#263835]">
                        <div className="flex items-center gap-2">
                          <HiChartBar className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-[#163330] dark:text-[#E8F2EF]">
                            Metabolic Adherence Gauge
                          </span>
                        </div>
                        <span className="rounded-md bg-[#EAF7DE] px-2 py-0.5 text-xs font-bold text-[#65B82E] dark:bg-[#65B82E]/20">
                          Score: 96 / 100
                        </span>
                      </div>

                      {/* Daily Adherence Progress */}
                      <div className="rounded-2xl border border-[#DCE9E4] bg-white p-4 shadow-sm dark:border-[#263835] dark:bg-[#161f1e]">
                        <div className="flex items-center justify-between text-xs font-bold text-[#163330] dark:text-[#E8F2EF]">
                          <span>Daily Target Completion</span>
                          <span className="text-[#007F78] dark:text-[#2DD4BF]">
                            1,880 / 2,150 kcal (87%)
                          </span>
                        </div>
                        <div className="mt-2.5 h-2.5 w-full rounded-full bg-[#EEF7F3] dark:bg-[#1b2b28]">
                          <div
                            className="h-2.5 rounded-full bg-gradient-to-r from-[#007F78] to-[#65B82E]"
                            style={{ width: "87%" }}
                          />
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] p-2 dark:border-[#263835] dark:bg-[#1b2b28]">
                            <p className="text-[10px] text-[#849A95] dark:text-[#6E8883]">Protein</p>
                            <p className="font-bold text-[#007F78] dark:text-[#2DD4BF]">172g / 188g</p>
                          </div>
                          <div className="rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] p-2 dark:border-[#263835] dark:bg-[#1b2b28]">
                            <p className="text-[10px] text-[#849A95] dark:text-[#6E8883]">Carbs</p>
                            <p className="font-bold text-[#F59E0B]">190g / 215g</p>
                          </div>
                          <div className="rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] p-2 dark:border-[#263835] dark:bg-[#1b2b28]">
                            <p className="text-[10px] text-[#849A95] dark:text-[#6E8883]">Fat</p>
                            <p className="font-bold text-red-500">54g / 60g</p>
                          </div>
                        </div>
                      </div>

                      {/* AI Coach Recommendation Card */}
                      <div className="flex items-start gap-3 rounded-2xl border border-[#007F78]/30 bg-[#DDF5F0] p-3.5 dark:border-[#007F78]/50 dark:bg-[#007F78]/20">
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#007F78] text-white">
                          <HiSparkles className="h-4 w-4" />
                        </span>
                        <div className="flex flex-col">
                          <p className="text-xs font-bold text-[#007F78] dark:text-[#2DD4BF]">
                            AI Dietary Recommendation
                          </p>
                          <p className="mt-0.5 text-xs text-[#163330] dark:text-[#E8F2EF]">
                            &ldquo;You are 16g short on protein today. Add 1 cup of Greek yogurt or a protein shake to reach 100% target alignment.&rdquo;
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Connected Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const isCurrent = activeStep === index;
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.id}
                onClick={() => setActiveStep(index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-6 transition-all duration-300 ${
                  isCurrent
                    ? "border-[#007F78] bg-white shadow-md ring-2 ring-[#007F78]/20 dark:border-[#2DD4BF] dark:bg-[#161f1e] dark:ring-[#2DD4BF]/20"
                    : "border-[#DCE9E4] bg-white/70 hover:-translate-y-1 hover:border-[#007F78]/40 hover:bg-white hover:shadow-sm dark:border-[#263835] dark:bg-[#161f1e]/60 dark:hover:bg-[#161f1e]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold transition-transform group-hover:scale-105 ${
                        isCurrent
                          ? "bg-[#007F78] text-white shadow-xs"
                          : "bg-[#EEF7F3] text-[#007F78] dark:bg-[#1b2b28] dark:text-[#2DD4BF]"
                      }`}
                    >
                      <StepIcon className="h-5 w-5" />
                    </span>
                    <span className="text-xl font-extrabold text-[#DCE9E4] transition-colors group-hover:text-[#007F78]/40 dark:text-[#263835] dark:group-hover:text-[#2DD4BF]/40">
                      {step.stepNumber}
                    </span>
                  </div>

                  <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-[#007F78] dark:text-[#2DD4BF]">
                    {step.eyebrow}
                  </p>
                  <h4 className="mt-1 text-base font-bold text-[#163330] dark:text-[#E8F2EF]">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-[#55706B] dark:text-[#A1B8B3]">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-[#007F78] dark:text-[#2DD4BF]">
                  <span>{isCurrent ? "Currently Active" : "Click to inspect"}</span>
                  <HiArrowRight className={`h-3.5 w-3.5 transition-transform ${isCurrent ? "translate-x-1" : "group-hover:translate-x-1"}`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#DCE9E4] bg-gradient-to-r from-[#DDF5F0]/60 via-white to-[#EAF7DE]/60 p-6 sm:p-8 sm:flex-row dark:border-[#263835] dark:from-[#007F78]/10 dark:via-[#161f1e] dark:to-[#65B82E]/10"
        >
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-[#163330] dark:text-[#E8F2EF]">
              Ready to generate your personalized 7-day plan?
            </h4>
            <p className="text-xs sm:text-sm text-[#55706B] dark:text-[#A1B8B3]">
              Join thousands who rely on Nutri AI to eliminate guesswork and master daily nutrition.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link href="/meal-plan" className="!no-underline">
              <button className="flex items-center gap-2 rounded-xl bg-[#007F78] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#005F5A] transition-colors cursor-pointer">
                <HiSparkles className="h-4 w-4" />
                Generate Meal Plan
              </button>
            </Link>
            <Link href="/meals" className="!no-underline">
              <button className="flex items-center gap-2 rounded-xl border border-[#DCE9E4] bg-white px-4 py-2.5 text-sm font-semibold text-[#163330] hover:bg-[#EEF7F3] dark:border-[#263835] dark:bg-[#161f1e] dark:text-[#E8F2EF] dark:hover:bg-[#1b2b28] transition-colors cursor-pointer">
                Explore Database
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
