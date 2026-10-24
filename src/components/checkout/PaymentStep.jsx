import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  placeOrder,
  selectSelectedAddress,
  selectShippingMethod,
  setPaymentMethod,
  setStep,
} from '../../store/slices/checkoutSlice';
import { formatPrice } from '../../utils/formatPrice';
import StatusMessage from '../ui/StatusMessage';
import creditCard from '../../assets/checkout/credit-card.png';
import checkboxChecked from '../../assets/checkout/checkbox-checked.svg';

const PAYMENT_TABS = [
  { id: 'card', label: 'Tarjeta de crédito' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'paypal-credit', label: 'PayPal Credit' },
];

const EMPTY_CARD = { titular: '', numero: '', vencimiento: '', cvv: '' };

// Vencido si el último día del mes de vencimiento ya pasó
const isExpired = (vencimiento) => {
  const [mes, anio] = vencimiento.split('/').map(Number);
  return new Date(2000 + anio, mes, 1) <= new Date();
};

// Devuelve un mensaje por cada campo inválido (objeto vacío = tarjeta válida)
const validateCard = (card) => {
  const errors = {};
  const digitos = card.numero.replace(/\s/g, '');
  if (card.titular.trim() === '') errors.titular = 'Ingresá el nombre del titular';
  if (!/^\d{13,19}$/.test(digitos)) errors.numero = 'El número debe tener entre 13 y 19 dígitos';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.vencimiento)) errors.vencimiento = 'Usá el formato MM/AA';
  else if (isExpired(card.vencimiento)) errors.vencimiento = 'La tarjeta está vencida';
  if (!/^\d{3,4}$/.test(card.cvv)) errors.cvv = 'El CVV tiene 3 o 4 dígitos';
  return errors;
};

// Deja solo números y los agrupa de a 4: "4242424242424242" -> "4242 4242 4242 4242"
const formatCardNumber = (value) =>
  value.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');

// Agrega la barra sola: "1230" -> "12/30"
const formatExpiry = (value) => {
  const digitos = value.replace(/\D/g, '').slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
};

const FORMATTERS = {
  numero: formatCardNumber,
  vencimiento: formatExpiry,
  cvv: (value) => value.replace(/\D/g, '').slice(0, 4),
};

// Paso 3 (frame "Step 3" del Figma): resumen a la izquierda y pago a la derecha
const PaymentStep = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { paymentMethod, scheduledDate, status, error } = useSelector((state) => state.checkout);
  const address = useSelector(selectSelectedAddress);
  const shipping = useSelector(selectShippingMethod);
  // Los datos de la tarjeta quedan solo en el estado local: no se guardan en Redux ni se mandan al backend
  const [card, setCard] = useState(EMPTY_CARD);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  // Los errores se muestran recién después de intentar pagar, para no marcar campos que todavía no se completaron
  const [submitted, setSubmitted] = useState(false);
  const paying = status === 'loading';
  const errors = submitted ? validateCard(card) : {};

  const handleCardChange = (event) => {
    const { name, value } = event.target;
    const format = FORMATTERS[name];
    setCard({ ...card, [name]: format ? format(value) : value });
  };

  const handlePay = () => {
    setSubmitted(true);
    if (Object.keys(validateCard(card)).length > 0) return;
    dispatch(placeOrder());
  };

  // Input de la tarjeta con su mensaje de error abajo
  const cardField = (name, props) => (
    <div className="payment-field">
      <input
        className={errors[name] ? 'checkout-input invalid' : 'checkout-input'}
        name={name}
        value={card[name]}
        onChange={handleCardChange}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `error-${name}` : undefined}
        {...props}
      />
      {errors[name] && <span id={`error-${name}`} className="payment-field-error">{errors[name]}</span>}
    </div>
  );

  const shippingText = shipping.id === 'schedule'
    ? `Programado para el ${new Date(`${scheduledDate}T00:00`).toLocaleDateString('es-AR')}`
    : `${shipping.label} - ${shipping.description}`;

  return (
    <div className="payment-step">
      <section className="payment-summary">
        <h2 className="payment-summary-title">Resumen</h2>

        <ul className="payment-products">
          {items.map((item) => {
            const imagen = item.image_url || item.imagenUrl || item.imagen;
            return (
              <li key={item.productoId} className="payment-product">
                {imagen
                  ? <img src={imagen} alt="" className="payment-product-image" />
                  : <span className="payment-product-image payment-product-placeholder">{item.nombre.charAt(0)}</span>}
                <span className="payment-product-text">
                  <span>{item.nombre}{item.cantidad > 1 && ` x${item.cantidad}`}</span>
                  <strong>{formatPrice(item.subtotal)}</strong>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="payment-details">
          <div className="payment-detail">
            <span className="payment-detail-label">Dirección</span>
            <span className="payment-detail-value">{address?.direccion}</span>
          </div>
          <div className="payment-detail">
            <span className="payment-detail-label">Método de envío</span>
            <span className="payment-detail-value">{shippingText}</span>
          </div>

          <div className="summary-prices">
            <div className="summary-row summary-row-strong">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>{shipping.price === 0 ? 'Gratis' : formatPrice(shipping.price)}</span>
            </div>
            <div className="summary-row summary-row-strong">
              <span>Total</span>
              <strong>{formatPrice(total + shipping.price)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="payment-right">
        <div className="payment-details-block">
          <div className="payment-top">
            <h2 className="payment-title">Pago</h2>
            <div className="payment-tabs" role="tablist">
              {PAYMENT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={paymentMethod === tab.id}
                  className={paymentMethod === tab.id ? 'payment-tab active' : 'payment-tab'}
                  onClick={() => dispatch(setPaymentMethod(tab.id))}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === 'card' ? (
            <div className="payment-card">
              <img src={creditCard} alt="" className="payment-card-image" />
              <div className="payment-fields">
                {cardField('titular', { placeholder: 'Nombre del titular', autoComplete: 'cc-name' })}
                {cardField('numero', { placeholder: 'Número de tarjeta', inputMode: 'numeric', autoComplete: 'cc-number' })}
                <div className="checkout-fields-row">
                  {cardField('vencimiento', { placeholder: 'Vencimiento (MM/AA)', inputMode: 'numeric', autoComplete: 'cc-exp' })}
                  {cardField('cvv', { placeholder: 'CVV', inputMode: 'numeric', autoComplete: 'cc-csc' })}
                </div>
              </div>
            </div>
          ) : (
            <StatusMessage>Este medio de pago todavía no está disponible. Elegí tarjeta de crédito.</StatusMessage>
          )}
        </div>

        <label className="checkbox-field">
          <input
            type="checkbox"
            className="visually-hidden"
            checked={sameAsBilling}
            onChange={(event) => setSameAsBilling(event.target.checked)}
          />
          {sameAsBilling
            ? <img src={checkboxChecked} alt="" className="checkbox-icon" />
            : <span className="checkbox-icon checkbox-empty" />}
          Usar la misma dirección para la facturación
        </label>

        {error && <StatusMessage error>No se pudo completar la compra: {error}</StatusMessage>}

        <div className="checkout-buttons payment-buttons">
          <button
            type="button"
            className="btn-secondary btn-large"
            onClick={() => dispatch(setStep(2))}
            disabled={paying}
          >
            Volver
          </button>
          <button
            type="button"
            className="btn-primary btn-large"
            onClick={handlePay}
            disabled={paying || paymentMethod !== 'card'}
          >
            {paying ? 'Pagando...' : 'Pagar'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default PaymentStep;
