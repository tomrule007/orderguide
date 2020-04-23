import { createSlice } from '@reduxjs/toolkit';

import { data } from './orderGuideMockData';

export const orderGuideSlice = createSlice({
  name: 'orderGuide',
  initialState: {
    data,
    filterText: '',
  },
  reducers: {
    setFilterText: (state, action) => {
      state.filterText = String(action.payload).toLowerCase();
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setFilterText, setData } = orderGuideSlice.actions;

export default orderGuideSlice.reducer;
