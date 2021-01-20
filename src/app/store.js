import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';

import appBarReducer from 'components/appBar/appBarSlice';
import appDrawerReducer from 'components/appDrawer/appDrawerSlice';
import fileLoaderReducer from 'components/fileLoader/fileLoaderSlice';
import fileStoreReducer from 'reducers/fileStoreSlice';
import filtersReducer from 'reducers/filtersSlice';
import localForage from 'localforage';
import orderGuideReducer from 'components/ProductTable/orderGuideSlice';
import { persistReducer } from 'redux-persist';
import productMapReducer from 'reducers/productMapSlice';
import settingsReducer from 'reducers/settingsSlice';

const rootReducer = combineReducers({
  orderGuide: orderGuideReducer,
  fileLoader: fileLoaderReducer,
  appDrawer: appDrawerReducer,
  appBar: appBarReducer,
  filters: filtersReducer,
  productMap: productMapReducer,
  fileStore: fileStoreReducer,
  settings: settingsReducer,
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
    // Speed up development hot reloading (could cause bugs to slip by though)
    immutableCheck: false,
    serializableCheck: false,
    // Ignore just the non serializable redux-persist actions
    // serializableCheck: {
    //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    // },
  }),
});
