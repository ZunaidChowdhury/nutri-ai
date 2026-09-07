"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllMeals } from "@/lib/api/meal";
import { MealCard } from "@/components/meals/MealCard";
import { SkeletonMealCard } from "@/components/meals/SkeletonMealCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Link } from "@heroui/react";
import { HiArrowRight } from "react-icons/hi";

export default function FeaturedMealsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["meals", "featured"],
    queryFn: () => getAllMeals({ limit: 8, sortBy: "rating", order: "desc" }),
    staleTime: 60_000,
  });

  return (
    <section className="w-full bg-white px-4 py-20 sm:py-24 md:px-8 lg:px-8 dark:bg-background">
      <div className="mx-auto max-w-[1280px]">
        {/* Header Section */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-[#163330] sm:text-4xl dark:text-foreground">
              Choose Your Next Meal
            </h2>
            <p className="mt-4 text-lg text-[#55706B] dark:text-muted">
              Explore our highest-rated, nutritionally balanced meals. Handpicked to fuel your body and satisfy your cravings.
            </p>
          </div>
          
          <Link
            href="/meals"
            className="!no-underline group inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#F7FAF8] px-6 py-3 text-sm font-semibold text-[#007F78] transition-all hover:bg-[#DDF5F0] dark:bg-accent/10 dark:text-accent dark:hover:bg-accent/20"
          >
            <span>Explore All</span>
            <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonMealCard key={i} />
            ))}
          </div>
        ) : isError || !data?.data?.length ? (
          <EmptyState
            title="No meals found"
            description="We're cooking up some new meals. Check back soon."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {data.data.map((meal) => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
