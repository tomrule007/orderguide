import { createSlice } from '@reduxjs/toolkit';

export const appBarSlice = createSlice({
  name: 'appBar',
  initialState: {
    filterText: '',
  },
  reducers: {
    setFilterText: (state, action) => {
      state.filterText = action.payload;
    },
  },
});

export const { setFilterText } = appBarSlice.actions;

export const selectFilterText = (state) => state.appBar.filterText;

export default appBarSlice.reducer;
