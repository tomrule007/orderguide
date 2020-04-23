import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import orderGuideReducer from '../features/orderGuide/orderGuideSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    orderGuide: orderGuideReducer,
  },
});
