import { Link } from 'react-router-dom';
import '../styles/layout/Footer.css';
import logoWhite from '../assets/home/logo-white.svg';
import twitter from '../assets/home/social-twitter.svg';
import facebook from '../assets/home/social-facebook.svg';
import tiktok from '../assets/home/social-tiktok.svg';
import instagram from '../assets/home/social-instagram.svg';

const SECCIONES = [
  {
    titulo: 'Servicios',
    links: ['Programa de beneficios', 'Gift cards', 'Crédito y pagos', 'Contratos de servicio', 'Cuenta sin efectivo', 'Pagos'],
  },
  {
    titulo: 'Ayuda al comprador',
    links: ['Buscar un pedido', 'Condiciones de envío', 'Cambios y devoluciones', 'Garantía', 'Preguntas frecuentes', 'Términos de uso del sitio'],
  },
];

const REDES = [
  { icono: twitter, nombre: 'Twitter' },
  { icono: facebook, nombre: 'Facebook' },
  { icono: tiktok, nombre: 'TikTok' },
  { icono: instagram, nombre: 'Instagram' },
];

const Footer = () => (
  <footer className="footer">
    <div className="footer-info">
      <div className="footer-brand">
        <Link to="/" aria-label="Inicio"><img src={logoWhite} alt="cyber" className="footer-logo" /></Link>
        <p>Somos un marketplace de tecnología: celulares, computadoras, audio, gaming y mucho más, al mejor precio.</p>
      </div>
      <div className="footer-nav">
        {SECCIONES.map((seccion) => (
          <div key={seccion.titulo} className="footer-section">
            <h4>{seccion.titulo}</h4>
            {seccion.links.map((link) => <span key={link}>{link}</span>)}
          </div>
        ))}
      </div>
    </div>
    <div className="footer-social">
      {REDES.map(({ icono, nombre }) => (
        <img key={nombre} src={icono} alt={nombre} />
      ))}
    </div>
  </footer>
);

export default Footer;
