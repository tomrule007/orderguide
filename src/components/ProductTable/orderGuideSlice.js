import { createSlice } from '@reduxjs/toolkit';

export const orderGuideSlice = createSlice({
  name: 'orderGuide',
  initialState: {
    data: [],
    filterText: '',
    error: null,
  },
  reducers: {
    setFilterText: (state, action) => {
      state.filterText = String(action.payload).toLowerCase();
    },
    setData: (state, action) => {
      state.data = action.payload;
      state.error = null;
    },
    failure: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setFilterText, setData, failure } = orderGuideSlice.actions;

export const getOrderGuideData = () => (dispatch) => {
  try {
    const storedData = JSON.parse(localStorage.getItem('data')) || [];
    dispatch(setData(storedData));
  } catch (error) {
    dispatch(failure(error));
  }
};

export default orderGuideSlice.reducer;
