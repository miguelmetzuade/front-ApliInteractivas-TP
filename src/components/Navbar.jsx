import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartCount } from '../store/slices/cartSlice'
import { logout, selectIsAuthenticated } from '../store/slices/authSlice'
import '../styles/layout/Navbar.css'
import logo from '../assets/home/logo.svg'
import iconSearch from '../assets/home/icon-search.svg'
import iconFavorites from '../assets/home/icon-favorites.svg'
import iconCart from '../assets/home/icon-cart.svg'
import iconUser from '../assets/home/icon-user.svg'

const LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/products', label: 'Productos' },
  // { to: '/categories', label: 'Categorías' },
  { to: '/seller', label: 'Mis productos' },
  // { to: '/about', label: 'Acerca de' },
  // { to: '/contact', label: 'Contacto' },
]

function Navbar() {
  const cartCount = useSelector(selectCartCount)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Cierra el menú al hacer click afuera
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    setMenuOpen(false)
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" aria-label="Inicio">
          <img src={logo} alt="cyber" />
        </Link>

        {/* Por ahora el buscador es solo visual: falta el endpoint de búsqueda */}
        <label className="navbar-search">
          <img src={iconSearch} alt="" />
          <input type="search" placeholder="Buscar" />
        </label>

        <nav>
          <ul className="nav-menu">
            {LINKS.map(({ to, label, end }) => (
              <li key={to}>
                {/* NavLink agrega la clase "active" sola cuando la ruta coincide */}
                <NavLink to={to} end={end} className="nav-link">
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar-icons">
          <Link to="/favorites" aria-label="Favoritos"><img src={iconFavorites} alt="" /></Link>
          <Link to="/cart" aria-label={`Carrito (${cartCount})`} className="navbar-cart">
            <img src={iconCart} alt="" />
            {cartCount > 0 && <span className="navbar-cart-count">{cartCount}</span>}
          </Link>
          {/* Con sesión: nombre de usuario y botón para salir. Sin sesión: link al login */}
          {isAuthenticated ? (
            <div className="navbar-user" ref={menuRef}>
              <button
                type="button"
                className="navbar-user-toggle"
                aria-label="Menú de usuario"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <img src={iconUser} alt="" />
              </button>
              {menuOpen && (
                <div className="navbar-user-menu" role="menu">
                  <span className="navbar-user-email">{user?.email || user?.nombreUsuario}</span>
                  {/* Por ahora no hace nada: falta la pantalla de perfil */}
                  <button type="button" role="menuitem" className="navbar-user-item">Mi perfil</button>
                  {/* Igual que el perfil: faltan las pantallas */}
                  <button type="button" role="menuitem" className="navbar-user-item">Mis compras</button>
                  <button type="button" role="menuitem" className="navbar-user-item">Mis ventas</button>
                  <button type="button" role="menuitem" className="navbar-user-item" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" aria-label="Iniciar sesión"><img src={iconUser} alt="" /></Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
