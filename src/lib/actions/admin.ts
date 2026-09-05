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