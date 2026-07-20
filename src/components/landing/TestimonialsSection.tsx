"use client";

import { Card, CardBody } from "@heroui/react";
import { HiStar } from "react-icons/hi";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Fitness Enthusiast",
    quote:
      "NutriAI completely changed how I approach my daily nutrition. The meal planning agent saves me hours every week and the suggestions are always spot-on.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Busy Professional",
    quote:
      "I never realized how unbalanced my diet was until the nutrition analysis agent broke it down for me. Now I feel more energetic and focused at work.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Vegetarian Home Cook",
    quote:
      "The food classification feature helps me discover new cuisines that fit my vegetarian lifestyle. I've expanded my cooking repertoire tenfold!",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-default-50 px-4 py-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-2 text-center text-3xl font-bold">
          What Our Users Say
        </h2>
        <p className="mb-10 text-center text-foreground/60">
          Join thousands of satisfied users on their nutrition journey
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border border-default-200">
              <CardBody className="gap-4 p-6">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <HiStar key={i} className="size-4 text-warning" />
                  ))}
                </div>
                <p className="text-foreground/70">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-foreground/50">{t.role}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
