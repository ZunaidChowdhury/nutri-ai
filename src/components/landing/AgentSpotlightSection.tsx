"use client";

import { motion } from "framer-motion";
import { HiSparkles, HiLightningBolt, HiChartPie } from "react-icons/hi";

const agents = [
  {
    icon: HiSparkles,
    title: "AI Meal Planner",
    description:
      "Creates personalized 7-day meal plans based on your goals, dietary restrictions, budget, and calorie targets using advanced optimization.",
    bgClass: "bg-[#DDF5F0] dark:bg-accent/20",
    textClass: "text-[#007F78] dark:text-accent",
  },
  {
    icon: HiLightningBolt,
    title: "Meal Analyzer",
    description:
      "Analyzes your weekly eating patterns, identifies nutritional gaps, and provides actionable recommendations for a balanced diet.",
    bgClass: "bg-[#EAF7DE] dark:bg-[#65B82E]/20",
    textClass: "text-[#65B82E] dark:text-[#65B82E]",
  },
  {
    icon: HiChartPie,
    title: "Nutrition Insights",
    description:
      "Automatically classifies meals and extracts deep insights with confidence scoring, helping you organize and discover patterns in your habits.",
    bgClass: "bg-[#FFFBEB] dark:bg-[#F59E0B]/20",
    textClass: "text-[#F59E0B] dark:text-[#F59E0B]",
  },
];

export default function AgentSpotlightSection() {
  return (
    <section className="w-full bg-[#EEF7F3] px-4 py-20 sm:py-24 md:px-8 lg:px-8 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#163330] sm:text-4xl dark:text-foreground">
            The Intelligence Behind Nutri AI
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#55706B] dark:text-muted">
            Three specialized agents working together to optimize your nutrition, save you time, and keep you on track.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group flex flex-col items-center rounded-[1.25rem] border border-[#DCE9E4] bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-border dark:bg-[#1a1a1a]"
            >
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${agent.bgClass}`}>
                <agent.icon className={`h-8 w-8 ${agent.textClass}`} />
              </div>
              <h3 className="mb-4 text-xl font-bold text-[#163330] dark:text-foreground">
                {agent.title}
              </h3>
              <p className="text-base leading-relaxed text-[#55706B] dark:text-muted">
                {agent.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}