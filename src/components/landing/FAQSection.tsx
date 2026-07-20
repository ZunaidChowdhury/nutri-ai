"use client";

import { Accordion, AccordionItem } from "@heroui/react";

const faqs = [
  {
    question: "How does the meal planning agent work?",
    answer:
      "Tell us your goals, dietary restrictions, budget, and calorie target. The agent searches our meal database, checks nutritional balance, and generates a customized 7-day plan tailored to you.",
  },
  {
    question: "Is my nutrition data private?",
    answer:
      "Yes. Your meal history and nutrition reports are private to your account. We never share your personal data or eating patterns with third parties.",
  },
  {
    question: "Can I use NutriAI for free?",
    answer:
      "Absolutely. NutriAI is completely free to use. There are no paid tiers or subscription fees — all features including AI analysis are available at no cost.",
  },
  {
    question: "What dietary restrictions do you support?",
    answer:
      "We support all major dietary patterns including vegan, vegetarian, gluten-free, dairy-free, keto, paleo, and low-carb. You can also specify custom restrictions.",
  },
  {
    question: "How accurate is the nutrition analysis?",
    answer:
      "Our analysis is based on your logged meals and standard nutritional databases. It provides a helpful overview and pattern detection, but should not replace professional medical advice.",
  },
  {
    question: "Can I override the AI food classification?",
    answer:
      "Yes. The Food Classification Agent suggests a cuisine tag with a confidence score, but you always have the final say. Your manual selection takes priority over the AI suggestion.",
  },
];

export default function FAQSection() {
  return (
    <section className="px-4 py-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-2 text-center text-3xl font-bold">
          Frequently Asked Questions
        </h2>
        <p className="mb-10 text-center text-foreground/60">
          Everything you need to know about NutriAI
        </p>

        <Accordion variant="bordered">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              aria-label={faq.question}
              title={faq.question}
            >
              {faq.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
