"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { HiSparkles, HiChartBar, HiTag } from "react-icons/hi";

const agents = [
  {
    icon: HiSparkles,
    title: "Meal Planning Agent",
    description:
      "Creates personalized 7-day meal plans based on your goals, dietary restrictions, budget, and calorie targets using AI-powered optimization.",
  },
  {
    icon: HiChartBar,
    title: "Nutrition Analysis Agent",
    description:
      "Analyzes your weekly eating patterns, identifies nutritional deficiencies, and provides actionable recommendations for a balanced diet.",
  },
  {
    icon: HiTag,
    title: "Food Classification Agent",
    description:
      "Automatically classifies meals by cuisine type with confidence scoring, helping you organize and discover patterns in your eating habits.",
  },
];

export default function AgentSpotlightSection() {
  return (
    <section className="bg-default-50 px-4 py-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-2 text-center text-3xl font-bold">
          AI-Powered Agents
        </h2>
        <p className="mb-10 text-center text-foreground/60">
          Three specialized agents working together to optimize your nutrition
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.title} className="border border-default-200">
              <CardHeader className="flex-col items-center gap-3 pb-0 pt-8">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                  <agent.icon className="size-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{agent.title}</h3>
              </CardHeader>
              <CardBody className="px-6 pb-8 pt-4 text-center text-foreground/60">
                {agent.description}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
