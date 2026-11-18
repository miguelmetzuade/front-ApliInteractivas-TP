import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getJson, postJson } from '../../services/api';

const errorMessage = (error) => error.message || 'Ocurrió un error inesperado';

// POST /api/usuarios/login { email, password } -> datos del usuario.
// El JWT no llega en el body: el back lo manda en una cookie HttpOnly ("sesion") que el navegador
// guarda solo y que JavaScript no puede leer. Acá solo guardamos los datos del usuario en Redux.
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await postJson('/usuarios/login', credentials);
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

// GET /api/usuarios/me: datos del usuario logueado.
// Se llama al cargar la app: como el front no puede leer la cookie, le pregunta al back
// si hay una sesión válida. 200 -> hay sesión; 401 -> no hay cookie o el token venció.
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

// POST /api/usuarios/logout: el back borra la cookie (JavaScript no puede borrar una cookie HttpOnly).
// Nunca falla: aunque el back no responda, el estado del front se limpia igual.
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await postJson('/usuarios/logout');
  } catch {
    // si falla la llamada, igual cerramos la sesión en el front
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    // Datos del usuario logueado (null = sin sesión). El token nunca pasa por el front.
    user: null,
    // false hasta que /usuarios/me responde: mientras tanto no sabemos si hay sesión
    // (ProtectedRoute espera a este flag para no mandar al login al recargar la página)
    sessionChecked: false,
    status: 'idle',
    error: null,
  },
  reducers: {
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
        state.user = action.payload;
        state.sessionChecked = true;
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
        state.sessionChecked = true;
      })
      // Sin cookie o con el token vencido: no hay sesión
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.sessionChecked = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export const selectIsAuthenticated = (state) => Boolean(state.auth.user);

export default authSlice.reducer;
