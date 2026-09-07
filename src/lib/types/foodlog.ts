export interface FoodLogEntry {
  _id: string;
  userId: string;
  mealId?: string;
  name: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  servings: number;
  consumedOn: string;
  createdAt: string;
  updatedAt: string;
}