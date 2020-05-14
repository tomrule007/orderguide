import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import orderGuideReducer from '../features/orderGuide/orderGuideSlice';
import fileLoaderReducer from '../features/fileLoader/fileLoaderSlice';
import appDrawerReducer from '../features/appDrawer/appDrawerSlice';
import barcodeScannerModalReducer from '../features/barcodeScannerModal/barcodeScannerModalSlice';
import appBarReducer from '../features/appBar/appBarSlice';
export default configureStore({
  reducer: {
    counter: counterReducer,
    orderGuide: orderGuideReducer,
    fileLoader: fileLoaderReducer,
    appDrawer: appDrawerReducer,
    barcodeScannerModal: barcodeScannerModalReducer,
    appBar: appBarReducer,
  },
});
