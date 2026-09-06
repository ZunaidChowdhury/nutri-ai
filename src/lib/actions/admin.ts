import { serverMutation } from '@/lib/core/server';
import type { UserResponse } from '@/lib/types/user';

export async function updateUserRole(
  userId: string,
  role: 'user' | 'admin',
  token: string
): Promise<void> {
  await serverMutation<UserResponse>(`/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: { role },
    token,
  });
}

export async function deleteUser(userId: string, token: string): Promise<void> {
  await serverMutation<{ success: boolean }>(`/admin/users/${userId}`, {
    method: 'DELETE',
    token,
  });
}

export async function updateMealVisibility(
  mealId: string,
  visibility: 'public' | 'private',
  locked: boolean,
  token: string
): Promise<{ success: boolean; data: { visibility: 'public' | 'private'; lockedVisibility: boolean } }> {
  return serverMutation<{
    success: boolean;
    data: { visibility: 'public' | 'private'; lockedVisibility: boolean };
  }>(`/admin/meals/${mealId}/visibility`, {
    method: 'PATCH',
    body: { visibility, locked },
    token,
  });
}