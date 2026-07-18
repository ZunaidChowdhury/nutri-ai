"use client";

import { Button } from "@heroui/react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-8 p-16">
      <h1 className="text-4xl font-bold">NutriAI</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Your AI-powered nutrition assistant
      </p>
      <Button color="primary" size="lg">
        Get Started
      </Button>
    </div>
  );
}
