import '../../styles/ui/Section.css';

// Contenedor de sección con el ancho de contenido del Figma (1120px) y título opcional.
// actions: elementos que van a la derecha del título (ej: flechas del carrusel)
const Section = ({ title, actions, className = '', children }) => (
  <section className={`section ${className}`}>
    {(title || actions) && (
      <div className="section-top">
        {title && <h2 className="section-title">{title}</h2>}
        {actions}
      </div>
    )}
    {children}
  </section>
);

export default Section;
