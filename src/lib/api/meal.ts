import { serverFetch } from '@/lib/core/server';
import type { MealFilters, MealsResponse, MealDetailResponse, Meal } from '@/lib/types/meal';

export async function getAllMeals(
  filters: MealFilters = {},
  token?: string
): Promise<MealsResponse> {
  const params: Record<string, string | number | boolean | undefined> = {};

  if (filters.search) params.search = filters.search;
  if (filters.cuisineTag) params.cuisineTag = filters.cuisineTag;
  if (filters.minCalories) params.minCalories = filters.minCalories;
  if (filters.maxCalories) params.maxCalories = filters.maxCalories;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.order) params.order = filters.order;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.ownerId) params.ownerId = filters.ownerId;

  return serverFetch<MealsResponse>('/meals', { params, token });
}

export async function getMealById(
  id: string,
  token?: string
): Promise<MealDetailResponse> {
  return serverFetch<MealDetailResponse>(`/meals/${id}`, { token });
}

export async function getMealByIdPublic(
  id: string
): Promise<MealDetailResponse> {
  return serverFetch<MealDetailResponse>(`/meals/${id}`);
}
