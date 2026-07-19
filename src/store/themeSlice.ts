import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
}

const initialState: ThemeState = {
  theme: 'system',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
