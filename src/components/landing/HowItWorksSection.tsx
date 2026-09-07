"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Set Your Goals",
    description: "Tell Nutri AI your targets, dietary preferences, and macro requirements. Our platform adapts entirely to you.",
  },
  {
    number: "02",
    title: "Generate AI Plans",
    description: "Our Meal Planning Agent instantly crafts a balanced 7-day meal plan tailored to your specific needs.",
  },
  {
    number: "03",
    title: "Log Your Meals",
    description: "Easily track what you eat. Our Classification Agent automatically categorizes and organizes your daily intake.",
  },
  {
    number: "04",
    title: "Analyze & Improve",
    description: "Get deep insights from our Nutrition Agent. Discover macro gaps, adjust your habits, and reach your goals faster.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full bg-white px-4 py-20 sm:py-24 md:px-8 lg:px-8 dark:bg-background">
      <div className="mx-auto max-w-[1280px]">
        
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#163330] sm:text-4xl dark:text-foreground">
            How Nutri AI Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#55706B] dark:text-muted">
            Achieving your nutrition goals has never been simpler. Let our AI handle the heavy lifting while you focus on eating right.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Connecting Line (Desktop) */}
          <div className="absolute left-[50%] top-12 hidden h-0.5 w-[75%] -translate-x-[50%] bg-[#DCE9E4] md:block dark:bg-border" />
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-6">
            {steps.map((step, index) => (
              <motion.div 
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#007F78] shadow-md dark:border-background dark:bg-accent">
                  <span className="text-xl font-bold text-white">{step.number}</span>
                </div>
                
                <h3 className="mb-3 text-xl font-bold text-[#163330] dark:text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#55706B] dark:text-muted">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
