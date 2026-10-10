import { Navigate, Outlet, useLocation } from 'react-router-dom'

function ProtectedRoute() {
  const isAuthenticated = true;

  // Si no está logueado, lo redirige al Login
  if (!isAuthenticated) {
    return <Navigate to="/login"  />
  }

  // Si está autenticado, renderiza las rutas hijas (Outlet)
  return <Outlet />
}

export default ProtectedRoute


