import { serverFetch, serverMutation } from '@/lib/core/server';
import type { FoodLogEntry } from '@/lib/types/foodlog';

interface LogListResponse {
  success: boolean;
  data: FoodLogEntry[];
  total: number;
}

interface LogEntryResponse {
  success: boolean;
  data: FoodLogEntry;
}

export async function getFoodLog(
  token: string,
  opts?: { days?: number; from?: string; to?: string }
): Promise<{ data: FoodLogEntry[]; total: number }> {
  const res = await serverFetch<LogListResponse>('/log', {
    token,
    params: { days: opts?.days, from: opts?.from, to: opts?.to },
  });
  return { data: res.data, total: res.total };
}

export async function logFood(
  token: string,
  payload: {
    mealId?: string;
    name?: string;
    calories?: number;
    macros?: { protein: number; carbs: number; fat: number };
    servings?: number;
    consumedOn?: string;
  }
): Promise<FoodLogEntry> {
  const res = await serverMutation<LogEntryResponse>('/log', {
    method: 'POST',
    body: payload,
    token,
  });
  return res.data;
}

export async function deleteFoodLog(token: string, id: string): Promise<void> {
  await serverMutation(`/log/${id}`, { method: 'DELETE', token });
}