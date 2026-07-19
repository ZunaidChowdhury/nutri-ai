import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MealPlanFormState {
  goal: string;
  restrictions: string[];
  budget: 'low' | 'medium' | 'high';
  calorieTarget: number;
}

const initialState: MealPlanFormState = {
  goal: '',
  restrictions: [],
  budget: 'medium',
  calorieTarget: 2000,
};

const mealPlanFormSlice = createSlice({
  name: 'mealPlanForm',
  initialState,
  reducers: {
    setGoal(state, action: PayloadAction<string>) {
      state.goal = action.payload;
    },
    setRestrictions(state, action: PayloadAction<string[]>) {
      state.restrictions = action.payload;
    },
    addRestriction(state, action: PayloadAction<string>) {
      if (!state.restrictions.includes(action.payload)) {
        state.restrictions.push(action.payload);
      }
    },
    removeRestriction(state, action: PayloadAction<string>) {
      state.restrictions = state.restrictions.filter((r) => r !== action.payload);
    },
    setBudget(state, action: PayloadAction<MealPlanFormState['budget']>) {
      state.budget = action.payload;
    },
    setCalorieTarget(state, action: PayloadAction<number>) {
      state.calorieTarget = action.payload;
    },
    resetForm() {
      return initialState;
    },
  },
});

export const {
  setGoal,
  setRestrictions,
  addRestriction,
  removeRestriction,
  setBudget,
  setCalorieTarget,
  resetForm,
} = mealPlanFormSlice.actions;
export default mealPlanFormSlice.reducer;
