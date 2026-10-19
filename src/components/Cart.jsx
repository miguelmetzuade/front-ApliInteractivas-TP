import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, fetchCart } from '../store/slices/cartSlice';
import CartItem from './cart/CartItem';
import OrderSummary from './cart/OrderSummary';
import StatusMessage from './ui/StatusMessage';
import '../styles/pages/Cart.css';

// Página del carrito: basada en el frame "Shopping Cart" del Figma
const Cart = () => {
  const dispatch = useDispatch();
  const { items, total, status, error, actionError, pendingIds } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (status === 'loading' && items.length === 0) {
    return <main className="cart-page"><StatusMessage>Cargando carrito...</StatusMessage></main>;
  }

  if (status === 'failed') {
    return <main className="cart-page"><StatusMessage error>Error al cargar el carrito: {error}</StatusMessage></main>;
  }

  return (
    <main className="cart-page">
      <div className="cart-content">
        <section className="cart-left">
          <div className="cart-header">
            <h1 className="cart-title">Carrito de compras</h1>
            {items.length > 0 && (
              <button type="button" className="cart-clear" onClick={() => dispatch(clearCart())}>
                Vaciar carrito
              </button>
            )}
          </div>

          {actionError && <StatusMessage error>{actionError}</StatusMessage>}

          {items.length === 0 ? (
            <div className="cart-empty">
              <StatusMessage>Tu carrito está vacío.</StatusMessage>
              <Link to="/products" className="cart-empty-link">Ver productos</Link>
            </div>
          ) : (
            <ul className="cart-items">
              {items.map((item) => <CartItem key={item.productoId} item={item} />)}
            </ul>
          )}
        </section>

        <OrderSummary total={total} disabled={items.length === 0 || pendingIds.length > 0} />
      </div>
    </main>
  );
};

export default Cart;
