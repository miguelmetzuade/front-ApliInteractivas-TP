import { configureStore } from '@reduxjs/toolkit'
import favoriteReducer from './slices/favoriteSlice'
import sellerReducer from './slices/sellerSlice'

export const store = configureStore({
  reducer: {
    favorites: favoriteReducer,
    seller: sellerReducer,
  },
})
