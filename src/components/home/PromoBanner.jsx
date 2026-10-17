import OutlineButton from '../ui/OutlineButton';
import '../../styles/home/PromoBanner.css';

// Banner vertical con imagen arriba y texto + botón abajo.
// theme: 'white' | 'light' | 'gray' | 'dark'. children: la imagen (cada banner la posiciona a su manera)
const PromoBanner = ({ title, text, theme = 'white', ctaLabel = 'Comprar ahora', ctaTo, children }) => (
  <div className={`promo-banner promo-banner-${theme}`}>
    {children}
    <div className="promo-banner-text">
      <h3>{title}</h3>
      <p>{text}</p>
      {ctaTo && (
        <OutlineButton to={ctaTo} variant={theme === 'dark' ? 'light' : 'dark'}>{ctaLabel}</OutlineButton>
      )}
    </div>
  </div>
);

export default PromoBanner;
