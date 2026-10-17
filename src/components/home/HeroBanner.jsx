import OutlineButton from '../ui/OutlineButton';
import '../../styles/home/HeroBanner.css';

// Banner principal oscuro con texto a la izquierda e imagen a la derecha.
// title puede ser JSX para combinar pesos de fuente (ej: IPhone 14 <strong>Pro</strong>)
const HeroBanner = ({ eyebrow, title, text, image, imageAlt = '', ctaLabel = 'Comprar ahora', ctaTo }) => (
  <section className="hero-banner">
    <div className="hero-banner-content">
      {eyebrow && <p className="hero-banner-eyebrow">{eyebrow}</p>}
      <h1 className="hero-banner-title">{title}</h1>
      {text && <p className="hero-banner-text">{text}</p>}
      {ctaTo && <OutlineButton to={ctaTo} variant="light">{ctaLabel}</OutlineButton>}
    </div>
    <div className="hero-banner-image">
      <img src={image} alt={imageAlt} />
    </div>
  </section>
);

export default HeroBanner;
