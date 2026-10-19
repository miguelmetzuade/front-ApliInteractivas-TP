import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';

// Pantalla final con la orden que devolvió POST /api/carrito/checkout
const OrderConfirmation = ({ order, shippingPrice }) => (
  <section className="order-confirmation">
    <h1 className="checkout-heading">¡Gracias por tu compra!</h1>
    <p className="order-confirmation-text">
      Tu orden <strong>#{order.id}</strong> se registró el {new Date(order.fecha).toLocaleString('es-AR')}.
    </p>

    <ul className="payment-products">
      {order.items.map((item) => (
        <li key={item.productoId} className="payment-product">
          <span className="payment-product-text">
            <span>{item.nombre} x{item.cantidad}</span>
            <strong>{formatPrice(item.subtotal)}</strong>
          </span>
        </li>
      ))}
    </ul>

    <div className="summary-prices">
      <div className="summary-row">
        <span>Envío</span>
        <span>{shippingPrice === 0 ? 'Gratis' : formatPrice(shippingPrice)}</span>
      </div>
      <div className="summary-row summary-row-strong">
        <span>Total</span>
        <strong>{formatPrice(order.total + shippingPrice)}</strong>
      </div>
    </div>

    <Link to="/products" className="btn-primary">Seguir comprando</Link>
  </section>
);

export default OrderConfirmation;
