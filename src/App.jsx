import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import CategoryList from './components/CategoryList'
import Home from './components/Home'
import Footer from './components/Footer'
import Favorites from './components/Favorites'
import SellerProducts from './components/SellerProducts'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import { fetchFavorites } from './store/slices/favoriteSlice'
import { fetchCart } from './store/slices/cartSlice'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(fetchFavorites())
      dispatch(fetchCart())
    }
  }, [dispatch])

  return (
    <>
      <Navbar />
      {/* aquí se definen todas las rutas de la app (el BrowserRouter está en main.jsx) */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/seller" element={<SellerProducts />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
