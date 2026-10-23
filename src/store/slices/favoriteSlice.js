import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteJson, getJson, postJson } from '../../services/api';
import { logout } from './authSlice';

const errorMessage = (error) => error.message || 'Ocurrió un error inesperado';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getJson('/favoritos');
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => getState().favorites.status !== 'loading',
  },
);

export const addFavorite = createAsyncThunk(
  'favorites/add',
  async (product, { rejectWithValue }) => {
    try {
      await postJson(`/favoritos/${product.id}`);
      return product;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const removeFavorite = createAsyncThunk(
  'favorites/remove',
  async (productId, { rejectWithValue }) => {
    try {
      await deleteJson(`/favoritos/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    pendingIds: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        if (action.meta.condition) return;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(addFavorite.pending, (state, action) => {
        const productId = action.meta.arg.id;
        if (!state.pendingIds.includes(productId)) state.pendingIds.push(productId);
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.pendingIds = state.pendingIds.filter((id) => id !== action.payload.id);
        if (!state.items.some((product) => product.id === action.payload.id)) {
          state.items.push(action.payload);
        }
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.pendingIds = state.pendingIds.filter((id) => id !== action.meta.arg.id);
      })
      .addCase(removeFavorite.pending, (state, action) => {
        if (!state.pendingIds.includes(action.meta.arg)) state.pendingIds.push(action.meta.arg);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.pendingIds = state.pendingIds.filter((id) => id !== action.payload);
        state.items = state.items.filter((product) => product.id !== action.payload);
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.pendingIds = state.pendingIds.filter((id) => id !== action.meta.arg);
      })
      // Al cerrar sesión no quedan los favoritos del usuario anterior
      .addCase(logout, (state) => {
        state.items = [];
        state.status = 'idle';
        state.error = null;
      });
  },
});

export default favoritesSlice.reducer;
