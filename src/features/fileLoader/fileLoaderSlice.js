import { createSlice } from '@reduxjs/toolkit';
import XLSX from 'xlsx';

import { getOrderGuideData } from '../orderGuide/orderGuideSlice';

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

const removeDuplicates = (data, key) => {
  let lookup = new Set();
  return data.filter((obj) => !lookup.has(obj[key]) && lookup.add(obj[key]));
};

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
    const deduplicateData = removeDuplicates(data, 'upc'); // TODO: add notification to display duplicate rows

    localStorage.setItem('data', JSON.stringify(deduplicateData));

    dispatch(success(Date.now()));
    dispatch(getOrderGuideData());
  } catch (error) {
    dispatch(failure(error));
  }
};

export default fileLoaderSlice.reducer;
