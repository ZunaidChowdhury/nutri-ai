"use client";

import { useSession } from "@/lib/auth/client";
import { Button, Link } from "@heroui/react";
import { motion } from "framer-motion";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=2400&q=80";

export default function HeroSection() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative flex min-h-[60vh] max-h-[70vh] w-full items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-tl from-[#1a3a2a]/95 via-[#2d6a4f]/85 to-[#1a3a2a]/95"
          aria-hidden
        />

        <div className="relative flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            AI-Powered{" "}
            <span className="text-[#95d5b2]">Nutrition</span>{" "}
            Intelligence
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="max-w-xl text-lg text-white/85 md:text-xl"
          >
            Personalized meal planning, nutrition analysis, and food
            classification — powered by AI. Eat smarter, live better.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex gap-4"
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
