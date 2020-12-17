import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';

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
    .filter(([upc, salesItem]) => salesItem.totalMovement > 0)
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
