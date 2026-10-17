import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../store/slices/favoriteSlice';
import ProductGrid from './ui/ProductGrid';
import '../styles/pages/Favorites.css';

const Favorites = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (status === 'loading' || status === 'idle') {
    return <p className="favorites-status">Cargando favoritos...</p>;
  }

  if (status === 'failed') {
    return <p className="favorites-status error">Error al cargar favoritos: {error}</p>;
  }

  return (
    <main className="favorites-page">
      <h1 className="favorites-title">Mis favoritos</h1>
      {items.length === 0 ? (
        <p className="favorites-status">Todavía no agregaste productos a favoritos.</p>
      ) : (
        <ProductGrid products={items} />
      )}
    </main>
  );
};

export default Favorites;
