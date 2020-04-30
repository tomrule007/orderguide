import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import orderGuideReducer from '../features/orderGuide/orderGuideSlice';
import fileLoaderReducer from '../features/fileLoader/fileLoaderSlice';
import appDrawerReducer from '../features/appDrawer/appDrawerSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    orderGuide: orderGuideReducer,
    fileLoader: fileLoaderReducer,
    appDrawer: appDrawerReducer,
  },
});
