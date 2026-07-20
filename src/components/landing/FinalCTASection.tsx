"use client";

import { Button, Link } from "@heroui/react";
import { useSession } from "@/lib/auth/client";

export default function FinalCTASection() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <section className="relative overflow-hidden px-4 py-20 md:px-8 lg:px-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary to-secondary opacity-90" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_60%)]" />

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center text-white">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to Transform Your Nutrition?
        </h2>
        <p className="text-lg text-white/80">
          Join NutriAI today and let AI power your journey to better eating
          habits.
        </p>
        <Button
          as={Link}
          href={isLoggedIn ? "/meal-plan" : "/register"}
          color="default"
          size="lg"
          variant="flat"
          className="bg-white text-primary font-semibold hover:bg-white/90"
        >
          {isLoggedIn ? "Create a Meal Plan" : "Get Started Free"}
        </Button>
      </div>
    </section>
  );
}
