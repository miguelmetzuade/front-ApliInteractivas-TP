import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteJson, getJson, patchJson } from '../../services/api';

const errorMessage = (error) => error.message || 'Ocurrió un error inesperado';

export const fetchSellerProducts = createAsyncThunk(
  'seller/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await getJson('/productos/mios');
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const updateProductStock = createAsyncThunk(
  'seller/updateStock',
  async ({ id, stock }, { rejectWithValue }) => {
    try {
      return await patchJson(`/productos/${id}/stock`, { stock });
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const deleteSellerProduct = createAsyncThunk(
  'seller/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await deleteJson(`/productos/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

const sellerSlice = createSlice({
  name: 'seller',
  initialState: {
    products: [],
    status: 'idle',
    error: null,
    pendingIds: [],
    updateErrors: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(updateProductStock.pending, (state, action) => {
        const productId = action.meta.arg.id;
        if (!state.pendingIds.includes(productId)) state.pendingIds.push(productId);
        delete state.updateErrors[productId];
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        state.pendingIds = state.pendingIds.filter((id) => id !== updatedProduct.id);
        state.products = state.products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product,
        );
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        const productId = action.meta.arg.id;
        state.pendingIds = state.pendingIds.filter((id) => id !== productId);
        state.updateErrors[productId] = action.payload || action.error.message;
      })
      .addCase(deleteSellerProduct.pending, (state, action) => {
        const productId = action.meta.arg;
        if (!state.pendingIds.includes(productId)) state.pendingIds.push(productId);
        delete state.updateErrors[productId];
      })
      .addCase(deleteSellerProduct.fulfilled, (state, action) => {
        const productId = action.payload;
        state.pendingIds = state.pendingIds.filter((id) => id !== productId);
        state.products = state.products.filter((product) => product.id !== productId);
        delete state.updateErrors[productId];
      })
      .addCase(deleteSellerProduct.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.pendingIds = state.pendingIds.filter((id) => id !== productId);
        state.updateErrors[productId] = action.payload || action.error.message;
      });
  },
});

export default sellerSlice.reducer;
