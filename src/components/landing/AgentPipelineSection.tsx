"use client";

import { motion } from "framer-motion";
import { HiSparkles, HiArrowRight, HiDatabase, HiAdjustments, HiShieldCheck } from "react-icons/hi";

const pipelineStages = [
  {
    step: "Stage 01",
    agent: "User Profile & Biometrics",
    role: "Target Calibration",
    description: "Captures your basal metabolic rate (BMR), macro split, taste preferences, and food allergies.",
    metrics: "BMR + Activity Formula",
    tagColor: "bg-[#DDF5F0] text-[#007F78] dark:bg-accent/20 dark:text-accent",
  },
  {
    step: "Stage 02",
    agent: "Meal Planning Agent",
    role: "Autonomous Scheduler",
    description: "Evaluates hundreds of validated recipes and crafts a harmonious 7-day menu with zero macro gaps.",
    metrics: "21 Meals / 7 Days",
    tagColor: "bg-[#DDF5F0] text-[#007F78] dark:bg-accent/20 dark:text-accent",
  },
  {
    step: "Stage 03",
    agent: "Food Classifier Agent",
    role: "Vision & Tagging",
    description: "Classifies each meal by cuisine origin, confidence rating, and dietary suitability.",
    metrics: "99.4% Accuracy",
    tagColor: "bg-[#EAF7DE] text-[#65B82E] dark:bg-[#65B82E]/20 dark:text-[#65B82E]",
  },
  {
    step: "Stage 04",
    agent: "Nutrition Insights Agent",
    role: "Continuous Optimization",
    description: "Monitors daily logged intake against your targets, recommending timely nutrient adjustments.",
    metrics: "Real-time Recalibration",
    tagColor: "bg-[#FFFBEB] text-[#F59E0B] dark:bg-[#F59E0B]/20 dark:text-[#F59E0B]",
  },
];

export default function AgentPipelineSection() {
  return (
    <section className="w-full bg-[#EEF7F3] py-20 sm:py-28 dark:bg-[#0c1613]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#007F78] shadow-xs dark:border-border dark:bg-surface-secondary dark:text-accent">
            <HiAdjustments className="h-3.5 w-3.5" />
            <span>Behind the Scenes</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#163330] sm:text-4xl lg:text-5xl dark:text-foreground">
            How Our Tri-Agent Engine Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-[#55706B] dark:text-muted">
            Three autonomous AI agents operate in synchronized harmony to deliver flawless nutritional precision.
          </p>
        </div>

        {/* Pipeline Cards with Connection Visuals */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="absolute left-[8%] right-[8%] top-1/2 -translate-y-1/2 hidden lg:block h-0.5 border-t-2 border-dashed border-[#007F78]/30 dark:border-accent/30 pointer-events-none" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pipelineStages.map((stage, idx) => (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="relative z-10 flex flex-col justify-between rounded-[1.75rem] border border-[#DCE9E4] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#007F78]/40 hover:shadow-lg dark:border-border dark:bg-[#14201c]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold tracking-wider text-[#849A95] uppercase dark:text-muted">
                      {stage.step}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${stage.tagColor}`}>
                      {stage.metrics}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-[#163330] dark:text-foreground">
                    {stage.agent}
                  </h3>
                  <p className="text-xs font-semibold text-[#007F78] dark:text-accent">
                    {stage.role}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-[#55706B] dark:text-muted">
                    {stage.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 border-t border-[#DCE9E4] pt-4 text-[11px] font-semibold text-[#55706B] dark:border-border dark:text-muted">
                  <HiShieldCheck className="h-3.5 w-3.5 text-[#65B82E]" />
                  <span>Continuous Validation</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Banner inside Section */}
        <div className="mt-12 rounded-2xl border border-[#DCE9E4] bg-white/70 p-5 backdrop-blur-xs text-center dark:border-border dark:bg-surface-secondary/50">
          <p className="text-xs sm:text-sm font-medium text-[#163330] dark:text-foreground">
            ⚡ Powered by Groq Llama-3 high-speed inference for instant sub-second plan generation.
          </p>
        </div>
      </div>
    </section>
  );
}
