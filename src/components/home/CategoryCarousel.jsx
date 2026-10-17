import { useRef } from 'react';
import Section from '../ui/Section';
import CategoryCard from './CategoryCard';
import arrowLeft from '../../assets/home/arrow-left.svg';
import arrowRight from '../../assets/home/arrow-right.svg';
import '../../styles/home/CategoryCarousel.css';

// Sección "Explorá por categoría": fila de tarjetas con scroll horizontal y flechas.
// children: se muestra en lugar de las tarjetas (ej: mensaje de carga o error)
const CategoryCarousel = ({ title = 'Explorá por categoría', categorias = [], children }) => {
  const listaRef = useRef(null);

  // Cada click mueve una tarjeta (160px de ancho + 32px de separación)
  const scroll = (direccion) => {
    listaRef.current?.scrollBy({ left: direccion * 192, behavior: 'smooth' });
  };

  const flechas = (
    <div className="carousel-arrows">
      <button type="button" onClick={() => scroll(-1)} aria-label="Anterior">
        <img src={arrowLeft} alt="" />
      </button>
      <button type="button" onClick={() => scroll(1)} aria-label="Siguiente">
        <img src={arrowRight} alt="" className="arrow-flipped" />
      </button>
    </div>
  );

  return (
    <Section title={title} actions={flechas} className="category-carousel">
      {children ?? (
        <div className="carousel-track" ref={listaRef}>
          {categorias.map((categoria, index) => (
            <CategoryCard key={categoria.id} categoria={categoria} index={index} />
          ))}
        </div>
      )}
    </Section>
  );
};

export default CategoryCarousel;
