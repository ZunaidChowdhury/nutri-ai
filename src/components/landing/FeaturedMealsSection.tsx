"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllMeals } from "@/lib/api/meal";
import { MealCard } from "@/components/meals/MealCard";
import { SkeletonMealCard } from "@/components/meals/SkeletonMealCard";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function FeaturedMealsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["meals", "featured"],
    queryFn: () => getAllMeals({ limit: 8, sortBy: "rating", order: "desc" }),
    staleTime: 60_000,
  });

  return (
    <section className="px-4 py-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-2 text-center text-3xl font-bold">Featured Meals</h2>
        <p className="mb-10 text-center text-foreground/60">
          Top-rated meals picked just for you
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonMealCard key={i} />
            ))}
          </div>
        ) : isError || !data?.data?.length ? (
          <EmptyState
            title="No meals yet"
            description="Check back soon for featured meals."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.data.map((meal) => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
