import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getJson } from '../../services/api';

const errorMessage = (error) => error.message || 'Ocurrió un error inesperado';

export const PAGE_SIZE = 9;

export const initialFilters = {
  categoriaId: [],
  vendedorId: [],
  precioMin: '',
  precioMax: '',
  soloConStock: false,
  busqueda: '',
  orden: 'nombre_asc',
  pagina: 1,
};

// Arma el query string de GET /productos: los filtros vacíos no se envían
const buildQuery = (filters) => {
  const params = new URLSearchParams();
  filters.categoriaId.forEach((id) => params.append('categoriaId', id));
  filters.vendedorId.forEach((id) => params.append('vendedorId', id));
  if (filters.precioMin !== '') params.set('precioMin', filters.precioMin);
  if (filters.precioMax !== '') params.set('precioMax', filters.precioMax);
  if (filters.soloConStock) params.set('soloConStock', 'true');
  if (filters.busqueda.trim()) params.set('busqueda', filters.busqueda.trim());
  params.set('orden', filters.orden);
  params.set('pagina', filters.pagina);
  params.set('tamanio', PAGE_SIZE);
  return params.toString();
};

// GET /productos con los filtros actuales del store
export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      return await getJson(`/productos?${buildQuery(getState().products.filters)}`);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

// GET /productos/filtros: opciones y contadores de la barra lateral (se pide una sola vez)
export const fetchFacets = createAsyncThunk(
  'products/fetchFacets',
  async (_, { rejectWithValue }) => {
    try {
      return await getJson('/productos/filtros');
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => getState().products.facetsStatus === 'idle',
  },
);

// Cualquier cambio de filtro vuelve a la página 1
const withFilter = (state, changes) => {
  state.filters = { ...state.filters, ...changes, pagina: 1 };
};

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    filters: initialFilters,
    items: [],
    totalProductos: 0,
    totalPaginas: 1,
    status: 'idle',
    error: null,
    requestId: null,
    facets: null,
    facetsStatus: 'idle',
  },
  reducers: {
    setCategorias: (state, action) => withFilter(state, { categoriaId: action.payload }),
    setVendedores: (state, action) => withFilter(state, { vendedorId: action.payload }),
    setPrecio: (state, action) => withFilter(state, action.payload),
    setSoloConStock: (state, action) => withFilter(state, { soloConStock: action.payload }),
    setOrden: (state, action) => withFilter(state, { orden: action.payload }),
    setPagina: (state, action) => {
      state.filters.pagina = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        // Si ya se lanzó otra búsqueda, ignoramos esta respuesta vieja
        if (state.requestId !== action.meta.requestId) return;
        state.status = 'succeeded';
        state.items = action.payload.productos;
        state.totalProductos = action.payload.totalProductos;
        state.totalPaginas = Math.max(1, action.payload.totalPaginas);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchFacets.pending, (state) => {
        state.facetsStatus = 'loading';
      })
      .addCase(fetchFacets.fulfilled, (state, action) => {
        state.facetsStatus = 'succeeded';
        state.facets = action.payload;
      })
      .addCase(fetchFacets.rejected, (state) => {
        state.facetsStatus = 'failed';
      });
  },
});

export const {
  setCategorias,
  setVendedores,
  setPrecio,
  setSoloConStock,
  setOrden,
  setPagina,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
