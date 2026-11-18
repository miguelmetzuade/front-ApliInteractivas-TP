import { useState } from 'react';
import '../../styles/ui/ProductGallery.css';

// Galería de fotos de un producto: imagen grande con flechas para pasar a la anterior/siguiente
// y miniaturas abajo para elegir una. La usan el detalle del comprador y el del vendedor.
// - imagenes: lista de URLs (la primera es la principal)
// - alt: texto alternativo (el nombre del producto)
// - children: algo que se dibuja encima de la imagen (ej: el botón de favoritos)
const ProductGallery = ({ imagenes = [], alt, children }) => {
  // Posición de la imagen que se está mostrando
  const [actual, setActual] = useState(0);
  const cantidad = imagenes.length;

  // Las flechas son circulares: después de la última vuelve a la primera
  const anterior = () => setActual((i) => (i - 1 + cantidad) % cantidad);
  const siguiente = () => setActual((i) => (i + 1) % cantidad);

  return (
    <div className="gallery">
      <div className="gallery-main">
        {children}
        {cantidad === 0
          // Sin fotos: la inicial del producto como placeholder
          ? <span className="gallery-placeholder">{alt?.charAt(0)}</span>
          : <img src={imagenes[actual]} alt={`${alt} - foto ${actual + 1} de ${cantidad}`} />}

        {/* Con una sola foto no hacen falta flechas ni miniaturas */}
        {cantidad > 1 && (
          <>
            <button type="button" className="gallery-arrow prev" aria-label="Foto anterior" onClick={anterior}>
              ‹
            </button>
            <button type="button" className="gallery-arrow next" aria-label="Foto siguiente" onClick={siguiente}>
              ›
            </button>
            <span className="gallery-counter">{actual + 1} / {cantidad}</span>
          </>
        )}
      </div>

      {cantidad > 1 && (
        <div className="gallery-thumbs">
          {imagenes.map((url, index) => (
            <button
              // Las URLs se pueden repetir: el índice desambigua la key
              key={`${index}-${url}`}
              type="button"
              className={index === actual ? 'gallery-thumb active' : 'gallery-thumb'}
              aria-label={`Ver foto ${index + 1}`}
              aria-pressed={index === actual}
              onClick={() => setActual(index)}
            >
              <img src={url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
