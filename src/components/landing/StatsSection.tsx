"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { HiFire, HiUserGroup, HiClipboardList, HiChartPie } from "react-icons/hi";

const stats = [
  { icon: HiFire, value: "10,000+", label: "Meals Analyzed" },
  { icon: HiUserGroup, value: "500+", label: "Active Users" },
  { icon: HiClipboardList, value: "1,200+", label: "Meal Plans Created" },
  { icon: HiChartPie, value: "50+", label: "Cuisine Types" },
];

function AnimatedStat({ icon: Icon, value, label }: { icon: React.ComponentType<{ className?: string }>; value: string; label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-3 text-center"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
        <Icon className="size-7 text-primary" />
      </div>
      <span
        className={`text-3xl font-bold transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {value}
      </span>
      <span className="text-foreground/60">{label}</span>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="px-4 py-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-2 text-center text-3xl font-bold">
          Growing Stronger Every Day
        </h2>
        <p className="mb-10 text-center text-foreground/60">
          Our community&apos;s journey to better nutrition
        </p>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
