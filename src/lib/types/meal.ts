export interface Meal {
  _id: string;
  ownerId: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl?: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  cuisineTag: string;
  rating: number;
  createdAt: string;
}

export interface MealsResponse {
  success: boolean;
  data: Meal[];
  total: number;
  page: number;
  totalPages: number;
}

export interface MealDetailResponse {
  success: boolean;
  data: Meal;
  related: Meal[];
}

export interface MealFilters {
  search?: string;
  cuisineTag?: string;
  minCalories?: number;
  maxCalories?: number;
  sortBy?: 'calories' | 'rating' | 'createdAt';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  ownerId?: string;
}
