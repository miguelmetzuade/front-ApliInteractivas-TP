import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getJson, postJson } from '../../services/api';

const errorMessage = (error) => error.message || 'Ocurrió un error inesperado';

// POST /api/usuarios/login { email, password } -> { token, email, role }
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await postJson('/usuarios/login', credentials);
      // El token se guarda en localStorage para que api.js lo mande en cada request
      // y para que la sesión siga abierta al recargar la página
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

// POST /api/usuarios/register { nombreUsuario, email, password, nombre, apellido }
// Si el registro sale bien, iniciamos sesión con los mismos datos
export const register = createAsyncThunk(
  'auth/register',
  async (datos, { dispatch, rejectWithValue }) => {
    try {
      await postJson('/usuarios/register', datos);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
    return dispatch(login({ email: datos.email, password: datos.password })).unwrap();
  },
);

// GET /api/usuarios/me: datos del usuario logueado (nombre, nombreUsuario, rol...)
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await getJson('/usuarios/me');
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    // Si había un token guardado, arrancamos logueados (luego se valida con /usuarios/me)
    token: localStorage.getItem('token'),
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Token vencido o inválido: cerramos la sesión
      .addCase(fetchCurrentUser.rejected, (state) => {
        localStorage.removeItem('token');
        state.token = null;
        state.user = null;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

export const selectIsAuthenticated = (state) => Boolean(state.auth.token);

export default authSlice.reducer;
