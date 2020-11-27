import { createSlice } from '@reduxjs/toolkit';
import XLSX from 'xlsx';

import { getOrderGuideData } from '../orderGuide/orderGuideSlice';

export const fileLoaderSlice = createSlice({
  name: 'salesFileLoader',
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

const labelSalesColumns = (row) => ({
  brand: row[0],
  description: row[1],
  upc: row[2],
  size: row[3],
  pack: row[4],
  currentRetail: row[6],
  onSale: row[6] !== row[7], // If currentRetail not equal reg retail it must be on sale
  currentCaseCost: row[8],
  isOrganic: row[9] === 'Y',
  regularCaseCost: row[11],
  regularUnitCost: row[12],
  vendorName: row[13],
  avgRetail: row[14],
  totalMovement: row[15],
  salesDollars: row[16],
  grossProfitDollars: row[17],
  grossProfitPercent: row[18],
});

const normalizeByUPCReducer = (acc, item) => {
  acc[item.upc] = { ...item };
  return acc;
};

export const loadFile = (file) => async (dispatch) => {
  dispatch(loading());
  try {
    const wb = XLSX.read(await file.arrayBuffer(), {
      type: 'array',
    });

    //TODO: Add file name validation
    const date = file.name.slice(6, -5); // Get date from 'sales_YYYY_MM_DD.xlsx'
    console.log(date);
    /* Get first worksheet */
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];

    /* Convert array of arrays */
    // TODO: Lookup what header option actually does
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
    // TODO: add totals back into dataset
    const data = rows
      .slice(4, -2) //Remove header rows and total rows
      .map(labelSalesColumns)
      .reduce(normalizeByUPCReducer, {});

    console.log(data);

    localStorage.setItem(date, JSON.stringify(data));

    dispatch(success(date));
    dispatch(getOrderGuideData());
  } catch (error) {
    dispatch(failure(error));
  }
};

export default fileLoaderSlice.reducer;
