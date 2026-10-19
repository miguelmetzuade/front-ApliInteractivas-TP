import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { startCheckout } from '../../store/slices/checkoutSlice';
import { formatPrice } from '../../utils/formatPrice';
import '../../styles/ui/Button.css';
import '../../styles/cart/OrderSummary.css';

// "Order Summary" del Figma. Los códigos de descuento y la tarjeta de beneficios
// todavía no tienen endpoint en el backend, así que los campos quedan deshabilitados.
const OrderSummary = ({ total, disabled }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goToCheckout = () => {
    dispatch(startCheckout());
    navigate('/checkout');
  };

  return (
    <aside className="order-summary">
      <h2 className="order-summary-title">Resumen del pedido</h2>

      <div className="order-summary-content">
        <div className="order-summary-block">
          <label className="summary-field">
            <span className="summary-field-label">Código de descuento / promoción</span>
            <input className="summary-input" type="text" placeholder="Código" disabled />
          </label>

          <label className="summary-field">
            <span className="summary-field-label">Número de tarjeta de beneficios</span>
            <span className="summary-input summary-input-with-button">
              <input type="text" placeholder="Ingresá el número de tarjeta" disabled />
              <button type="button" className="summary-apply" disabled>Aplicar</button>
            </span>
          </label>

          <div className="summary-prices">
            <div className="summary-row summary-row-strong">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>Se calcula en el checkout</span>
            </div>
            <div className="summary-row summary-row-strong">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <button type="button" className="btn-primary" onClick={goToCheckout} disabled={disabled}>
          Finalizar compra
        </button>
      </div>
    </aside>
  );
};

export default OrderSummary;
