import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './features/users/userSlice';
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from 'redux-persist/es/persistStore';
import themeReducer from "./features/theme/themeSlice";
import expireInTransfrom from "redux-persist-transform-expire-in";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer
});

const expiresIn = 24 * 60 * 60 * 1000;
const expirationKey = import.meta.env.EXPIRATION_KEY;

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  transforms: [expireInTransfrom(expiresIn, expirationKey, [])],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});

export const persistor = persistStore(store);