import type { Meal } from './meal';
import type { MealPlan } from './mealplan';

export interface DashboardData {
  meals: Meal[];
  totalMeals: number;
  mealPlan: MealPlan | null;
}
