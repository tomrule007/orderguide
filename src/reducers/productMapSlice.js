import XLSX from 'xlsx';
import { createSlice } from '@reduxjs/toolkit';
import { getSalesData } from 'reducers/fileStoreSlice';

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

// TODO: convert to thunks api and store computed state in redux
const getSalesDataOrderGuideLinker = (normalizedOrderGuide, productLinkMap) => (
  salesData
) =>
  salesData &&
  Object.values(salesData)
    //.filter(([upc, salesItem]) => salesItem.totalMovement > 0)
    .reduce((acc, item) => {
      const { priceLink, productCode, upc } = item;
      let matchUPC = 'unlinked';
      const productLinkCode = productLinkMap[upc];

      // Tries to match sales data item to order guide item
      // -> defaults to 'unlinked' if no matches are found
      // -> Tries to match in this order:
      //    1) productLinkMapCode (allows users to over ride matches)
      //    2) upc
      //    3) priceLink
      //    4) productCode
      // * This might not be the appropriate bushiness decision

      if (normalizedOrderGuide[productLinkCode]) {
        matchUPC = productLinkCode;
      } else if (normalizedOrderGuide[upc]) {
        matchUPC = upc;
      } else if (normalizedOrderGuide[priceLink]) {
        matchUPC = priceLink;
      } else if (normalizedOrderGuide[productCode]) {
        matchUPC = productCode;
      }

      const alreadyAddedItems = acc[matchUPC] || [];

      return {
        ...acc,
        [matchUPC]: [...alreadyAddedItems, item],
      };
    }, {});

export const getLinkedSalesData = async (orderGuide, productMap, days) => {
  const salesHistory = await Promise.all(
    days.map(({ dateString }) => getSalesData(dateString))
  );

  const normalizedOrderGuide = Object.fromEntries(
    orderGuide.map((item) => [item.upc, item])
  );
  const salesDataOrderGuideLinker = getSalesDataOrderGuideLinker(
    normalizedOrderGuide,
    productMap
  );

  const linkedSalesHistory = salesHistory.map((salesData) =>
    salesDataOrderGuideLinker(salesData)
  );

  return linkedSalesHistory;
};

// TODO: Make central file loading thunk that loads all types of files
export const loadProductMapFile = async (file) => {
  const isBase64 = typeof file === 'string';
  try {
    const wb = XLSX.read(isBase64 ? file : await file.arrayBuffer(), {
      type: isBase64 ? 'base64' : 'array',
    });

    /* Get first worksheet */
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];

    /* Convert array of arrays */
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

    return Object.fromEntries(rows.slice(1)); //Remove Header row
  } catch (error) {
    console.log('loadingProductMapFile ERROR', error);
    return {};
  }
};

export const exportProductMapFile = (productMap) => {
  /* create a new blank workbook */
  var wb = XLSX.utils.book_new();
  /* make worksheet */
  var ws = XLSX.utils.aoa_to_sheet([
    ['salesUPC', 'orderGuideUPC'],
    ...(Object.entries(productMap) || []),
  ]);

  /* Add the worksheet to the workbook */
  XLSX.utils.book_append_sheet(wb, ws, 'testName');

  XLSX.writeFile(wb, 'exportProductMap.xlsx');
};
