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

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        {categoriaId && products[0]?.categoriaNombre && (
          <h2 className="product-list-title">{products[0].categoriaNombre}</h2>
        )}
        <Link to="/products/new" className="product-list-add-button">
          <span aria-hidden="true">+</span>
          Agregar Producto
        </Link>
      </div>

      {categoriaId && (
        <Link to="/products" className="product-list-clear">← Ver todos los productos</Link>
      )}

      {loading ? (
        <p className="product-list-status">Cargando productos...</p>
      ) : error ? (
        <p className="product-list-status error">Error: {error}</p>
      ) : products.length === 0 ? (
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
