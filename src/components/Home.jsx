import { useState, useEffect } from 'react';
import { getJson } from '../services/api';
import HeroBanner from './home/HeroBanner';
import FeaturedBanners from './home/FeaturedBanners';
import CategoryCarousel from './home/CategoryCarousel';
import PopularBanners from './home/PopularBanners';
import Section from './ui/Section';
import Tabs from './ui/Tabs';
import ProductGrid from './ui/ProductGrid';
import StatusMessage from './ui/StatusMessage';
import PlayStation from '../assets/home/playstation.png';
import '../styles/pages/Home.css';

// Pestañas de la sección de productos: cada una ordena la lista de otra forma
const TABS = [
  { id: 'nuevos', label: 'Novedades', ordenar: (a, b) => b.id - a.id },
  { id: 'destacados', label: 'Destacados', ordenar: (a, b) => b.precio - a.precio },
];

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(TABS[0].id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pedimos productos y categorías en paralelo
        const [prods, cats] = await Promise.all([getJson('/productos'), getJson('/categorias')]);
        setProductos(prods);
        setCategorias(cats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabActual = TABS.find((t) => t.id === tab);
  const productosTab = [...productos].sort(tabActual.ordenar).slice(0, 8);

  // Mensaje a mostrar en lugar de los datos mientras carga o si falló la API
  const estado = loading
    ? <StatusMessage>Cargando...</StatusMessage>
    : error && <StatusMessage error>Error: {error}</StatusMessage>;

  return (
    <main className="home">
      <HeroBanner
        eyebrow="PS5"
        title={<>PlayStation <strong>5</strong></>}
        text="Creado para cambiarlo todo para mejor. Para todos."
        image={PlayStation}
        imageAlt="Play Station 5 Pro"
        ctaTo="/products"
      />

      <FeaturedBanners />

      <CategoryCarousel categorias={categorias}>{estado || undefined}</CategoryCarousel>

      <Section className="home-products">
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        {estado || (productosTab.length === 0
          ? <StatusMessage>No hay productos disponibles</StatusMessage>
          : <ProductGrid products={productosTab} />)}
      </Section>

      <PopularBanners />
    </main>
  );
};

export default Home;
