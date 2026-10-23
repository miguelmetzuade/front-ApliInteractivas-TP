import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJson } from '../services/api';
import { addToCart } from '../store/slices/cartSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import '../styles/ui/Button.css';
import '../styles/pages/ProductDetail.css';

// Componente 2: GET /api/productos/{id}
const ProductDetail = () => {
  // useParams extrae los parámetros de la URL.
  // Si la URL es /products/4, useParams devuelve { id: '4' }.
  const { id } = useParams();

  // useNavigate devuelve una función para navegar desde código (ej: botón "Volver").
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const adding = useSelector((state) => state.cart.pendingIds.includes(Number(id)));
  const [cartMessage, setCartMessage] = useState(null);

  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleAddToCart = async () => {
    // El carrito es del usuario logueado: sin sesión lo mandamos al login y después vuelve acá
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setCartMessage(null);
    try {
      await dispatch(addToCart({ productoId: product.id, cantidad: 1 })).unwrap();
      setCartMessage({ error: false, text: 'Producto agregado al carrito.' });
    } catch (err) {
      setCartMessage({ error: true, text: typeof err === 'string' ? err : 'No se pudo agregar al carrito' });
    }
  };

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
        <Link to={`/products?categoriaId=${product.categoriaId}`} className="detail-categoria">
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

        <div className="detail-cart">
          <button
            type="button"
            className="btn-primary"
            onClick={handleAddToCart}
            disabled={adding || product.stock <= 0}
          >
            {adding ? 'Agregando...' : 'Agregar al carrito'}
          </button>
          {cartMessage && (
            <p className={cartMessage.error ? 'detail-cart-message error' : 'detail-cart-message'} role="status">
              {cartMessage.text} {!cartMessage.error && <Link to="/cart">Ver carrito</Link>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
