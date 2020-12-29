import { configureStore } from '@reduxjs/toolkit';
import orderGuideReducer from 'components/ProductTable/orderGuideSlice';
import fileLoaderReducer from 'components/fileLoader/fileLoaderSlice';
import appDrawerReducer from 'components/appDrawer/appDrawerSlice';
import appBarReducer from 'components/appBar/appBarSlice';
import filtersReducer from 'reducers/filtersSlice';
import productMapReducer from 'reducers/productMapSlice';
import fileStoreReducer from 'reducers/fileStoreSlice';
export default configureStore({
  reducer: {
    orderGuide: orderGuideReducer,
    fileLoader: fileLoaderReducer,
    appDrawer: appDrawerReducer,
    appBar: appBarReducer,
    filters: filtersReducer,
    productMap: productMapReducer,
    fileStore: fileStoreReducer,
  },
});
