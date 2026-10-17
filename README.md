# E-Commerce UADE — Frontend

Frontend del trabajo práctico de **Aplicaciones Interactivas (UADE)**. Es una tienda online hecha con React que consume la API REST del backend en Spring Boot.

## Tecnologías

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/) (servidor de desarrollo y build)
- [React Router](https://reactrouter.com/) (navegación entre páginas)
- ESLint

## Requisitos

- Node.js y npm
- El backend corriendo en `http://localhost:8080` (la URL base se configura en `src/services/api.js`)

## Cómo correrlo

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Scripts

| Comando           | Descripción                                   |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Levanta el servidor de desarrollo con HMR     |
| `npm run build`   | Genera el build de producción en `dist/`      |
| `npm run preview` | Sirve localmente el build de producción       |
| `npm run lint`    | Corre ESLint sobre el proyecto                |

## Rutas

| Ruta             | Componente      | Endpoint del backend                    |
| ---------------- | --------------- | --------------------------------------- |
| `/`              | —               | Redirige a `/products`                  |
| `/products`      | `ProductList`   | `GET /api/productos` (`?categoriaId=`)  |
| `/products/:id`  | `ProductDetail` | `GET /api/productos/{id}`               |
| `/categories`    | `CategoryList`  | `GET /api/categorias`                   |

Las rutas que requieren login (carrito, checkout) van dentro de `ProtectedRoute` en `src/App.jsx`.

## Estructura

```
src/
├── components/      # Componentes de la app, cada uno con su .css
├── services/
│   └── api.js       # Llamadas al backend (fetch + token JWT)
├── styles/          # Estilos compartidos (Navbar)
├── App.jsx          # Definición de rutas
├── main.jsx         # Punto de entrada (BrowserRouter)
└── index.css        # Estilos base globales
```
