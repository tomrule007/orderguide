import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import XLSX from 'xlsx';

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
  Object.entries(salesData)
    //.filter(([upc, salesItem]) => salesItem.totalMovement > 0)
    .reduce(
      (acc, cur) => {
        const [salesUPC, salesItem] = cur;
        // TODO: Determine if this is the right business decision.
        //       This setup will allow users to override matching products
        //       using there link before checking if the product already has a match.
        const lookupUPC = productLinkMap[salesUPC] || salesUPC;
        const orderGuideItemMatch = normalizedOrderGuide[lookupUPC];
        const alreadyAddedItems = acc[lookupUPC] || [];
        return {
          ...acc,
          ...(orderGuideItemMatch
            ? { [lookupUPC]: [...alreadyAddedItems, salesItem] }
            : { unlinked: [...acc.unlinked, [lookupUPC, salesItem]] }),
        };
      },
      { unlinked: [] }
    );
export const getLinkedSalesData = async (orderGuide, productMap, days) => {
  const salesHistory = await Promise.all(
    days.map((day) => localForage.getItem(day.dateString))
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
  console.log('im linky', linkedSalesHistory);
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
