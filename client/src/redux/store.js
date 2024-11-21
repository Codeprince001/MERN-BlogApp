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
  transforms: [expireInTransfrom(expiresIn, expirationKey, {
    user: {
      currentUser: null,
      error: null,
      loading: false
    },
    theme: { theme: "light" }
  })],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);