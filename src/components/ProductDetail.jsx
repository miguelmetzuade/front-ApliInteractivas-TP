import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJson } from '../services/api';
import { addToCart } from '../store/slices/cartSlice';
import { addFavorite, removeFavorite } from '../store/slices/favoriteSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import ProductGrid from './ui/ProductGrid';
import iconLike from '../assets/home/like.svg';
import iconLikeFilled from '../assets/home/like-filled.svg';
import iconArrow from '../assets/product/arrow.svg';
import iconDelivery from '../assets/product/delivery.svg';
import iconStock from '../assets/product/stock.svg';
import iconVerify from '../assets/product/verify.svg';
import '../styles/ui/Button.css';
import '../styles/pages/ProductDetail.css';

// Componente 2: GET /api/productos/{id}
const ProductDetail = () => {
  // useParams extrae los parámetros de la URL.
  // Si la URL es /products/4, useParams devuelve { id: '4' }.
  const { id } = useParams();

  // useNavigate devuelve una función para navegar desde código.
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [related, setRelated] = useState([]);

  const dispatch = useDispatch();
  const adding = useSelector((state) => state.cart.pendingIds.includes(Number(id)));
  const liked = useSelector((state) =>
    state.favorites.items.some((favorite) => favorite.id === Number(id)),
  );
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

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setCartMessage(null);
    try {
      if (liked) await dispatch(removeFavorite(product.id)).unwrap();
      else await dispatch(addFavorite(product)).unwrap();
    } catch (err) {
      setCartMessage({ error: true, text: typeof err === 'string' ? err : 'No se pudo actualizar favoritos' });
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

  // Productos relacionados: misma categoría, sin el actual
  useEffect(() => {
    if (!product?.categoriaId) return;
    getJson(`/productos?categoriaId=${product.categoriaId}`)
      .then((data) => setRelated(data.filter((p) => p.id !== product.id).slice(0, 4)))
      .catch(() => setRelated([]));
  }, [product]);

  if (loading) return <div className="detail-status">Cargando producto...</div>;
  if (error) return <div className="detail-status error">Error: {error}</div>;
  if (!product) return <div className="detail-status">No se encontró el producto</div>;

<<<<<<< Updated upstream
  const imagen = product.imagenUrl || product.imagen;
  const inStock = product.stock > 0;
  const vendedor = product.vendedor || 'Sin vendedor';
  const features = [
    { icon: iconDelivery, label: 'Free Delivery', value: '1-2 day' },
    { icon: iconStock, label: inStock ? 'In Stock' : 'Out of Stock', value: inStock ? `${product.stock} units` : 'Agotado' },
    { icon: iconVerify, label: 'Guaranteed', value: '1 year' },
  ];
=======
  const imageUrl = product.image_url || product.imagenUrl || product.imagen;
>>>>>>> Stashed changes

  return (
    <div className="detail-page">
      <nav className="detail-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <img src={iconArrow} alt="" />
        <Link to={`/products?categoriaId=${product.categoriaId}`}>{product.categoriaNombre}</Link>
        <img src={iconArrow} alt="" />
        <span aria-current="page">{product.nombre}</span>
      </nav>

<<<<<<< Updated upstream
      <section className="detail-main">
        <div className="detail-image">
=======
      <div className="detail-card">
        {imageUrl && (
          <img className="detail-image" src={imageUrl} alt={product.nombre} />
        )}
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
>>>>>>> Stashed changes
          <button
            type="button"
            className="btn-like detail-like"
            aria-label={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            aria-pressed={liked}
            onClick={handleToggleFavorite}
          >
            <img src={liked ? iconLikeFilled : iconLike} alt="" />
          </button>
          {imagen
            ? <img src={imagen} alt={product.nombre} />
            : <span className="detail-image-placeholder">{product.nombre.charAt(0)}</span>}
        </div>

        <div className="detail-info">
          <h1 className="detail-nombre">{product.nombre}</h1>
          <p className="detail-precio">${product.precio.toLocaleString('es-AR')}</p>

          <div className="detail-datos">
            <div className="detail-dato">
              <span>Stock</span>
              <strong className={inStock ? 'en-stock' : 'sin-stock'}>{inStock ? product.stock : 'Agotado'}</strong>
            </div>
            <div className="detail-dato">
              <span>Disponible</span>
              <strong>{product.disponible ? 'Sí' : 'No'}</strong>
            </div>
            <div className="detail-dato">
              <span>Vendedor</span>
              <strong>{vendedor}</strong>
            </div>
            <div className="detail-dato">
              <span>Categoría</span>
              <strong>{product.categoriaNombre}</strong>
            </div>
          </div>

          <p className="detail-descripcion">{product.descripcion}</p>

          <div className="detail-buttons">
            <button
              type="button"
              className="btn-primary"
              onClick={handleAddToCart}
              disabled={adding || !inStock}
            >
              {adding ? 'Agregando...' : 'Add to Cart'}
            </button>
          </div>
          {cartMessage && (
            <p className={cartMessage.error ? 'detail-cart-message error' : 'detail-cart-message'} role="status">
              {cartMessage.text} {!cartMessage.error && <Link to="/cart">Ver carrito</Link>}
            </p>
          )}

          <div className="detail-features">
            {features.map((feature) => (
              <div className="detail-feature" key={feature.label}>
                <span className="detail-feature-icon"><img src={feature.icon} alt="" /></span>
                <p><span>{feature.label}</span><strong>{feature.value}</strong></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-section">
        <div className="detail-details">
          <h2>Details</h2>
          <p>{product.descripcion}</p>
          <div className="detail-lines">
            <div><span>Categoría</span><span>{product.categoriaNombre}</span></div>
            <div><span>Vendedor</span><span>{vendedor}</span></div>
            <div><span>Stock</span><span>{inStock ? product.stock : 'Agotado'}</span></div>
            <div><span>Disponible</span><span>{product.disponible ? 'Sí' : 'No'}</span></div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="detail-related">
          <h2>Related Products</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
