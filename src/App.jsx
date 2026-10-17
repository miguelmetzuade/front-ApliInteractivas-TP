import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import CategoryList from './components/CategoryList'
import Home from './components/Home'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      {/* aquí se definen todas las rutas de la app (el BrowserRouter está en main.jsx) */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<CategoryList />} />

        <Route element={<ProtectedRoute />}>
          {/* <Route path="/cart" element={<Cart />} /> */}
          {/* <Route path="/checkout" element={<Checkout />} /> */}
        </Route>

        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
