import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global/index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/index.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Provider hace que el store de Redux esté disponible en todos los componentes */}
    <Provider store={store}>
      {/* useTransitions={false}: los cambios de ruta se renderizan junto con los cambios de Redux
          del mismo evento (ej: cerrar sesión y volver a la home en un solo render) */}
      <BrowserRouter useTransitions={false}>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
