import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import Home from './components/Home'
import Footer from './components/Footer'
import Favorites from './components/Favorites'
import SellerProducts from './components/SellerProducts'
import SellerProductDetail from './components/SellerProductDetail'
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
  const email = useSelector((state) => state.auth.user?.email)

  // Al cargar la app le preguntamos al back si hay sesión: la cookie HttpOnly viaja sola
  // y el front no la puede leer, así que no hay otra forma de saberlo (sobrevive al F5)
  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  // Cada vez que cambia el usuario (login, registro o sesión recuperada al recargar)
  // traemos sus favoritos y su carrito desde la base
  useEffect(() => {
    if (email) {
      dispatch(fetchFavorites())
      dispatch(fetchCart())
    }
  }, [dispatch, email])

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
          <Route path="/seller/products/:id" element={<SellerProductDetail />} />
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
