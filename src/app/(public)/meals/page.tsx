import { Suspense } from 'react';
import { ExploreContent } from '@/components/meals/ExploreContent';
import { getAllMeals } from '@/lib/api/meal';
import type { MealsResponse } from '@/lib/types/meal';

export default async function MealsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : {};

  const get = (key: string): string | undefined => {
    const v = sp[key];
    return typeof v === 'string' ? v : undefined;
  };

  const sortBy =
    (get('sortBy') as 'calories' | 'rating' | 'createdAt') || 'createdAt';
  const order = (get('order') as 'asc' | 'desc') || 'desc';
  const page = Math.max(1, Number(get('page')) || 1);

  let initialData: MealsResponse | undefined;
  try {
    initialData = await getAllMeals({
      search: get('search') || undefined,
      cuisineTag: get('cuisineTag') ? get('cuisineTag')!.toLowerCase() : undefined,
      minCalories: get('minCalories') ? Number(get('minCalories')) : undefined,
      maxCalories: get('maxCalories') ? Number(get('maxCalories')) : undefined,
      sortBy,
      order,
      page,
      limit: 12,
    });
  } catch {
    initialData = undefined;
  }

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading meals...</div>}>
      <ExploreContent initialData={initialData} />
    </Suspense>
  );
}