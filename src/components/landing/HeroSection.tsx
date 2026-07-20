"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth/client";
import { Button, Link } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=2400&q=80",
    title: (
      <>
        AI-Powered{" "}
        <span className="text-[#95d5b2]">Nutrition</span>{" "}
        Intelligence
      </>
    ),
    description:
      "Personalized meal planning, nutrition analysis, and food classification — powered by AI. Eat smarter, live better.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=2400&q=80",
    title: (
      <>
        Smart <span className="text-[#95d5b2]">Meal Planning</span>{" "}
        in Seconds
      </>
    ),
    description:
      "Tell us your goals, restrictions, and budget. Our AI generates a complete 7-day meal plan tailored just for you.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=2400&q=80",
    title: (
      <>
        Track. Analyze.{" "}
        <span className="text-[#95d5b2]">Improve.</span>
      </>
    ),
    description:
      "Get deep nutrition insights, macro breakdowns, and personalized recommendations based on your eating habits.",
  },
];

export default function HeroSection() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const goTo = (i: number) => setCurrent(i);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative flex min-h-[60vh] max-h-[70vh] w-full items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <img
              src={SLIDES[current].image}
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div
          className="absolute inset-0 bg-gradient-to-tl from-[#1a3a2a]/95 via-[#2d6a4f]/85 to-[#1a3a2a]/95"
          aria-hidden
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex max-w-3xl flex-col items-center gap-6 px-6 text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              {SLIDES[current].title}
            </h1>

            <p className="max-w-xl text-lg text-white/85 md:text-xl">
              {SLIDES[current].description}
            </p>

            <div className="flex gap-4">
              <Button
                as={Link}
                href={isLoggedIn ? "/meals" : "/register"}
                color="primary"
                size="lg"
                className="bg-white text-[#1a3a2a] hover:bg-white/90 font-semibold"
              >
                {isLoggedIn ? "Explore Meals" : "Get Started Free"}
              </Button>
              <Button
                as={Link}
                href="/meals"
                variant="bordered"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10"
              >
                Browse Meals
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
