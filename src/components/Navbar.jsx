import { NavLink } from 'react-router-dom';
import './Navbar.css';

// NavLink es como Link, pero agrega la clase "active" al link de la ruta actual
const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">E-commerce</NavLink>
      <div className="navbar-links">
        <NavLink to="/productos">Productos</NavLink>
        <NavLink to="/categorias">Categorías</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
