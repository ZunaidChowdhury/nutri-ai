"use client";

import { motion } from "framer-motion";
import { HiStar } from "react-icons/hi";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marathon Runner & Tech Lead",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    quote:
      "NutriAI completely changed how I approach fueling my training. The meal planning agent saves me hours every week and tailors my carb-to-protein ratio seamlessly around long runs.",
    highlight: "Saved 4+ hours every week",
    tag: "Meal Planner User",
  },
  {
    name: "Marcus Johnson",
    role: "Software Architect",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    quote:
      "I never realized how unbalanced my micronutrients were until the Nutrition Analysis agent broke it down. Clear feedback, no guilt trips, just data that made me feel more energetic.",
    highlight: "Sustained daily energy",
    tag: "Nutrition Insights User",
  },
  {
    name: "Priya Patel",
    role: "Plant-Based Nutritionist",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    quote:
      "The automatic meal classification and ingredient transparency are remarkable. It makes it painless to recommend nutritious recipes to clients with strict dietary constraints.",
    highlight: "Unmatched ingredient accuracy",
    tag: "Meal Analyzer User",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full bg-white py-20 sm:py-24 dark:bg-background">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-[#F7FAF8] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#007F78] shadow-sm mb-4 dark:border-border dark:bg-surface-secondary dark:text-accent">
            <span>Real Results</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#163330] sm:text-4xl dark:text-foreground">
            Loved by Everyday Health Seekers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#55706B] dark:text-muted">
            See how our AI agents help real people reach their wellness and nutritional goals effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex flex-col justify-between rounded-[1.25rem] border border-[#DCE9E4] bg-[#F7FAF8] p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#007F78]/30 dark:border-border dark:bg-[#1a1a1a]"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-1 text-[#F59E0B]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HiStar key={i} className="h-4 w-4" />
                    ))}
                  </div>
                  <span className="rounded-full bg-[#DDF5F0] px-2.5 py-0.5 text-xs font-semibold text-[#007F78] dark:bg-accent/20 dark:text-accent">
                    {t.tag}
                  </span>
                </div>

                <div className="mb-4 inline-block rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#163330] shadow-xs dark:bg-surface-secondary dark:text-foreground">
                  ✨ {t.highlight}
                </div>

                <p className="text-sm leading-relaxed text-[#55706B] dark:text-muted">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-[#DCE9E4] pt-4 dark:border-border">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-[#007F78]/20"
                />
                <div>
                  <p className="text-sm font-bold text-[#163330] dark:text-foreground">{t.name}</p>
                  <p className="text-xs text-[#55706B] dark:text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}