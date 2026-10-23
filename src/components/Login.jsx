import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, login, selectIsAuthenticated } from '../store/slices/authSlice';
import StatusMessage from './ui/StatusMessage';
import '../styles/ui/Button.css';
import '../styles/pages/Auth.css';

// Login: POST /api/usuarios/login con mail y contraseña
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  // Si ProtectedRoute nos mandó acá, después del login volvemos a la página que se quería ver
  const destination = location.state?.from?.pathname || '/';
  const loading = status === 'loading';

  // Limpiamos el error que pudo haber quedado de otra pantalla (ej: registro)
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(credentials)).unwrap();
      navigate(destination, { replace: true });
    } catch {
      // el mensaje de error queda en el store y se muestra abajo
    }
  };

  // Si ya hay sesión iniciada no tiene sentido mostrar el formulario
  if (isAuthenticated && !loading) return <Navigate to={destination} replace />;

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Iniciar sesión</h1>
        {error && <StatusMessage error>{error}</StatusMessage>}
        <label className="auth-field">
          <span>Mail</span>
          <input
            className="auth-input"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            autoComplete="email"
            required
            disabled={loading}
          />
        </label>
        <label className="auth-field">
          <span>Contraseña</span>
          <input
            className="auth-input"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </label>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
        <p className="auth-switch">
          ¿No tenés cuenta? <Link to="/register" state={location.state}>Registrate</Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
