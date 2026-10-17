import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/slices/favoriteSlice';
import '../styles/products/ProductCard.css';
import iconLike from '../assets/home/like.svg';
import iconLikeFilled from '../assets/home/like-filled.svg';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const liked = useSelector((state) =>
    state.favorites.items.some((favorite) => favorite.id === product.id),
  );
  const pending = useSelector((state) => state.favorites.pendingIds.includes(product.id));
  const [favoriteError, setFavoriteError] = useState('');
  const imagen = product.imagenUrl || product.imagen;

  const toggleFavorite = async () => {
    setFavoriteError('');
    try {
      if (liked) {
        await dispatch(removeFavorite(product.id)).unwrap();
      } else {
        await dispatch(addFavorite(product)).unwrap();
      }
    } catch (error) {
      setFavoriteError(typeof error === 'string' ? error : 'No se pudo actualizar favoritos');
    }
  };

  return (
    <div className="card-producto">
      <div className="producto-top">
        <button
          type="button"
          className="btn-like"
          aria-label={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          aria-pressed={liked}
          onClick={toggleFavorite}
          disabled={pending}
        >
          <img src={liked ? iconLikeFilled : iconLike} alt="" />
        </button>
      </div>
      {favoriteError && <span className="favorite-error" role="alert">{favoriteError}</span>}

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
