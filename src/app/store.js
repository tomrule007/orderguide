import { configureStore } from '@reduxjs/toolkit';
import counterReducer from 'components/counter/counterSlice';
import orderGuideReducer from 'components/ProductTable/orderGuideSlice';
import fileLoaderReducer from 'components/fileLoader/fileLoaderSlice';
import appDrawerReducer from 'components/appDrawer/appDrawerSlice';
import appBarReducer from 'components/appBar/appBarSlice';
export default configureStore({
  reducer: {
    counter: counterReducer,
    orderGuide: orderGuideReducer,
    fileLoader: fileLoaderReducer,
    appDrawer: appDrawerReducer,
    appBar: appBarReducer,
  },
});
