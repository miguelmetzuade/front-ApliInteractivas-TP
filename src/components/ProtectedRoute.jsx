import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../store/slices/authSlice'

function ProtectedRoute() {
  // Hay sesión si existe el token JWT que devolvió el login
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const location = useLocation()

  // Si no está logueado, lo redirige al Login guardando a dónde quería ir
  // (operador ternario: si está autenticado renderiza las rutas hijas con Outlet)
  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />
}

export default ProtectedRoute
