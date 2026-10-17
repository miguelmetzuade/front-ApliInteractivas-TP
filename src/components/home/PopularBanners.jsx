import PromoBanner from './PromoBanner';
import popular1 from '../../assets/home/popular-1.png';
import popular2 from '../../assets/home/popular-2.png';
import ipadPro from '../../assets/home/ipad-pro.png';
import macbookPro from '../../assets/home/macbook-pro.png';
import '../../styles/home/PopularBanners.css';

const TEXTO = 'El iPad combina una magnífica pantalla Retina de 10,2 pulgadas, un rendimiento increíble, multitarea y facilidad de uso.';

// Fila de banners promocionales
const PopularBanners = () => (
  <section className="popular-banners">
    <PromoBanner title="Productos populares" text={TEXTO} theme="white" ctaTo="/products">
      <div className="popular-combo" aria-hidden="true">
        <div className="popular-combo-a"><img src={popular1} alt="" /></div>
        <div className="popular-combo-b"><img src={popular2} alt="" /></div>
      </div>
    </PromoBanner>
    <PromoBanner title="Ipad Pro" text={TEXTO} theme="light" ctaTo="/products">
      <div className="popular-image popular-ipad"><img src={ipadPro} alt="iPad Pro" /></div>
    </PromoBanner>
    <PromoBanner title="Macbook Pro" text={TEXTO} theme="dark" ctaTo="/products">
      <div className="popular-image popular-macbook"><img src={macbookPro} alt="Macbook Pro" /></div>
    </PromoBanner>
  </section>
);

export default PopularBanners;
