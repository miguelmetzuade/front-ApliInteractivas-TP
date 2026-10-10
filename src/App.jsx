import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import CategoryList from './components/CategoryList'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      {/* aquí se definen todas las rutas de la app */}
      <Routes>
        <Route path="/" element={<Navigate to="/productos" replace />} />
        <Route path="/productos" element={<ProductList />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/categorias" element={<CategoryList />} />
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
