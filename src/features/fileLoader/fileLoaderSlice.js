import { createSlice } from '@reduxjs/toolkit';
import XLSX from 'xlsx';

import { setData } from '../orderGuide/orderGuideSlice';

export const fileLoaderSlice = createSlice({
  name: 'fileLoader',
  initialState: {
    isLoading: false,
    success: null,
    error: null,
  },
  reducers: {
    loading: (state) => {
      state.isLoading = true;
    },
    success: (state, action) => {
      state.success = action.payload;
      state.isLoading = false;
    },
    failure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { loading, success, failure } = fileLoaderSlice.actions;

const createData = (rows) =>
  rows.map((row) => {
    const brand = String(row[2]).trim();
    const upc = row[3];
    const description = String(row[4]).trim();
    const retail = row[14];
    const caseCost = row[16];
    const caseRetail = Number((caseCost * 1.25).toFixed(2));
    return { brand, upc, description, retail, caseRetail };
  });

export const loadFile = (file) => async (dispatch) => {
  dispatch(loading());
  try {
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });

    /* Get first worksheet */
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];

    /* Convert array of arrays */
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
    const data = createData(rows.slice(1, -1)); //Remove header row and total row

    /* set/get localStorage to ensure it stores properly without any errors */
    localStorage.setItem('data', JSON.stringify(data));
    const storedData = JSON.parse(localStorage.getItem('data'));

    dispatch(success(Date.now()));
    dispatch(setData(storedData));
  } catch (error) {
    dispatch(failure(error));
  }
};

export default fileLoaderSlice.reducer;
