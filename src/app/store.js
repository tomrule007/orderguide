import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import orderGuideReducer from '../features/orderGuide/orderGuideSlice';
import fileLoaderReducer from '../features/fileLoader/fileLoaderSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    orderGuide: orderGuideReducer,
    fileLoader: fileLoaderReducer,
  },
});
