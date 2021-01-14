import { createSlice } from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    table: {},
  },
  reducers: {
    setHiddenColumns: (state, action) => {
      const { tableId, columns } = action.payload;
            state.table[tableId] = columns;

    },
  },
});

export const { setHiddenColumns } = settingsSlice.actions;

export const selectSettings = (state) => state.settings;

export default settingsSlice.reducer;
