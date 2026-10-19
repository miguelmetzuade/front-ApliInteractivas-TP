import iconLocation from '../../assets/checkout/step-location.svg';
import iconLocationActive from '../../assets/checkout/step-location-active.svg';
import iconShipping from '../../assets/checkout/step-shipping.svg';
import iconShippingActive from '../../assets/checkout/step-shipping-active.svg';
import iconPayment from '../../assets/checkout/step-payment.svg';
import '../../styles/checkout/CheckoutSteps.css';

const STEPS = [
  { number: 1, label: 'Dirección' },
  { number: 2, label: 'Envío' },
  { number: 3, label: 'Pago' },
];

// El ícono de pago del Figma es un círculo de color con el dibujo encima, por eso se arma con CSS
const StepIcon = ({ number, active }) => {
  if (number === 1) return <img src={active ? iconLocationActive : iconLocation} alt="" className="step-icon" />;
  if (number === 2) return <img src={active ? iconShippingActive : iconShipping} alt="" className="step-icon" />;
  return (
    <span className={active ? 'step-icon step-icon-payment active' : 'step-icon step-icon-payment'}>
      <img src={iconPayment} alt="" />
    </span>
  );
};

// Indicador de pasos ("Steps" del Figma): el paso actual en negro, el resto en gris
const CheckoutSteps = ({ current }) => (
  <ol className="checkout-steps">
    {STEPS.map(({ number, label }) => (
      <li
        key={number}
        className={number === current ? 'checkout-step active' : 'checkout-step'}
        aria-current={number === current ? 'step' : undefined}
      >
        <StepIcon number={number} active={number === current} />
        <span className="step-text">
          <span className="step-number">Paso {number}</span>
          <span className="step-label">{label}</span>
        </span>
      </li>
    ))}
  </ol>
);

export default CheckoutSteps;
