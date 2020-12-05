import { createSlice } from '@reduxjs/toolkit';

export const appDrawerSlice = createSlice({
  name: 'appDrawer',
  initialState: {
    isOpen: false,
  },
  reducers: {
    toggleDrawer: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const { toggleDrawer } = appDrawerSlice.actions;

export default appDrawerSlice.reducer;
