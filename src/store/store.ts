import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import filtersReducer from './filtersSlice';
import mealPlanFormReducer from './mealPlanFormSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    filters: filtersReducer,
    mealPlanForm: mealPlanFormReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
