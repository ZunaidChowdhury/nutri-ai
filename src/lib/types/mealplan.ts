export interface MealPlanDayMeal {
  name: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: string[];
  instructions: string;
}

export interface MealPlanDay {
  day: number;
  meals: MealPlanDayMeal[];
}

export interface MealPlan {
  _id?: string;
  userId?: string;
  inputs: {
    goal: string;
    restrictions: string[];
    budget: 'low' | 'medium' | 'high';
    calorieTarget: number;
  };
  days: MealPlanDay[];
  createdAt?: string;
}

export interface MealPlanResponse {
  success: boolean;
  data: MealPlan;
}
