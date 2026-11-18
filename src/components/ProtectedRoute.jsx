import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../store/slices/authSlice'
import StatusMessage from './ui/StatusMessage'

function ProtectedRoute() {
  // Hay sesión si el back devolvió los datos del usuario (login o GET /usuarios/me con la cookie)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  // Al recargar la página, todavía no sabemos si la cookie es válida: esperamos la respuesta de /usuarios/me
  const sessionChecked = useSelector((state) => state.auth.sessionChecked)
  const location = useLocation()

  if (!sessionChecked) {
    return <StatusMessage>Cargando...</StatusMessage>
  }

  // Si no está logueado, lo redirige al Login guardando a dónde quería ir
  // (operador ternario: si está autenticado renderiza las rutas hijas con Outlet)
  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />
}

export default ProtectedRoute
