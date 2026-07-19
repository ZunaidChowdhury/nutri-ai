import { getAllMeals } from '@/lib/api/meal';
import type { MealsResponse } from '@/lib/types/meal';
import { ExploreContent } from '@/components/meals/ExploreContent';

interface Props {
  searchParams: Promise<{
    search?: string;
    cuisineTag?: string;
    minCalories?: string;
    maxCalories?: string;
    sortBy?: string;
    order?: string;
    page?: string;
  }>;
}

export default async function MealsPage({ searchParams }: Props) {
  const params = await searchParams;

  const filters = {
    search: params.search,
    cuisineTag: params.cuisineTag,
    minCalories: params.minCalories ? Number(params.minCalories) : undefined,
    maxCalories: params.maxCalories ? Number(params.maxCalories) : undefined,
    sortBy: (params.sortBy || 'createdAt') as 'calories' | 'rating' | 'createdAt',
    order: (params.order || 'desc') as 'asc' | 'desc',
    page: params.page ? Number(params.page) : 1,
    limit: 12,
  };

  let initialData: MealsResponse | null = null;

  try {
    initialData = await getAllMeals(filters);
  } catch {
    initialData = null;
  }

  return <ExploreContent initialData={initialData} />;
}
