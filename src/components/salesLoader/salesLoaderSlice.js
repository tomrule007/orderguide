import { createSlice } from '@reduxjs/toolkit';
import XLSX from 'xlsx';

import { getOrderGuideData } from 'components/ProductTable/orderGuideSlice';

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

// The 'LNK' prefix is used to denote that multiple UPCs are linked to to one code
// ex: extra large avocados and 32/40ct avocados are sold under the same large price
// but each have their own registered UPC
const removeLNKprefix = (str) =>
  'LNK' === str.slice(0, 3) ? str.slice(3) : str;

const labelSalesColumns = (columnLookupMap) => (row) => {
  const getColumn = (label) => row[columnLookupMap[label]];
  return {
    brand: getColumn('Brand Name'),
    description: getColumn('Description'),
    upc: parseInt(removeLNKprefix(getColumn('UPC')), 10),
    size: getColumn('Size'),
    pack: getColumn('Pack'),
    currentRetail: getColumn('Current Retail'),
    onSale: getColumn('Current Retail') !== getColumn('Current Reg Retail'),
    currentCaseCost: getColumn('CurrentCaseCost'),
    isOrganic: getColumn('Organic') === 'Y',
    regularCaseCost: getColumn('Reg Case Cost'),
    regularUnitCost: getColumn('Reg Unit Cost'),
    vendorName: getColumn('Vendor Name'),
    avgRetail: getColumn('Avg Retail'),
    totalMovement: getColumn('Total Movement'),
    salesDollars: getColumn('Sales $'),
    grossProfitDollars: getColumn('GP$'),
    grossProfitPercent: getColumn('GP%'),
  };
};

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
    console.log(rows);
    const columnLookupMap = rows[2].reduce((lookupMap, columnTitle, index) => {
      lookupMap[columnTitle] = index;
      return lookupMap;
    }, {});
    console.log(columnLookupMap);
    // TODO: add totals back into dataset
    const data = rows
      .slice(4, -2) //Remove header rows and total rows
      .map(labelSalesColumns(columnLookupMap))
      .reduce(normalizeByUPCReducer, {});

    console.log('DATA HERE', data);

    localStorage.setItem(date, JSON.stringify(data));

    dispatch(success(date));
    dispatch(getOrderGuideData());
  } catch (error) {
    dispatch(failure(error));
  }
};

export default fileLoaderSlice.reducer;
