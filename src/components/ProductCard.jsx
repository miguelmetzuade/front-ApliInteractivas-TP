import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/products/ProductCard.css';
import iconLike from '../assets/home/like.svg';
import iconLikeFilled from '../assets/home/like-filled.svg';

const ProductCard = ({ product }) => {
  // Por ahora el "me gusta" es solo local (no se guarda en el backend)
  const [liked, setLiked] = useState(false);
  const imagen = product.imagenUrl || product.imagen;

  return (
    <div className="card-producto">
      <div className="producto-top">
        <button
          type="button"
          className="btn-like"
          aria-label={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          aria-pressed={liked}
          onClick={() => setLiked(!liked)}
        >
          <img src={liked ? iconLikeFilled : iconLike} alt="" />
        </button>
      </div>

      {/* Link de react-router: navega al detalle sin recargar la página */}
      <Link to={`/products/${product.id}`} className="producto-imagen">
        {imagen
          ? <img src={imagen} alt={product.nombre} />
          : <span className="producto-imagen-placeholder">{product.nombre.charAt(0)}</span>}
      </Link>

      <div className="producto-info">
        <Link to={`/products/${product.id}`} className="producto-link">
          <h3 className="producto-nombre">{product.nombre}</h3>
        </Link>
        <span className="producto-precio">${product.precio.toLocaleString('es-AR')}</span>
        {product.stock <= 0 && <span className="sin-stock">Agotado</span>}
      </div>

      <Link to={`/products/${product.id}`} className="btn-comprar">Comprar</Link>
    </div>
  );
};

export default ProductCard;
