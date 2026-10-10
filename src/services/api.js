// URL base del backend (Spring Boot)
export const API_URL = 'http://localhost:8080/api';

// Hace un GET al backend y devuelve el JSON de la respuesta.
// Centraliza las opciones de fetch para no repetirlas en cada componente.
export const getJson = async (endpoint) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}${endpoint}`, {
    // Especificamos el método HTTP a utilizar
    method: 'GET',

    headers: {
      // Indica al servidor que esperamos recibir JSON como respuesta
      'Accept': 'application/json',

      // Indica al servidor que estamos enviando datos en formato JSON
      'Content-Type': 'application/json',

      // Envía el token JWT solo si existe en localStorage (necesario para rutas protegidas).
      // El JwtFilter del backend espera el formato "Bearer <token>"
      ...(token && { 'Authorization': `Bearer ${token}` })
    },

    // Permite el envío de cookies y credenciales de autenticación
    // Esto es necesario porque en el backend tenemos configuration.setAllowCredentials(true)
    credentials: 'include',

    // Especifica que esta es una petición CORS (Cross-Origin Resource Sharing)
    // Útil cuando el frontend y backend están en diferentes puertos/dominios
    mode: 'cors'
  });

  if (!response.ok) {
    // El GlobalExceptionHandler devuelve el mensaje como texto plano,
    // y SecurityConfig devuelve {"error": "..."} en los 401/403
    const text = await response.text();
    let message = text;
    try {
      message = JSON.parse(text).error ?? text;
    } catch {
      // no era JSON: usamos el texto tal cual
    }
    throw new Error(message || `Error ${response.status}`);
  }

  return response.json();
};
