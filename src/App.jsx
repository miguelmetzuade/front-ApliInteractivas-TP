import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import ProductList from './components/ProductList'
import './App.css'
import {Route , Routes} from "react-router-dom"
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'



function App() {
  return (

    <>
      <Navbar/>
      <Routes>
        <Route path="/products" element={<ProductList/>}></Route>
         <Route element={<ProtectedRoute />}>
          {/* <Route path="/cart" element={<Cart />} /> */}
          {/* <Route path="/checkout" element={<Checkout   />} /> */}
        </Route>
      </Routes>

    </>
  )
}

export default App
