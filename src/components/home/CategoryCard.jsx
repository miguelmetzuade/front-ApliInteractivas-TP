import { Link } from 'react-router-dom';
import CategoryIcon from './CategoryIcon';
import '../../styles/home/CategoryCard.css';

// Tarjeta gris con ícono + nombre; lleva a la lista de productos filtrada por esa categoría
const CategoryCard = ({ categoria, index }) => (
  <Link to={`/products?categoriaId=${categoria.id}`} className="category-card-home">
    <CategoryIcon nombre={categoria.nombre} index={index} />
    <span>{categoria.nombre}</span>
  </Link>
);

export default CategoryCard;
