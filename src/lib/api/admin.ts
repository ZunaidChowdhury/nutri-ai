import { serverFetch } from '@/lib/core/server';
import type { MealsResponse } from '@/lib/types/meal';
import type { UsersResponse } from '@/lib/types/user';

interface AdminListParams {
  page?: number;
  limit?: number;
}

export async function getAdminMeals(
  params: AdminListParams = {},
  token: string
): Promise<MealsResponse> {
  return serverFetch<MealsResponse>('/admin/meals', {
    params: { page: params.page, limit: params.limit },
    token,
  });
}

export async function getAdminUsers(
  params: AdminListParams = {},
  token: string
): Promise<UsersResponse> {
  return serverFetch<UsersResponse>('/admin/users', {
    params: { page: params.page, limit: params.limit },
    token,
  });
}