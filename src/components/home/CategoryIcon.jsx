import catPhones from '../../assets/home/cat-phones.svg';
import catWatches from '../../assets/home/cat-watches.svg';
import catWatchesV1 from '../../assets/home/cat-watches-v1.svg';
import catWatchesV2 from '../../assets/home/cat-watches-v2.svg';
import catWatchesV3 from '../../assets/home/cat-watches-v3.svg';
import catWatchesL11 from '../../assets/home/cat-watches-l11.svg';
import catWatchesL10 from '../../assets/home/cat-watches-l10.svg';
import catWatchesL9 from '../../assets/home/cat-watches-l9.svg';
import catCameras from '../../assets/home/cat-cameras.svg';
import catHeadphones from '../../assets/home/cat-headphones.svg';
import catComputers from '../../assets/home/cat-computers.svg';
import catGaming from '../../assets/home/cat-gaming.svg';
import catGpu from '../../assets/home/cat-gpu.svg';
import catCpu from '../../assets/home/cat-cpu.svg';
import catRam from '../../assets/home/cat-ram.svg';
import catStorage from '../../assets/home/cat-storage.svg';
import catPeripherals from '../../assets/home/cat-peripherals.svg';
import '../../styles/home/CategoryIcon.css';

// El ícono de smartwatch del diseño está armado con varias piezas superpuestas
const SmartWatchIcon = () => (
  <div className="cat-icon cat-icon-watch">
    <img src={catWatches} alt="" className="watch-base" />
    <span className="watch-part watch-body"><img src={catWatchesV1} alt="" /></span>
    <span className="watch-part watch-strap-bottom"><img src={catWatchesV2} alt="" /></span>
    <span className="watch-part watch-strap-top"><img src={catWatchesV3} alt="" /></span>
    <span className="watch-bars">
      <span className="watch-bar" style={{ height: 13 }}><img src={catWatchesL11} alt="" style={{ width: 13 }} /></span>
      <span className="watch-bar" style={{ height: 8 }}><img src={catWatchesL10} alt="" style={{ width: 8 }} /></span>
      <span className="watch-bar" style={{ height: 10 }}><img src={catWatchesL9} alt="" style={{ width: 10 }} /></span>
    </span>
  </div>
);

// Elegimos el ícono según palabras clave del nombre de la categoría que viene del backend.
// Las claves van sin tildes: el nombre se normaliza antes de comparar.
// Primero las categorías de hardware del catálogo; el orden importa (gana la primera que coincide).
const ICONOS_CATEGORIA = [
  { claves: ['placa', 'video', 'grafic', 'gpu'], icono: catGpu },
  { claves: ['procesador', 'cpu'], icono: catCpu },
  { claves: ['memoria', 'ram'], icono: catRam },
  { claves: ['almacen', 'disco', 'ssd', 'hdd'], icono: catStorage },
  { claves: ['perif', 'teclado', 'mouse'], icono: catPeripherals },
  { claves: ['monitor', 'pantalla'], icono: catComputers },
  { claves: ['celu', 'phone', 'telef', 'movil'], icono: catPhones },
  { claves: ['reloj', 'watch'], icono: 'watch' },
  { claves: ['camara', 'camera', 'foto'], icono: catCameras },
  { claves: ['auricular', 'headphone', 'audio', 'sonido'], icono: catHeadphones },
  { claves: ['compu', 'notebook', 'laptop', 'pc', 'computer'], icono: catComputers },
  { claves: ['juego', 'gaming', 'consola', 'game'], icono: catGaming },
];
const ICONOS_POR_DEFECTO = [catGpu, catCpu, catRam, catStorage, catPeripherals, catComputers];

// "Periféricos" -> "perifericos": minúsculas y sin tildes
const normalizar = (texto) => texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const iconoDeCategoria = (nombre, index) => {
  const n = normalizar(nombre);
  const match = ICONOS_CATEGORIA.find(({ claves }) => claves.some((c) => n.includes(c)));
  return match ? match.icono : ICONOS_POR_DEFECTO[index % ICONOS_POR_DEFECTO.length];
};

// index: posición de la categoría; se usa para repartir íconos cuando el nombre no coincide con ninguno
const CategoryIcon = ({ nombre, index = 0 }) => {
  const icono = iconoDeCategoria(nombre, index);
  return icono === 'watch' ? <SmartWatchIcon /> : <img src={icono} alt="" className="cat-icon" />;
};

export default CategoryIcon;
