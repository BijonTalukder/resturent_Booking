import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import ModalSlice from "../Modal/ModalSlice";
import baseApi from "../Api/baseApi";
import loadingSlice from "../loading/loadingSlice";
import authSlice from "../Feature/auth/authSlice";
import cartSlice from "../Cart/cartSlice";

// Persist config for cart (Ensure it always initializes as an array)
const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items"], // Only persist 'items' field to prevent issues
};

// Persist reducers
const persistedAuthReducer = persistReducer({ key: "auth", storage }, authSlice);
const persistedCartReducer = persistReducer(cartPersistConfig, cartSlice);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
    modal: ModalSlice,
    loading: loadingSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
export const useAppDispatch = () => store.dispatch;
export const useAppSelector = (selector) => selector(store.getState());
