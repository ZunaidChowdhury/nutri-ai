import { serverMutation } from '@/lib/core/server';
import type { Meal } from '@/lib/types/meal';
import type { ApiError } from '@/lib/core/server';

export { ApiError };

interface MealInput {
  title: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl?: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  cuisineTag: string;
  rating?: number;
}

interface MealResponse {
  success: boolean;
  data: Meal;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

export async function createMeal(
  data: MealInput,
  token: string
): Promise<Meal> {
  const response = await serverMutation<MealResponse>('/meals', {
    method: 'POST',
    body: data,
    token,
  });
  return response.data;
}

export async function deleteMeal(
  id: string,
  token: string
): Promise<void> {
  await serverMutation<DeleteResponse>(`/meals/${id}`, {
    method: 'DELETE',
    token,
  });
}
