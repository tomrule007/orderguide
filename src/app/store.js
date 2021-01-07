import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
} from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import orderGuideReducer from 'components/ProductTable/orderGuideSlice';
import fileLoaderReducer from 'components/fileLoader/fileLoaderSlice';
import appDrawerReducer from 'components/appDrawer/appDrawerSlice';
import appBarReducer from 'components/appBar/appBarSlice';
import filtersReducer from 'reducers/filtersSlice';
import productMapReducer from 'reducers/productMapSlice';
import fileStoreReducer from 'reducers/fileStoreSlice';

const rootReducer = combineReducers({
  orderGuide: orderGuideReducer,
  fileLoader: fileLoaderReducer,
  appDrawer: appDrawerReducer,
  appBar: appBarReducer,
  filters: filtersReducer,
  productMap: productMapReducer,
  fileStore: fileStoreReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: localForage,
  blacklist: ['appDrawer', 'appBar'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});
