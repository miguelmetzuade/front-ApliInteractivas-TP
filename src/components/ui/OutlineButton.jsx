import { Link } from 'react-router-dom';
import '../../styles/ui/OutlineButton.css';

// Botón con borde del Figma ("Shop Now"). variant: 'dark' (fondo claro) o 'light' (fondo oscuro)
const OutlineButton = ({ to, variant = 'dark', children }) => (
  <Link to={to} className={`btn-outline btn-outline-${variant}`}>
    {children}
  </Link>
);

export default OutlineButton;
