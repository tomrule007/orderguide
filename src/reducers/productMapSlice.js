import { createSlice } from '@reduxjs/toolkit';

export const productMapSlice = createSlice({
  name: 'productMap',
  initialState: {},
  reducers: {
    addLinks: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    removeLink: (state, action) => {
      delete state[action.payload];
    },
  },
});

export const { addLinks, removeLink } = productMapSlice.actions;

export const selectProductMap = (state) => state.productMap;

export default productMapSlice.reducer;

// TODO: replace this with some type of redux persist middle ware
export const getSavedProductMap = () => (dispatch) => {
  try {
    const links = JSON.parse(localStorage.getItem('links')) || {};
    dispatch(addLinks(links));
  } catch (error) {
    console.log('loadSavedProductMap ERROR:', error);
  }
};
