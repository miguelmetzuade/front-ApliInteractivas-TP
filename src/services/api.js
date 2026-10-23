// URL base del backend (Spring Boot)
export const API_URL = 'http://localhost:8080/api';

// Hace un GET al backend y devuelve el JSON de la respuesta.
// Centraliza las opciones de fetch para no repetirlas en cada componente.
const requestJson = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}${endpoint}`, {
    // Especificamos el método HTTP a utilizar
    method: options.method ?? 'GET',

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
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    credentials: 'include',

    // Especifica que esta es una petición CORS (Cross-Origin Resource Sharing)
    // Útil cuando el frontend y backend están en diferentes puertos/dominios
    mode: 'cors'
  });

  if (!response.ok) {
    // Todos los errores del backend (GlobalExceptionHandler y los 401/403 de SecurityConfig)
    // vienen como ErrorResponse: { status, error, mensaje, timestamp }
    const text = await response.text();
    let message = text;
    try {
      message = JSON.parse(text).mensaje ?? text;
    } catch {
      // no era JSON: usamos el texto tal cual
    }
    throw new Error(message || `Error ${response.status}`);
  }

  if (response.status === 204) return null;
  // El backend responde JSON, pero si algún endpoint devolviera texto plano no rompemos la app
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const getJson = (endpoint) => requestJson(endpoint);
export const postJson = (endpoint, body) => requestJson(endpoint, { method: 'POST', body });
export const putJson = (endpoint, body) => requestJson(endpoint, { method: 'PUT', body });
export const patchJson = (endpoint, body) => requestJson(endpoint, { method: 'PATCH', body });
export const deleteJson = (endpoint) => requestJson(endpoint, { method: 'DELETE' });
