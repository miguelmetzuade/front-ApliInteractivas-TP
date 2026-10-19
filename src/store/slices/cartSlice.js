import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { deleteJson, getJson, postJson, putJson } from '../../services/api';
import { placeOrder } from './checkoutSlice';

const errorMessage = (error) => error.message || 'Ocurrió un error inesperado';

// GET /api/carrito: ítems con subtotales y total del usuario logueado
export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getJson('/carrito');
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => getState().cart.status !== 'loading',
  },
);

// POST /api/carrito/items { productoId, cantidad }
export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ productoId, cantidad = 1 }, { rejectWithValue }) => {
    try {
      return await postJson('/carrito/items', { productoId, cantidad });
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

// PUT /api/carrito/items/{productoId} { cantidad }
export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ productoId, cantidad }, { rejectWithValue }) => {
    try {
      return await putJson(`/carrito/items/${productoId}`, { cantidad });
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

// DELETE /api/carrito/items/{productoId}
export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (productoId, { rejectWithValue }) => {
    try {
      return await deleteJson(`/carrito/items/${productoId}`);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

// DELETE /api/carrito: vacía el carrito (responde 204)
export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      await deleteJson('/carrito');
      return null;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

// Todos los endpoints de ítems devuelven el carrito completo, así que reemplazamos el estado con la respuesta
const setCart = (state, cart) => {
  state.items = cart.items;
  state.total = cart.total;
};

const productIdOf = (arg) => (typeof arg === 'object' ? arg.productoId : arg);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    status: 'idle',
    error: null,
    pendingIds: [],
    // Error de la última acción sobre un ítem (agregar, cambiar cantidad, eliminar)
    actionError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        setCart(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        if (action.meta.condition) return;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.actionError = action.payload || action.error.message;
      })
      // Después de comprar, el backend deja el carrito vacío
      .addCase(placeOrder.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
      })
      .addMatcher(
        isAnyOf(addToCart.pending, updateCartItem.pending, removeCartItem.pending),
        (state, action) => {
          const productId = productIdOf(action.meta.arg);
          if (!state.pendingIds.includes(productId)) state.pendingIds.push(productId);
          state.actionError = null;
        },
      )
      .addMatcher(
        isAnyOf(addToCart.fulfilled, updateCartItem.fulfilled, removeCartItem.fulfilled),
        (state, action) => {
          const productId = productIdOf(action.meta.arg);
          state.pendingIds = state.pendingIds.filter((id) => id !== productId);
          state.status = 'succeeded';
          setCart(state, action.payload);
        },
      )
      .addMatcher(
        isAnyOf(addToCart.rejected, updateCartItem.rejected, removeCartItem.rejected),
        (state, action) => {
          const productId = productIdOf(action.meta.arg);
          state.pendingIds = state.pendingIds.filter((id) => id !== productId);
          state.actionError = action.payload || action.error.message;
        },
      );
  },
});

// Cantidad total de unidades, para el contador del ícono del carrito
export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.cantidad, 0);

export default cartSlice.reducer;
