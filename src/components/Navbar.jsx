import { Link, useLocation } from 'react-router-dom'
import '../styles/Navbar.css'

function Navbar() {
  const location = useLocation()

  // startsWith: "Productos" queda activo también en el detalle (/products/4)
  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🛒 E-Commerce UADE
        </Link>

        <ul className="nav-menu">
          <li>
            <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/products" className={isActive('/products') ? 'nav-link active' : 'nav-link'}>
              Productos
            </Link>
          </li>
          <li>
            <Link to="/categories" className={isActive('/categories') ? 'nav-link active' : 'nav-link'}>
              Categorías
            </Link>
          </li>
          <li>
            <Link to="/about" className={isActive('/about') ? 'nav-link active' : 'nav-link'}>
              Acerca de
            </Link>
          </li>
          <li>
            <Link to="/contact" className={isActive('/contact') ? 'nav-link active' : 'nav-link'}>
              Contacto
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
