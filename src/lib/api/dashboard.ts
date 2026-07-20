import { serverFetch } from '@/lib/core/server';
import type { MealsResponse } from '@/lib/types/meal';

export async function getUserMeals(
  ownerId: string,
  token: string,
  limit = 30
): Promise<MealsResponse> {
  return serverFetch<MealsResponse>('/meals', {
    params: { ownerId, sortBy: 'createdAt', order: 'desc', limit },
    token,
  });
}
