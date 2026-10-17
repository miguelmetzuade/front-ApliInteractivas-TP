import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getJson } from '../services/api';
import ProductCard from './ProductCard';
import '../styles/pages/ProductList.css';

// Componente 1: GET /api/productos (opcionalmente filtrado por ?categoriaId=)
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useSearchParams lee los query params de la URL. Ej: /products?categoriaId=1
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get('categoriaId');

  // useEffect con [categoriaId]: se ejecuta al montar el componente
  // y cada vez que cambia la categoría seleccionada.
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = categoriaId ? `/productos?categoriaId=${categoriaId}` : '/productos';
        const data = await getJson(endpoint);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoriaId]);

  // --- Manejo de estados de carga y error ---
  // Si 'loading' es true, se muestra un mensaje de carga mientras se esperan los datos de la API.
  if (loading) return <div className="product-list-status">Cargando productos...</div>;

  // Si 'error' tiene un valor (no es null), la petición falló y se informa al usuario.
  if (error) return <div className="product-list-status error">Error: {error}</div>;

  return (
    <div className="product-list-container">
      {/* operador lógico &&: el título (nombre de la categoría) solo aparece si hay un filtro aplicado */}
      {categoriaId && products[0]?.categoriaNombre && (
        <h2 className="product-list-title">{products[0].categoriaNombre}</h2>
      )}

      {/* operador lógico &&: el link solo aparece si hay un filtro aplicado */}
      {categoriaId && (
        <Link to="/products" className="product-list-clear">← Ver todos los productos</Link>
      )}

      {/* Renderizado condicional: operador ternario */}
      {products.length === 0 ? (
        <p className="product-list-status">No hay productos disponibles</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
