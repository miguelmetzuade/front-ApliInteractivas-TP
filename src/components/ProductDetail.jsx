import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJson } from '../services/api';
import './ProductDetail.css';

// Componente 2: GET /api/productos/{id}
const ProductDetail = () => {
  // useParams extrae los parámetros de la URL.
  // Si la URL es /productos/4, useParams devuelve { id: '4' }.
  const { id } = useParams();

  // useNavigate devuelve una función para navegar desde código (ej: botón "Volver").
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Se vuelve a ejecutar si cambia el id de la URL
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getJson(`/productos/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="detail-status">Cargando producto...</div>;
  if (error) return <div className="detail-status error">Error: {error}</div>;
  if (!product) return <div className="detail-status">No se encontró el producto</div>;

  return (
    <div className="detail-container">
      <button className="detail-back" onClick={() => navigate(-1)}>← Volver</button>

      <div className="detail-card">
        <Link to={`/productos?categoriaId=${product.categoriaId}`} className="detail-categoria">
          {product.categoriaNombre}
        </Link>

        <h1 className="detail-nombre">{product.nombre}</h1>
        <p className="detail-descripcion">{product.descripcion}</p>

        <p className="detail-precio">${product.precio.toLocaleString('es-AR')}</p>

        <ul className="detail-datos">
          <li>
            <strong>Stock:</strong>{' '}
            <span className={product.stock > 0 ? 'en-stock' : 'sin-stock'}>
              {product.stock > 0 ? product.stock : 'Agotado'}
            </span>
          </li>
          <li><strong>Disponible:</strong> {product.disponible ? 'Sí' : 'No'}</li>
          {/* operador ||: si el producto no tiene vendedor mostramos un texto alternativo */}
          <li><strong>Vendedor:</strong> {product.vendedor || 'Sin vendedor'}</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDetail;
