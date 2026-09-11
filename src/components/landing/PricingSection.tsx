"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiCheck, HiSparkles, HiShieldCheck } from "react-icons/hi";

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      name: "Starter",
      id: "starter",
      badge: "Free Access",
      badgeClass: "bg-[#EEF7F3] text-[#007F78] dark:bg-[#007F78]/20 dark:text-[#2DD4BF]",
      description: "Essential AI meal planning & calorie tracking to kickstart your wellness routine.",
      price: "$0",
      period: "forever free",
      popular: false,
      buttonText: "Get Started Free",
      buttonHref: "/signup",
      buttonVariant: "secondary",
      features: [
        "1 Active 7-Day AI Meal Plan",
        "Daily food logging & calorie tracking",
        "Personal recipe catalog (up to 30 meals)",
        "Automatic AI cuisine classification on add",
        "Standard weekly PDF meal plan export",
      ],
    },
    {
      name: "Pro Nutritionist",
      id: "pro",
      badge: "Most Popular",
      badgeClass: "bg-[#007F78] text-white shadow-sm",
      description: "Unlimited AI roadmaps, deep 30-day deficit audits, and personalized dietary guidance.",
      price: billingCycle === "yearly" ? "$9" : "$12",
      period: billingCycle === "yearly" ? "per month, billed annually" : "per month, billed monthly",
      popular: true,
      buttonText: "Start Your Journey",
      buttonHref: "/signup",
      buttonVariant: "primary",
      features: [
        "Unlimited 7-Day AI Meal Plan generations",
        "30-Day AI Nutrition Deficit Audits (/dashboard)",
        "Unlimited recipe catalog & bookmarking",
        "All 9 dietary restriction filters (Keto, Vegan, Halal, etc.)",
        "Goal-based calorie & macro calibration",
        "1-Click meal logging directly from plan",
        "Community recipe catalog access",
        "Instant PDF export with ingredients & instructions",
      ],
    },
    {
      name: "Lifetime Pass",
      id: "lifetime",
      badge: "Best Value",
      badgeClass: "bg-[#FEF3C7] text-[#92400E] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]",
      description: "Pay once, enjoy permanent access to all current and future AI agent features.",
      price: "$99",
      period: "one-time payment, lifetime access",
      popular: false,
      buttonText: "Claim Lifetime Access",
      buttonHref: "/signup",
      buttonVariant: "secondary",
      features: [
        "Everything in Pro Nutritionist included",
        "Lifetime access — zero recurring monthly fees",
        "Priority AI agent processing queue",
        "Unlimited custom recipes & image uploads",
        "Multi-week plan history & archive",
        "Early access to upcoming AI agent upgrades",
      ],
    },
  ];

  return (
    <section className="relative w-full bg-[#F7FAF8] py-20 sm:py-28 dark:bg-[#0c1613] overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#007F78]/10 via-[#65B82E]/10 to-[#F59E0B]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#007F78] shadow-xs dark:border-[#263835] dark:bg-[#161f1e] dark:text-[#2DD4BF]"
          >
            <HiSparkles className="h-4 w-4" />
            <span>Transparent Pricing</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-extrabold tracking-tight text-[#163330] sm:text-4xl lg:text-5xl dark:text-[#E8F2EF]"
          >
            Simple Plans for Every Health Goal
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-[#55706B] dark:text-[#A1B8B3]"
          >
            Start free, upgrade whenever you&apos;re ready. All plans include access to our core autonomous AI agents with zero hidden fees.
          </motion.p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-white border border-[#DCE9E4] shadow-xs dark:bg-[#161f1e] dark:border-[#263835]">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#007F78] text-white shadow-xs"
                  : "text-[#55706B] hover:text-[#163330] dark:text-[#A1B8B3] dark:hover:text-[#E8F2EF]"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-[#007F78] text-white shadow-xs"
                  : "text-[#55706B] hover:text-[#163330] dark:text-[#A1B8B3] dark:hover:text-[#E8F2EF]"
              }`}
            >
              <span>Annual Billing</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                billingCycle === "yearly"
                  ? "bg-white/20 text-white"
                  : "bg-[#EAF7DE] text-[#166534] dark:bg-[#65B82E]/20 dark:text-[#86EFAC]"
              }`}>
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative flex flex-col justify-between rounded-[2rem] p-8 sm:p-9 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "border-2 border-[#007F78] bg-gradient-to-b from-[#EEF7F3] via-white to-white shadow-xl dark:border-[#007F78] dark:from-[#13221e] dark:via-[#161f1c] dark:to-[#161f1c]"
                  : "border border-[#DCE9E4] bg-white shadow-sm hover:shadow-md dark:border-[#263835] dark:bg-[#151f1c]"
              }`}
            >
              {/* Most Popular Badge on Top */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#007F78] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                  {plan.badge}
                </div>
              )}

              {/* Card Header & Price */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold text-[#163330] dark:text-[#E8F2EF]">
                    {plan.name}
                  </h3>
                  {!plan.popular && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${plan.badgeClass}`}>
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs leading-relaxed text-[#55706B] dark:text-[#A1B8B3]">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1.5 pb-6 border-b border-[#DCE9E4]/70 dark:border-[#263835]">
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#163330] dark:text-[#E8F2EF] tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs font-medium text-[#849A95] dark:text-[#6E8883]">
                    {plan.id === "lifetime" ? "one-time payment" : `/ ${plan.period}`}
                  </span>
                </div>

                {/* Feature Bullet Points */}
                <div className="mt-6 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#849A95] dark:text-[#6E8883]">
                    What&apos;s included:
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs text-[#163330] dark:text-[#E8F2EF]">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#DDF5F0] text-[#007F78] dark:bg-[#007F78]/25 dark:text-[#2DD4BF]">
                          <HiCheck className="h-2.5 w-2.5 stroke-2" />
                        </span>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                <Link
                  href={plan.buttonHref}
                  className={`w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl text-sm font-bold transition-all !no-underline shadow-xs ${
                    plan.buttonVariant === "primary"
                      ? "bg-[#007F78] hover:bg-[#005F5A] text-white hover:shadow-md shadow-[#007F78]/20"
                      : "bg-[#EEF7F3] hover:bg-[#DDF5F0] text-[#163330] border border-[#DCE9E4] dark:bg-[#1b2b28] dark:text-[#E8F2EF] dark:border-[#263835] dark:hover:bg-[#203330]"
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Guarantee */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs text-[#849A95] dark:text-[#6E8883]">
          <span className="inline-flex items-center gap-1.5">
            <HiShieldCheck className="h-4 w-4 text-[#65B82E]" />
            Zero commitment · Cancel anytime
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="inline-flex items-center gap-1.5">
            <HiCheck className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
            Instant AI Agent activation
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="inline-flex items-center gap-1.5">
            <HiSparkles className="h-4 w-4 text-[#F59E0B]" />
            Free tier requires no credit card
          </span>
        </div>
      </div>
    </section>
  );
}
