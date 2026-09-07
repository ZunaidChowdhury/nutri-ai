"use client";

import { motion } from "framer-motion";
import { HiFire, HiUserGroup, HiClipboardList, HiSparkles } from "react-icons/hi";

const stats = [
  {
    icon: HiFire,
    value: "25,000+",
    label: "Meals Logged & Analyzed",
    badge: "Real-time AI analysis",
    bgClass: "bg-[#FFFBEB] dark:bg-[#F59E0B]/20",
    textClass: "text-[#F59E0B]",
  },
  {
    icon: HiClipboardList,
    value: "8,500+",
    label: "Custom Meal Plans Generated",
    badge: "Personalized macros",
    bgClass: "bg-[#DDF5F0] dark:bg-accent/20",
    textClass: "text-[#007F78] dark:text-accent",
  },
  {
    icon: HiUserGroup,
    value: "1,200+",
    label: "Active Health Seekers",
    badge: "Growing community",
    bgClass: "bg-[#EAF7DE] dark:bg-[#65B82E]/20",
    textClass: "text-[#65B82E]",
  },
  {
    icon: HiSparkles,
    value: "98.4%",
    label: "Nutritional Accuracy",
    badge: "Validated by data",
    bgClass: "bg-[#EEF7F3] dark:bg-surface-secondary",
    textClass: "text-[#007F78] dark:text-accent",
  },
];

export default function StatsSection() {
  return (
    <section className="w-full bg-[#F7FAF8] py-20 sm:py-24 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#007F78] shadow-sm mb-4 dark:border-border dark:bg-surface-secondary dark:text-accent">
            <span>Proven Impact</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#163330] sm:text-4xl dark:text-foreground">
            Growing Stronger Every Day
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#55706B] dark:text-muted">
            Empowering individuals to take control of their nutrition with data-driven AI intelligence and habit tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center rounded-[1.25rem] border border-[#DCE9E4] bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#007F78]/30 dark:border-border dark:bg-[#1a1a1a]"
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bgClass}`}>
                <stat.icon className={`h-7 w-7 ${stat.textClass}`} />
              </div>
              <span className="text-3xl font-extrabold tracking-tight text-[#163330] dark:text-foreground">
                {stat.value}
              </span>
              <span className="mt-1 font-semibold text-[#163330] dark:text-foreground/90">
                {stat.label}
              </span>
              <span className="mt-2 text-xs font-medium text-[#55706B] dark:text-muted">
                {stat.badge}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
