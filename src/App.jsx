import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import CategoryList from './components/CategoryList'
import Home from './components/Home'
import Footer from './components/Footer'
import Favorites from './components/Favorites'
import SellerProducts from './components/SellerProducts'
import CrudProduct from './components/CrudProduct'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Login from './components/Login'
import Register from './components/Register'
import { fetchFavorites } from './store/slices/favoriteSlice'
import { fetchCart } from './store/slices/cartSlice'
import { fetchCurrentUser } from './store/slices/authSlice'

function App() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)

  // Cada vez que cambia el token (login, registro o al recargar con sesión abierta)
  // traemos los datos del usuario, sus favoritos y su carrito
  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser())
      dispatch(fetchFavorites())
      dispatch(fetchCart())
    }
  }, [dispatch, token])

  return (
    <>
      <Navbar />
      {/* aquí se definen todas las rutas de la app (el BrowserRouter está en main.jsx) */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        {/* <Route path="/categories" element={<CategoryList />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas que requieren login: el backend las protege con el JWT */}
        <Route element={<ProtectedRoute />}>
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/products/new" element={<CrudProduct />} />
          <Route path="/seller" element={<SellerProducts />} />
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
