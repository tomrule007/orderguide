import { createSlice } from '@reduxjs/toolkit';

export const barcodeScannerModalSlice = createSlice({
  name: 'barcodeScannerModal',
  initialState: {
    open: false,
    enableScanner: false,
  },
  reducers: {
    setOpen: (state, action) => {
      state.open = action.payload;
    },
    setEnableScanner: (state, action) => {
      state.enableScanner = action.payload;
    },
  },
});

export const { setOpen, setEnableScanner } = barcodeScannerModalSlice.actions;

export const selectOpen = (state) => state.barcodeScannerModal.open;
export const selectEnableScanner = (state) =>
  state.barcodeScannerModal.enableScanner;

export default barcodeScannerModalSlice.reducer;
