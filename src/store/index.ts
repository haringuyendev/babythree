import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage

import { baseApi } from './api'
import guestCartReducer from './slices/guestCart'

/* ================= ROOT REDUCER ================= */

const rootReducer = combineReducers({
  guestCart: guestCartReducer,

  // RTK Query
  [baseApi.reducerPath]: baseApi.reducer,
})

/* ================= PERSIST CONFIG ================= */

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['guestCart'], // 🔥 chỉ persist guest cart
}

/* ================= PERSISTED REDUCER ================= */

const persistedReducer = persistReducer(persistConfig, rootReducer)

/* ================= STORE ================= */

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 🔥 bắt buộc cho redux-persist
    }).concat(baseApi.middleware),
})

export const persistor = persistStore(store)

/* ================= TYPES ================= */

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
