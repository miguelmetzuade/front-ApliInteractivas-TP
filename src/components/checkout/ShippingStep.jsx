import { useDispatch, useSelector } from 'react-redux';
import {
  SHIPPING_METHODS,
  setScheduledDate,
  setShippingMethod,
  setStep,
} from '../../store/slices/checkoutSlice';
import radio from '../../assets/checkout/radio.svg';
import radioChecked from '../../assets/checkout/radio-checked.svg';
import arrowDown from '../../assets/checkout/arrow-down.svg';

const formatDate = (date) =>
  date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });

const deliveryDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

// Mañana en formato yyyy-mm-dd, para que no se pueda programar un envío para hoy o antes
const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

// Paso 2 ("Shipment Method" del Figma)
const ShippingStep = () => {
  const dispatch = useDispatch();
  const { shippingMethod, scheduledDate } = useSelector((state) => state.checkout);
  const missingDate = shippingMethod === 'schedule' && !scheduledDate;

  return (
    <div className="checkout-step-content">
      <div className="checkout-block">
        <h2 className="checkout-heading">Método de envío</h2>

        <div className="shipping-methods" role="radiogroup" aria-label="Métodos de envío">
          {SHIPPING_METHODS.map((method) => {
            const selected = method.id === shippingMethod;
            return (
              <label key={method.id} className={selected ? 'shipping-method selected' : 'shipping-method'}>
                <span className="shipping-method-text">
                  <input
                    type="radio"
                    name="shipping"
                    className="visually-hidden"
                    checked={selected}
                    onChange={() => dispatch(setShippingMethod(method.id))}
                  />
                  <img src={selected ? radioChecked : radio} alt="" className="radio-icon" />
                  <span className="shipping-method-label">{method.label}</span>
                  <span className="shipping-method-description">{method.description}</span>
                </span>

                {method.id !== 'schedule' && (
                  <span className="shipping-method-date">{deliveryDate(method.days)}</span>
                )}
                {method.id === 'schedule' && (selected ? (
                  <input
                    type="date"
                    className="shipping-date-input"
                    aria-label="Fecha de entrega"
                    min={tomorrow()}
                    value={scheduledDate}
                    onChange={(event) => dispatch(setScheduledDate(event.target.value))}
                  />
                ) : (
                  <span className="shipping-method-date">
                    Elegir fecha <img src={arrowDown} alt="" />
                  </span>
                ))}
              </label>
            );
          })}
        </div>
      </div>

      <div className="checkout-buttons">
        <button type="button" className="btn-secondary btn-large" onClick={() => dispatch(setStep(1))}>
          Volver
        </button>
        <button
          type="button"
          className="btn-primary btn-large"
          onClick={() => dispatch(setStep(3))}
          disabled={missingDate}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ShippingStep;
