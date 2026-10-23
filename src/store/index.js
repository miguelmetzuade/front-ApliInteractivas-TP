import { configureStore } from '@reduxjs/toolkit'
import favoriteReducer from './slices/favoriteSlice'
import sellerReducer from './slices/sellerSlice'
import cartReducer from './slices/cartSlice'
import checkoutReducer from './slices/checkoutSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoriteReducer,
    seller: sellerReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
  },
})
