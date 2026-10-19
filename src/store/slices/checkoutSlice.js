import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postJson } from '../../services/api';

const errorMessage = (error) => error.message || 'Ocurrió un error inesperado';

// Métodos de envío del paso 2 (precios en pesos, como los productos).
// El backend no los maneja: solo suman el costo al total que se muestra.
export const SHIPPING_METHODS = [
  { id: 'free', label: 'Gratis', description: 'Envío regular', price: 0, days: 7 },
  { id: 'express', label: '$8.500', description: 'Recibilo lo antes posible', price: 8500, days: 2 },
  { id: 'schedule', label: 'Programado', description: 'Elegí la fecha en que querés recibirlo', price: 0 },
];

// POST /api/carrito/checkout: compra el carrito del usuario logueado y devuelve la orden
export const placeOrder = createAsyncThunk(
  'checkout/placeOrder',
  async (_, { rejectWithValue }) => {
    try {
      return await postJson('/carrito/checkout');
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    step: 1,
    // Las direcciones viven solo en el front (el backend todavía no las guarda)
    addresses: [],
    selectedAddressId: null,
    shippingMethod: 'free',
    scheduledDate: '',
    paymentMethod: 'card',
    order: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    // Se llama al entrar desde el carrito: arranca en el paso 1 sin la orden anterior
    startCheckout: (state) => {
      state.step = 1;
      state.order = null;
      state.status = 'idle';
      state.error = null;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    addAddress: (state, action) => {
      const address = { ...action.payload, id: Date.now() };
      state.addresses.push(address);
      state.selectedAddressId = address.id;
    },
    updateAddress: (state, action) => {
      state.addresses = state.addresses.map((address) =>
        address.id === action.payload.id ? action.payload : address,
      );
    },
    removeAddress: (state, action) => {
      state.addresses = state.addresses.filter((address) => address.id !== action.payload);
      if (state.selectedAddressId === action.payload) {
        state.selectedAddressId = state.addresses[0]?.id ?? null;
      }
    },
    selectAddress: (state, action) => {
      state.selectedAddressId = action.payload;
    },
    setShippingMethod: (state, action) => {
      state.shippingMethod = action.payload;
    },
    setScheduledDate: (state, action) => {
      state.scheduledDate = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.order = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  startCheckout,
  setStep,
  addAddress,
  updateAddress,
  removeAddress,
  selectAddress,
  setShippingMethod,
  setScheduledDate,
  setPaymentMethod,
} = checkoutSlice.actions;

export const selectSelectedAddress = (state) =>
  state.checkout.addresses.find((address) => address.id === state.checkout.selectedAddressId) ?? null;

export const selectShippingMethod = (state) =>
  SHIPPING_METHODS.find((method) => method.id === state.checkout.shippingMethod);

export default checkoutSlice.reducer;
