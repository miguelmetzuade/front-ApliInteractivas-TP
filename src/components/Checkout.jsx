import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../store/slices/cartSlice';
import { selectShippingMethod } from '../store/slices/checkoutSlice';
import CheckoutSteps from './checkout/CheckoutSteps';
import AddressStep from './checkout/AddressStep';
import ShippingStep from './checkout/ShippingStep';
import PaymentStep from './checkout/PaymentStep';
import OrderConfirmation from './checkout/OrderConfirmation';
import StatusMessage from './ui/StatusMessage';
import '../styles/ui/Button.css';
import '../styles/cart/OrderSummary.css';
import '../styles/pages/Checkout.css';

// Checkout en 3 pasos: basado en los frames "Step 1", "Step 2" y "Step 3" del Figma
const Checkout = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.cart);
  const { step, order } = useSelector((state) => state.checkout);
  const shipping = useSelector(selectShippingMethod);

  // Si se entra directo a /checkout (por ejemplo recargando la página) el carrito todavía no está cargado
  useEffect(() => {
    if (status === 'idle') dispatch(fetchCart());
  }, [dispatch, status]);

  if (order) {
    return (
      <main className="checkout-page">
        <OrderConfirmation order={order} shippingPrice={shipping.price} />
      </main>
    );
  }

  if (status === 'idle' || status === 'loading') {
    return <main className="checkout-page checkout-message"><StatusMessage>Cargando carrito...</StatusMessage></main>;
  }

  if (status === 'failed') {
    return <main className="checkout-page checkout-message"><StatusMessage error>Error al cargar el carrito: {error}</StatusMessage></main>;
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page checkout-message">
        <StatusMessage>Tu carrito está vacío.</StatusMessage>
        <Link to="/products" className="cart-empty-link">Ver productos</Link>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <CheckoutSteps current={step} />
      {step === 1 && <AddressStep />}
      {step === 2 && <ShippingStep />}
      {step === 3 && <PaymentStep />}
    </main>
  );
};

export default Checkout;
