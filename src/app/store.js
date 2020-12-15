import { configureStore } from '@reduxjs/toolkit';
import orderGuideReducer from 'components/ProductTable/orderGuideSlice';
import fileLoaderReducer from 'components/fileLoader/fileLoaderSlice';
import appDrawerReducer from 'components/appDrawer/appDrawerSlice';
import appBarReducer from 'components/appBar/appBarSlice';
import daysReducer from 'reducers/daysSlice';
import productMapReducer from 'reducers/productMapSlice';
export default configureStore({
  reducer: {
    orderGuide: orderGuideReducer,
    fileLoader: fileLoaderReducer,
    appDrawer: appDrawerReducer,
    appBar: appBarReducer,
    days: daysReducer,
    productMap: productMapReducer,
  },
});
