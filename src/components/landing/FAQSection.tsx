"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";

const faqs = [
  {
    question: "How does the AI Meal Planning Agent customize my plan?",
    answer:
      "When you set your fitness goals, dietary restrictions, calorie targets, and budget, the Meal Planning agent scans verified nutritional datasets. It balances macro and micronutrients over 7 days while eliminating allergens and ensuring meal diversity so you never get bored.",
    category: "Meal Planning",
  },
  {
    question: "How does the Meal Analyzer track nutritional intake?",
    answer:
      "Every meal you log is evaluated by our Nutrition Analyzer. It calculates macronutrients (proteins, carbs, fats), micronutrient balance, and calorie densities, comparing your daily intake against your custom health targets in real-time.",
  },
  {
    question: "Can I manually override AI classifications and suggestions?",
    answer:
      "Always. The AI suggests cuisines, categories, and nutritional tags with confidence scores, but you maintain full control. You can edit any meal, swap dishes, adjust portion sizes, or add custom notes anytime.",
  },
  {
    question: "Is NutriAI free to use, and is my data secure?",
    answer:
      "NutriAI is completely free to use with all AI features included. Your meal logs, biometric targets, and personal eating patterns are strictly private to your account and never monetized or shared with third parties.",
  },
  {
    question: "What dietary patterns and preferences are supported?",
    answer:
      "We support vegan, vegetarian, pescatarian, keto, paleo, gluten-free, dairy-free, low-FODMAP, high-protein athletic, and diabetic-conscious profiles. You can also specify custom food exclusions.",
  },
  {
    question: "Can I log and share my own recipes with the community?",
    answer:
      "Yes! You can add custom meals with your own ingredients, instructions, and photos. You can choose whether to keep them private to your plan or publish them for the NutriAI community to explore.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#F7FAF8] py-20 sm:py-24 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#007F78] shadow-sm mb-4 dark:border-border dark:bg-surface-secondary dark:text-accent">
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#163330] sm:text-4xl dark:text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 text-lg text-[#55706B] dark:text-muted">
              Everything you need to know about our AI agents, nutrition science, and privacy.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className={`rounded-[1.25rem] border bg-white transition-all duration-200 overflow-hidden dark:bg-[#1a1a1a] ${
                    isOpen
                      ? "border-[#007F78]/40 shadow-sm dark:border-accent/40"
                      : "border-[#DCE9E4] hover:border-[#007F78]/20 dark:border-border"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-center justify-between p-6 text-left font-semibold text-[#163330] transition-colors hover:text-[#007F78] dark:text-foreground dark:hover:text-accent cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg pr-4">{faq.question}</span>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${
                        isOpen
                          ? "rotate-180 bg-[#DDF5F0] text-[#007F78] dark:bg-accent/20 dark:text-accent"
                          : "bg-[#F7FAF8] text-[#55706B] dark:bg-surface-secondary dark:text-muted"
                      }`}
                    >
                      <HiChevronDown className="h-5 w-5" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="border-t border-[#DCE9E4]/60 px-6 pb-6 pt-4 text-sm sm:text-base leading-relaxed text-[#55706B] dark:border-border/60 dark:text-muted">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}