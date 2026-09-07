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
  visibility?: 'public' | 'private';
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

export async function updateMeal(
  id: string,
  data: MealInput,
  token: string
): Promise<Meal> {
  const response = await serverMutation<MealResponse>(`/meals/${id}`, {
    method: 'PATCH',
    body: data,
    token,
  });
  return response.data;
}

export async function updateMealVisibility(
  id: string,
  visibility: 'public' | 'private',
  token: string
): Promise<Meal> {
  const response = await serverMutation<MealResponse>(`/meals/${id}/visibility`, {
    method: 'PATCH',
    body: { visibility },
    token,
  });
  return response.data;
}

export async function addSelectedMeal(
  mealId: string,
  token: string
): Promise<Meal> {
  const response = await serverMutation<MealResponse>(`/meals/selected/${mealId}`, {
    method: 'POST',
    token,
  });
  return response.data;
}

export async function removeSelectedMeal(
  mealId: string,
  token: string
): Promise<void> {
  await serverMutation<DeleteResponse>(`/meals/selected/${mealId}`, {
    method: 'DELETE',
    token,
  });
}
