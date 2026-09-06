import type { Meal } from '@/lib/types/meal';
import { MealCard } from './MealCard';
import { SkeletonMealCard } from './SkeletonMealCard';

interface MealGridProps {
  meals: Meal[];
  isLoading?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (meal: Meal) => void;
}

export function MealGrid({ meals, isLoading, selectedIds, onToggleSelect }: MealGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonMealCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {meals.map((meal) => (
        <MealCard
          key={meal._id}
          meal={meal}
          selected={selectedIds?.has(meal._id) ?? false}
          onToggleSelect={onToggleSelect ? () => onToggleSelect(meal) : undefined}
        />
      ))}
    </div>
  );
}
