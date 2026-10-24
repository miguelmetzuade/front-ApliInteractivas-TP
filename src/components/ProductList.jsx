import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFacets,
  fetchProducts,
  setCategorias,
  setVendedores,
  setPrecio,
  setSoloConStock,
  setOrden,
  setPagina,
} from '../store/slices/productsSlice';
import ProductCard from './ProductCard';
import iconArrow from '../assets/product/arrow.svg';
import iconExpandLess from '../assets/filters/expand-less.svg';
import iconExpandMore from '../assets/filters/expand-more.svg';
import iconChecked from '../assets/filters/checked.svg';
import iconUnchecked from '../assets/filters/unchecked.svg';
import iconSearch from '../assets/filters/search.svg';
import '../styles/pages/ProductList.css';

const SORT_OPTIONS = [
  { value: 'nombre_asc', label: 'Name A-Z' },
  { value: 'precio_asc', label: 'Price: low to high' },
  { value: 'precio_desc', label: 'Price: high to low' },
];

// Páginas a mostrar: 1 2 3 … última, como en el Figma
const getPageItems = (page, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const items = new Set([1, 2, 3, total, page - 1, page, page + 1]);
  const sorted = [...items].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) result.push('...');
    result.push(n);
  });
  return result;
};

const FilterGroup = ({ title, open, onToggle, children }) => (
  <div className="filter-group">
    <button type="button" className="filter-group-header" onClick={onToggle} aria-expanded={open}>
      <span>{title}</span>
      <img src={open ? iconExpandLess : iconExpandMore} alt="" />
    </button>
    {open && <div className="filter-group-body">{children}</div>}
  </div>
);

const FilterOption = ({ label, count, checked, onChange }) => (
  <label className="filter-option">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <img src={checked ? iconChecked : iconUnchecked} alt="" />
    <span className="filter-option-label">
      {label} <span className="filter-option-count">{count}</span>
    </span>
  </label>
);

