import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJson } from '../services/api';
import './CategoryList.css';

// Componente 3: GET /api/categorias
const CategoryList = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Array de dependencias vacío: se ejecuta una sola vez al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getJson('/categorias');
        setCategorias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  if (loading) return <div className="category-status">Cargando categorías...</div>;
  if (error) return <div className="category-status error">Error: {error}</div>;

  return (
    <div className="category-container">
      <h2 className="category-title">Categorías</h2>

      {categorias.length === 0 ? (
        <p className="category-status">No hay categorías cargadas</p>
      ) : (
        <div className="category-grid">
          {categorias.map((categoria) => (
            // Al hacer click, vamos a la lista de productos filtrada por esta categoría
            <Link
              key={categoria.id}
              to={`/productos?categoriaId=${categoria.id}`}
              className="category-card"
            >
              {categoria.nombre}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
