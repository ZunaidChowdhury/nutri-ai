"use client";

import { useSession } from "@/lib/auth/client";
import { Button, Link } from "@heroui/react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

const floatingIcons = [
  { emoji: "🥗", x: -120, y: -40, delay: 0 },
  { emoji: "🥑", x: 130, y: -60, delay: 0.2 },
  { emoji: "🍎", x: -150, y: 80, delay: 0.3 },
  { emoji: "🥦", x: 140, y: 70, delay: 0.1 },
  { emoji: "🍳", x: 0, y: -110, delay: 0.4 },
];

export default function HeroSection() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <section className="relative flex min-h-[60vh] max-h-[70vh] items-center justify-center overflow-hidden px-4 py-16 md:px-8 lg:px-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-950/20" />

      {/* Floating emoji icons */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
        {floatingIcons.map((item, i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 text-3xl"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: item.x,
              y: [item.y, item.y - 12, item.y],
              opacity: 0.5,
            }}
            transition={{
              duration: 2,
              delay: item.delay,
              ease: "easeOut",
              times: [0, 0.6, 1],
            }}
          >
            {item.emoji}
          </motion.span>
        ))}
      </div>

      <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
        >
          AI-Powered{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Nutrition
          </span>{" "}
          Intelligence
        </motion.h1>

        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="max-w-xl text-lg text-foreground/60 md:text-xl"
        >
          Personalized meal planning, nutrition analysis, and food classification
          — powered by AI. Eat smarter, live better.
        </motion.p>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex gap-4"
        >
          <Button
            as={Link}
            href={isLoggedIn ? "/meals" : "/register"}
            color="primary"
            size="lg"
          >
            {isLoggedIn ? "Explore Meals" : "Get Started Free"}
          </Button>
          <Button
            as={Link}
            href="/meals"
            variant="bordered"
            size="lg"
          >
            Browse Meals
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
