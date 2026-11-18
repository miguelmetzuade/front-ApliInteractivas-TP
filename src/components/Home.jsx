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

// Pestañas de la sección de productos: cada una le pide al backend un orden distinto.
// La primera es la alfabética, que es la que pide la consigna para la home.
const TABS = [
  { id: 'az', label: 'A-Z', orden: 'nombre_asc' },
  { id: 'menor-precio', label: 'Menor precio', orden: 'precio_asc' },
  { id: 'mayor-precio', label: 'Mayor precio', orden: 'precio_desc' },
];

// Cantidad de productos que se muestran en la home
const CANTIDAD_HOME = 8;

const Home = () => {
  const [tab, setTab] = useState(TABS[0].id);
  // Cada resultado guarda de qué pestaña es: si no coincide con la activa, todavía está cargando
  const [resultadoProductos, setResultadoProductos] = useState({ tab: null, productos: [], error: null });
  const [resultadoCategorias, setResultadoCategorias] = useState({ cargado: false, categorias: [], error: null });

  // Categorías: se piden una sola vez al montar la home
  useEffect(() => {
    getJson('/categorias')
      .then((categorias) => setResultadoCategorias({ cargado: true, categorias, error: null }))
      .catch((err) => setResultadoCategorias({ cargado: true, categorias: [], error: err.message }));
  }, []);

  // Productos: se vuelven a pedir cada vez que cambia la pestaña (tab es dependencia del efecto).
  // El orden y la cantidad los resuelve el backend: GET /productos?orden=nombre_asc&tamanio=8
  useEffect(() => {
    // Si el usuario cambia de pestaña antes de que llegue la respuesta, se ignora la respuesta vieja
    let ignorar = false;
    const { orden } = TABS.find((t) => t.id === tab);

    getJson(`/productos?orden=${orden}&tamanio=${CANTIDAD_HOME}`)
      .then((data) => {
        if (!ignorar) setResultadoProductos({ tab, productos: data.productos, error: null });
      })
      .catch((err) => {
        if (!ignorar) setResultadoProductos({ tab, productos: [], error: err.message });
      });

    // Cleanup: se ejecuta antes del próximo efecto (cambio de pestaña) o al desmontar
    return () => {
      ignorar = true;
    };
  }, [tab]);

  const { categorias } = resultadoCategorias;
  const { productos } = resultadoProductos;
  const cargandoProductos = resultadoProductos.tab !== tab;

  // Mensaje a mostrar en lugar de los datos mientras carga o si falló la API
  const estadoCategorias = !resultadoCategorias.cargado
    ? <StatusMessage>Cargando...</StatusMessage>
    : resultadoCategorias.error && <StatusMessage error>Error: {resultadoCategorias.error}</StatusMessage>;
  const estadoProductos = cargandoProductos
    ? <StatusMessage>Cargando...</StatusMessage>
    : resultadoProductos.error && <StatusMessage error>Error: {resultadoProductos.error}</StatusMessage>;

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

      <CategoryCarousel categorias={categorias}>{estadoCategorias || undefined}</CategoryCarousel>

      <Section className="home-products">
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        {estadoProductos || (productos.length === 0
          ? <StatusMessage>No hay productos disponibles</StatusMessage>
          : <ProductGrid products={productos} />)}
      </Section>

      <PopularBanners />
    </main>
  );
};

export default Home;
