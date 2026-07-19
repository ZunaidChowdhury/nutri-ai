import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  search: string;
  cuisineTag: string;
  minCalories: string;
  maxCalories: string;
  sortBy: 'calories' | 'rating' | 'createdAt';
  order: 'asc' | 'desc';
  page: number;
}

const initialState: FiltersState = {
  search: '',
  cuisineTag: '',
  minCalories: '',
  maxCalories: '',
  sortBy: 'createdAt',
  order: 'desc',
  page: 1,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setCuisineTag(state, action: PayloadAction<string>) {
      state.cuisineTag = action.payload;
      state.page = 1;
    },
    setMinCalories(state, action: PayloadAction<string>) {
      state.minCalories = action.payload;
      state.page = 1;
    },
    setMaxCalories(state, action: PayloadAction<string>) {
      state.maxCalories = action.payload;
      state.page = 1;
    },
    setSortBy(state, action: PayloadAction<FiltersState['sortBy']>) {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setOrder(state, action: PayloadAction<FiltersState['order']>) {
      state.order = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setSearch,
  setCuisineTag,
  setMinCalories,
  setMaxCalories,
  setSortBy,
  setOrder,
  setPage,
  resetFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;