// Componente 1: GET /api/productos con filtros, orden y paginación resueltos en el backend.
// Los filtros viven en el store de Redux (productsSlice); acá solo se leen y se modifican.
const ProductList = () => {
  const dispatch = useDispatch();
  const { filters, items, totalProductos, totalPaginas, status, error, facets } = useSelector(
    (state) => state.products,
  );

  // useSearchParams lee los query params de la URL. Ej: /products?categoriaId=1
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoriaId');

  const [categorySearch, setCategorySearch] = useState('');
  const [open, setOpen] = useState({ category: true, seller: false, price: false, availability: false });
  // Los precios se escriben en estado local y se envían al store con un pequeño retraso
  const [minPrice, setMinPrice] = useState(filters.precioMin);
  const [maxPrice, setMaxPrice] = useState(filters.precioMax);

  // Las opciones de la barra lateral se piden una sola vez
  useEffect(() => {
    dispatch(fetchFacets());
  }, [dispatch]);

  // La categoría de la URL (?categoriaId=) llega como filtro ya marcado
  useEffect(() => {
    if (categoriaId) dispatch(setCategorias([Number(categoriaId)]));
  }, [categoriaId, dispatch]);

  // Cada vez que cambian los filtros se vuelve a pedir el listado al backend
  useEffect(() => {
    dispatch(fetchProducts());
  }, [filters, dispatch]);

  // Debounce del rango de precio
  useEffect(() => {
    if (minPrice === filters.precioMin && maxPrice === filters.precioMax) return undefined;
    const timer = setTimeout(() => dispatch(setPrecio({ precioMin: minPrice, precioMax: maxPrice })), 400);
    return () => clearTimeout(timer);
  }, [minPrice, maxPrice, filters.precioMin, filters.precioMax, dispatch]);

  const toggleGroup = (key) => setOpen((current) => ({ ...current, [key]: !current[key] }));
  const toggleId = (list, id) => (list.includes(id) ? list.filter((v) => v !== id) : [...list, id]);
  const goToPage = (n) => {
    dispatch(setPagina(n));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentPage = filters.pagina;

  // --- Manejo de estados de carga y error ---
  if (status === 'idle' || (status === 'loading' && items.length === 0)) {
    return <div className="product-list-status">Cargando productos...</div>;
  }
  if (status === 'failed') return <div className="product-list-status error">Error: {error}</div>;

  const categorias = (facets?.categorias ?? []).filter((c) => (
    c.nombre.toLowerCase().includes(categorySearch.trim().toLowerCase())
  ));
  const vendedores = facets?.vendedores ?? [];
  const activeCategory = filters.categoriaId.length === 1
    ? facets?.categorias.find((c) => c.id === filters.categoriaId[0])?.nombre
    : null;

  return (
    <div className="product-list-page">
      <nav className="product-list-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <img src={iconArrow} alt="" />
        <Link to="/products">Catalog</Link>
        {activeCategory && (
          <>
            <img src={iconArrow} alt="" />
            <span aria-current="page">{activeCategory}</span>
          </>
        )}
      </nav>

      <div className="product-list-content">
        <aside className="filters" aria-label="Filtros">
          <FilterGroup title="Category" open={open.category} onToggle={() => toggleGroup('category')}>
            <label className="filter-search">
              <img src={iconSearch} alt="" />
              <input
                type="text"
                placeholder="Search"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
              />
            </label>
            <div className="filter-options">
              {categorias.map((c) => (
                <FilterOption
                  key={c.id}
                  label={c.nombre}
                  count={c.cantidad}
                  checked={filters.categoriaId.includes(c.id)}
                  onChange={() => dispatch(setCategorias(toggleId(filters.categoriaId, c.id)))}
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Seller" open={open.seller} onToggle={() => toggleGroup('seller')}>
            <div className="filter-options">
              {vendedores.map((v) => (
                <FilterOption
                  key={v.id}
                  label={v.nombre}
                  count={v.cantidad}
                  checked={filters.vendedorId.includes(v.id)}
                  onChange={() => dispatch(setVendedores(toggleId(filters.vendedorId, v.id)))}
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Price" open={open.price} onToggle={() => toggleGroup('price')}>
            <div className="filter-price">
              <input
                type="number"
                min="0"
                placeholder={facets?.precioMinimo != null ? `Min ${facets.precioMinimo}` : 'Min'}
                aria-label="Precio mínimo"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                min="0"
                placeholder={facets?.precioMaximo != null ? `Max ${facets.precioMaximo}` : 'Max'}
                aria-label="Precio máximo"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </FilterGroup>

          <FilterGroup title="Availability" open={open.availability} onToggle={() => toggleGroup('availability')}>
            <div className="filter-options">
              <FilterOption
                label="In stock"
                count={facets?.cantidadConStock ?? 0}
                checked={filters.soloConStock}
                onChange={() => dispatch(setSoloConStock(!filters.soloConStock))}
              />
            </div>
          </FilterGroup>
        </aside>

        <section className="product-list-main">
          <div className="product-list-top">
            <p className="product-list-count">
              Selected Products: <strong>{totalProductos}</strong>
            </p>
            <label className="product-list-sort">
              <span className="sr-only">Ordenar por</span>
              <select value={filters.orden} onChange={(e) => dispatch(setOrden(e.target.value))}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Renderizado condicional: operador ternario */}
          {items.length === 0 ? (
            <p className="product-list-empty">No hay productos disponibles</p>
          ) : (
            <div className="products-grid">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPaginas > 1 && (
            <nav className="pagination" aria-label="Paginación">
              <button
                type="button"
                className="pagination-arrow prev"
                aria-label="Página anterior"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                <img src={iconArrow} alt="" />
              </button>
              {getPageItems(currentPage, totalPaginas).map((item, i) => (
                item === '...'
                  ? <span key={`dots-${i}`} className="pagination-dots">...</span>
                  : (
                    <button
                      key={item}
                      type="button"
                      className={item === currentPage ? 'pagination-page active' : 'pagination-page'}
                      aria-current={item === currentPage ? 'page' : undefined}
                      onClick={() => goToPage(item)}
                    >
                      {item}
                    </button>
                  )
              ))}
              <button
                type="button"
                className="pagination-arrow next"
                aria-label="Página siguiente"
                disabled={currentPage === totalPaginas}
                onClick={() => goToPage(currentPage + 1)}
              >
                <img src={iconArrow} alt="" />
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductList;
