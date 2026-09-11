"use client";

import { motion } from "framer-motion";
import {
  HiSparkles,
  HiLightningBolt,
  HiChartPie,
  HiCheck,
  HiTag,
  HiClipboardList,
} from "react-icons/hi";

const agents = [
  {
    id: "AGENT 01",
    endpoint: "/agents/meal-planning",
    title: "Meal Planning Agent",
    subtitle: "Personalized 7-Day Schedule Generator",
    description:
      "Crafts a complete 7-day roadmap (21 meals) tailored to your goal, calorie target, budget, and dietary restrictions, pulling from either the global catalog or your saved meals.",
    accentColor: "#007F78",
    badgeBg: "bg-[#DDF5F0] text-[#007F78] dark:bg-[#007F78]/20 dark:text-[#2DD4BF]",
    icon: HiSparkles,
    iconBg: "bg-[#DDF5F0] text-[#007F78] dark:bg-[#007F78]/25 dark:text-[#2DD4BF]",
    pulseColor: "bg-[#007F78] dark:bg-[#2DD4BF]",
    realFeatures: [
      "Goal-based (Lose, Maintain, Gain)",
      "Dietary restrictions & budget levels",
      "PDF export & direct meal logging",
    ],
    simulation: {
      type: "planner",
      heading: "Generated Plan · Day 1",
      calorieTarget: "2,000 kcal target",
      meals: [
        { name: "Oatmeal with Berries", cal: "420 kcal", p: "18g", c: "64g", f: "10g" },
        { name: "Grilled Chicken & Quinoa", cal: "680 kcal", p: "48g", c: "52g", f: "16g" },
        { name: "Baked Salmon & Greens", cal: "610 kcal", p: "42g", c: "22g", f: "24g" },
      ],
      footerNote: "3 meals/day · 21 meals total · PDF exportable",
    },
  },
  {
    id: "AGENT 02",
    endpoint: "/agents/food-classification",
    title: "Food Classification Agent",
    subtitle: "Automatic Cuisine & Tag Predictor",
    description:
      "Analyzes meal titles and recipe descriptions when you add or manage meals, automatically detecting cuisine origin with confidence scoring to keep your library organized.",
    accentColor: "#65B82E",
    badgeBg: "bg-[#EAF7DE] text-[#166534] dark:bg-[#65B82E]/20 dark:text-[#86EFAC]",
    icon: HiTag,
    iconBg: "bg-[#EAF7DE] text-[#65B82E] dark:bg-[#65B82E]/25 dark:text-[#86EFAC]",
    pulseColor: "bg-[#65B82E]",
    realFeatures: [
      "Natural language recipe classification",
      "Instant cuisine tag assignment",
      "Confidence percentage scoring",
    ],
    simulation: {
      type: "classification",
      heading: "Meal Classification Result",
      inputTitle: "Garlic Butter Shrimp Rice Bowl",
      inputDesc: "Sauteed wild shrimp over steamed jasmine rice with herbs...",
      predictedTag: "Mediterranean",
      confidence: "96% confidence",
      footerNote: "Automates tag selection in /items/add",
    },
  },
  {
    id: "AGENT 03",
    endpoint: "/agents/nutrition-analysis",
    title: "Nutrition Analysis Agent",
    subtitle: "30-Day Dietary Audit & Guidance",
    description:
      "Evaluates your 30-day food log history directly from your dashboard to diagnose intake habits, highlight nutrient deficiencies, and recommend dietary improvements.",
    accentColor: "#F59E0B",
    badgeBg: "bg-[#FEF3C7] text-[#92400E] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]",
    icon: HiChartPie,
    iconBg: "bg-[#FEF3C7] text-[#F59E0B] dark:bg-[#F59E0B]/25 dark:text-[#FCD34D]",
    pulseColor: "bg-[#F59E0B]",
    realFeatures: [
      "Executive summary of 30-day intake",
      "Nutrient deficiency detection",
      "Targeted dietary suggestions",
    ],
    simulation: {
      type: "analysis",
      heading: "AI Nutrition Diagnostic",
      summary: "Calorie intake is well-aligned with your target, but micronutrient variety is low.",
      deficiencies: ["Iron", "Vitamin D", "Fiber"],
      suggestion: "Incorporate spinach, fortified cereals, or salmon to bridge identified gaps.",
      footerNote: "Runs directly from user dashboard logs",
    },
  },
];

