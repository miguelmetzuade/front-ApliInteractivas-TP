import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, register, selectIsAuthenticated } from '../store/slices/authSlice';
import StatusMessage from './ui/StatusMessage';
import '../styles/ui/Button.css';
import '../styles/pages/Auth.css';

const EMPTY_FORM = { nombreUsuario: '', email: '', password: '', nombre: '', apellido: '' };

// Campos que pide la consigna para el registro
const FIELDS = [
  { name: 'nombreUsuario', label: 'Nombre de usuario', autoComplete: 'username' },
  { name: 'email', label: 'Mail', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Contraseña', type: 'password', autoComplete: 'new-password' },
  { name: 'nombre', label: 'Nombre', autoComplete: 'given-name' },
  { name: 'apellido', label: 'Apellido', autoComplete: 'family-name' },
];

// Registro: POST /api/usuarios/register y, si sale bien, login automático
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [form, setForm] = useState(EMPTY_FORM);

  const destination = location.state?.from?.pathname || '/';
  const loading = status === 'loading';

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register({
        ...form,
        nombreUsuario: form.nombreUsuario.trim(),
        email: form.email.trim(),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
      })).unwrap();
      navigate(destination, { replace: true });
    } catch {
      // el mensaje de error queda en el store y se muestra arriba del formulario
    }
  };

  if (isAuthenticated && !loading) return <Navigate to={destination} replace />;

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Crear cuenta</h1>
        {error && <StatusMessage error>{error}</StatusMessage>}
        {FIELDS.map(({ name, label, type = 'text', autoComplete }) => (
          <label key={name} className="auth-field">
            <span>{label}</span>
            <input
              className="auth-input"
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              autoComplete={autoComplete}
              required
              disabled={loading}
            />
          </label>
        ))}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Registrarme'}
        </button>
        <p className="auth-switch">
          ¿Ya tenés cuenta? <Link to="/login" state={location.state}>Iniciá sesión</Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
