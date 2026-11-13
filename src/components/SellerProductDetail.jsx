import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJson } from '../services/api';
import { formatPrice } from '../utils/formatPrice';
import iconArrow from '../assets/product/arrow.svg';
import '../styles/pages/ProductDetail.css';
import '../styles/pages/SellerProducts.css';

// Detalle de un producto propio (vista vendedor): GET /api/productos/mios/{id}
// A diferencia de ProductDetail, no hay acciones de comprador (carrito, favoritos, relacionados):
// un usuario no puede comprarse sus propios productos.
const SellerProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        setProduct(await getJson(`/productos/mios/${id}`));
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

  const imageUrl = product.image_url || product.imagenUrl || product.imagen;
  const inStock = product.stock > 0;

  return (
    <div className="detail-page">
      <nav className="detail-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/seller">Mis productos</Link>
        <img src={iconArrow} alt="" />
        <span aria-current="page">{product.nombre}</span>
      </nav>

      <section className="detail-main">
        <div className="detail-image">
          {imageUrl
            ? <img src={imageUrl} alt={product.nombre} />
            : <span className="detail-image-placeholder">{product.nombre.charAt(0)}</span>}
        </div>

        <div className="detail-info">
          <span className="seller-detail-badge">Tu publicación</span>
          <h1 className="detail-nombre">{product.nombre}</h1>
          <p className="detail-precio">{formatPrice(product.precio)}</p>

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
              <span>Categoría</span>
              <strong>{product.categoriaNombre}</strong>
            </div>
          </div>

          <p className="detail-descripcion">{product.descripcion}</p>

          <Link to="/seller" className="seller-detail-back">Volver a Mis productos</Link>
        </div>
      </section>
    </div>
  );
};

export default SellerProductDetail;
