import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

const API_URL = 'http://localhost:8080/api/productos';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            // Esperamos recibir JSON como respuesta
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // Enviamos el token JWT solo si existe (necesario para rutas protegidas)
            ...(token && { 'Authorization': token })
          },
          // Envía cookies/credenciales (el backend tiene setAllowCredentials(true))
          credentials: 'include',
          // Petición CORS: front y back están en distintos puertos
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="product-list-container">Cargando productos...</div>;
  if (error) return <div className="product-list-container">Error: {error}</div>;

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Nuestros Productos</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
