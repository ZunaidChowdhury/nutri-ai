import { serverMutation } from '@/lib/core/server';
import type { MealPlanResponse } from '@/lib/types/mealplan';

export async function generateMealPlan(
  goal: string,
  restrictions: string[],
  budget: string,
  calorieTarget: number,
  token: string
): Promise<MealPlanResponse['data']> {
  const res = await serverMutation<MealPlanResponse>('/agents/meal-planning', {
    method: 'POST',
    body: { goal, restrictions, budget, calorieTarget },
    token,
  });
  return res.data;
}
