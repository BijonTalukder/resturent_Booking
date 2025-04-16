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
import bookingSlice from "../Booking/bookingSlice"; 
import { addDays, startOfDay } from "date-fns";


// Persist config for booking

const bookingPersistConfig = {
  key: "booking",
  storage,
  whitelist: ["selectedRooms", "checkInDate", "checkOutDate"],
  transforms: [
    {
      in: (state) => ({
        ...state,
        checkInDate: state.checkInDate?.getTime() || startOfDay(new Date()).getTime(),
        checkOutDate: state.checkOutDate?.getTime() || addDays(startOfDay(new Date()), 1).getTime()
      }),
      out: (state) => ({
        ...state,
        checkInDate: new Date(state.checkInDate),
        checkOutDate: new Date(state.checkOutDate)
      }),
    },
  ],
};

// Persist reducers
const persistedAuthReducer = persistReducer({ key: "auth", storage }, authSlice);
const persistedBookingReducer = persistReducer(bookingPersistConfig, bookingSlice);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer,
    booking: persistedBookingReducer,
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