export default function AgentSpotlightSection() {
  return (
    <section className="relative w-full bg-[#F7FAF8] py-20 sm:py-28 dark:bg-[#0c1613] overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#007F78]/10 via-[#65B82E]/10 to-[#F59E0B]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#007F78] shadow-xs dark:border-[#263835] dark:bg-[#161f1e] dark:text-[#2DD4BF]"
          >
            <HiSparkles className="h-4 w-4" />
            <span>AI Architecture</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-extrabold tracking-tight text-[#163330] sm:text-4xl lg:text-5xl dark:text-[#E8F2EF]"
          >
            The Intelligence Behind Nutri AI
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-[#55706B] dark:text-[#A1B8B3]"
          >
            Three specialized AI agents power your nutrition workflow—generating personalized meal plans, organizing your recipe catalog, and auditing your health history.
          </motion.p>
        </div>

        {/* 3-Agent Cards Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative flex flex-col justify-between rounded-[2rem] border border-[#DCE9E4] bg-white p-7 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-[#263835] dark:bg-[#151f1c]"
              >
                {/* Card Content Top */}
                <div>
                  {/* Agent Tag & Endpoint */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold tracking-wider text-[#849A95] dark:text-[#6E8883]">
                      {agent.id}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${agent.badgeBg}`}>
                      {agent.endpoint}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="mt-6 flex items-start gap-4">
                    <div className={`flex h-13 w-13 items-center justify-center rounded-2xl flex-shrink-0 shadow-xs ${agent.iconBg}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-[#163330] dark:text-[#E8F2EF] tracking-tight">
                        {agent.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#007F78] dark:text-[#2DD4BF] mt-0.5">
                        {agent.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#55706B] dark:text-[#A1B8B3]">
                    {agent.description}
                  </p>

                  {/* Micro-UI Simulation representing actual feature outputs */}
                  <div className="mt-6 rounded-2xl border border-[#DCE9E4] bg-[#F7FAF8] p-4 dark:border-[#263835] dark:bg-[#1a2824]/60">
                    <div className="flex items-center justify-between border-b border-[#DCE9E4]/70 dark:border-[#263835] pb-2 text-xs font-bold text-[#163330] dark:text-[#E8F2EF]">
                      <span className="flex items-center gap-1.5 truncate">
                        <span className={`h-2 w-2 rounded-full ${agent.pulseColor}`} />
                        {agent.simulation.heading}
                      </span>
                    </div>

                    {/* Agent 1: Meal Plan preview */}
                    {agent.simulation.type === "planner" && (
                      <div className="mt-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[11px] text-[#55706B] dark:text-[#A1B8B3]">
                          <span>Daily Target</span>
                          <span className="font-bold text-[#007F78] dark:text-[#2DD4BF]">
                            {agent.simulation.calorieTarget}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5 pt-0.5">
                          {agent.simulation.meals?.map((m) => (
                            <div
                              key={m.name}
                              className="flex items-center justify-between text-[11px] bg-white dark:bg-[#121918] p-1.5 rounded-lg border border-[#DCE9E4]/60 dark:border-[#263835]"
                            >
                              <span className="font-medium text-[#163330] dark:text-[#E8F2EF] truncate max-w-[130px]">
                                {m.name}
                              </span>
                              <div className="flex items-center gap-1.5 text-[10px] text-[#849A95]">
                                <span>{m.cal}</span>
                                <span className="text-[#007F78] font-semibold">P:{m.p}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Agent 2: Food classification preview */}
                    {agent.simulation.type === "classification" && (
                      <div className="mt-3 flex flex-col gap-2">
                        <div className="text-[11px] bg-white dark:bg-[#121918] p-2 rounded-lg border border-[#DCE9E4]/60 dark:border-[#263835]">
                          <p className="font-semibold text-[#163330] dark:text-[#E8F2EF] truncate">
                            &quot;{agent.simulation.inputTitle}&quot;
                          </p>
                          <p className="text-[10px] text-[#849A95] dark:text-[#6E8883] truncate mt-0.5">
                            {agent.simulation.inputDesc}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#EAF7DE] text-[#166534] dark:bg-[#65B82E]/20 dark:text-[#86EFAC]">
                            Tag: {agent.simulation.predictedTag}
                          </span>
                          <span className="text-[11px] font-semibold text-[#65B82E]">
                            {agent.simulation.confidence}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Agent 3: Nutrition analysis report preview */}
                    {agent.simulation.type === "analysis" && (
                      <div className="mt-3 flex flex-col gap-2">
                        <p className="text-[11px] text-[#55706B] dark:text-[#A1B8B3] leading-snug">
                          {agent.simulation.summary}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          <span className="text-[10px] font-bold text-[#92400E] dark:text-[#FCD34D]">
                            Deficiencies:
                          </span>
                          {agent.simulation.deficiencies?.map((d) => (
                            <span
                              key={d}
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FEF3C7] text-[#92400E] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-[#007F78] dark:text-[#2DD4BF] font-medium bg-[#DDF5F0]/60 dark:bg-[#007F78]/15 p-1.5 rounded-lg">
                          Tip: {agent.simulation.suggestion}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Real Feature Bullet Points */}
                  <div className="mt-5 flex flex-col gap-1.5">
                    {agent.realFeatures.map((feat) => (
                      <span
                        key={feat}
                        className="inline-flex items-center gap-1.5 text-[11px] text-[#55706B] dark:text-[#A1B8B3]"
                      >
                        <HiCheck className="h-3.5 w-3.5 text-[#007F78] dark:text-[#2DD4BF] flex-shrink-0" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Footer Note */}
                <div className="mt-6 pt-3.5 border-t border-[#DCE9E4]/80 dark:border-[#263835] text-[11px] font-medium text-[#849A95] dark:text-[#6E8883]">
                  {agent.simulation.footerNote}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}