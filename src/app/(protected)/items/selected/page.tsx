'use client';

import Link from 'next/link';
import { Button, Chip } from '@heroui/react';
import { useSession } from '@/lib/auth/client';
import { useSelectedMeals } from '@/lib/hooks/useSelectedMeals';
import { MealGrid } from '@/components/meals/MealGrid';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorFallback } from '@/components/feedback/ErrorFallback';

export default function SelectedMealsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { selectedMeals, selectedIds, toggleMeal, isLoading, isError, error } =
    useSelectedMeals(userId);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">Selected Meals</h1>
        <p className="text-muted">
          Your hand-picked meals. The AI meal planner builds your 7-day plan
          from these when you choose &quot;Selected Meals&quot; — select at least 10
          to use them.
        </p>
      </div>

      {isError ? (
        <ErrorFallback error={error as Error} />
      ) : selectedMeals.length === 0 && !isLoading ? (
        <EmptyState
          title="No selected meals yet"
          description="Tap the + icon on any public meal card in Explore, or on your own meals in Manage Meals, to build your selection."
          action={
            <Link href="/meals">
              <Button variant="primary">Browse meals</Button>
            </Link>
          }
        />
      ) : (
        <>
          {selectedMeals.length > 0 && (
            <div className="flex items-center gap-2">
              <Chip variant="soft" color="accent" size="sm">
                {selectedMeals.length} selected
              </Chip>
              <span className="text-xs text-muted">
                Tap the check icon to remove a meal.
              </span>
            </div>
          )}
          <MealGrid
            meals={selectedMeals}
            isLoading={isLoading}
            selectedIds={selectedIds}
            onToggleSelect={toggleMeal}
          />
        </>
      )}
    </div>
  );
}