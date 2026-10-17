import OutlineButton from '../ui/OutlineButton';
import MacbookIllustration from './MacbookIllustration';
import playstation from '../../assets/home/playstation.png';
import airpodsMax from '../../assets/home/airpods-max.png';
import visionPro from '../../assets/home/vision-pro.png';
import '../../styles/home/FeaturedBanners.css';

// Mosaico de banners debajo del hero: PS5 + AirPods + Vision Pro a la izquierda, MacBook Air a la derecha
const FeaturedBanners = () => (
  <section className="featured-banners">
    <div className="featured-left">
      <div className="banner-wide">
        <div className="banner-wide-image">
          <img src={playstation} alt="PlayStation 5" />
        </div>
        <div className="banner-wide-text">
          <h2>Playstation 5</h2>
          <p>CPU, GPU y un SSD increíblemente potentes con E/S integrada que redefinen tu experiencia PlayStation.</p>
        </div>
      </div>
      <div className="banner-squares">
        <div className="banner-square banner-square-light">
          <div className="banner-square-image banner-airpods">
            <img src={airpodsMax} alt="AirPods Max" />
          </div>
          <div className="banner-square-text">
            <h3>Apple AirPods <strong>Max</strong></h3>
            <p>Audio computacional. Escuchá, es potente.</p>
          </div>
        </div>
        <div className="banner-square banner-square-dark">
          <div className="banner-square-image banner-vision">
            <img src={visionPro} alt="Apple Vision Pro" />
          </div>
          <div className="banner-square-text">
            <h3>Apple Vision <strong>Pro</strong></h3>
            <p>Una forma inmersiva de disfrutar el entretenimiento.</p>
          </div>
        </div>
      </div>
    </div>
    <div className="banner-big">
      <div className="banner-big-content">
        <h2>Macbook <strong>Air</strong></h2>
        <p>La nueva MacBook Air de 15 pulgadas hace lugar para más de lo que te gusta con su amplia pantalla Liquid Retina.</p>
        <OutlineButton to="/products">Comprar ahora</OutlineButton>
      </div>
      <MacbookIllustration className="banner-big-macbook" />
    </div>
  </section>
);

export default FeaturedBanners;
