import macbookBody from '../../assets/home/macbook-body.svg';
import macbookScreenBody from '../../assets/home/macbook-screen-body.svg';
import macbookDisplay from '../../assets/home/macbook-display.png';
import macbookNotch from '../../assets/home/macbook-notch.svg';
import macbookCamera from '../../assets/home/macbook-camera.svg';
import '../../styles/home/MacbookIllustration.css';

// MacBook armada con las piezas del Figma (posiciones relativas a un contenedor de 292x502).
// className: para ubicarla dentro del banner que la usa
const MacbookIllustration = ({ className = '' }) => (
  <div className={`macbook ${className}`} aria-hidden="true">
    <div className="macbook-body"><img src={macbookBody} alt="" /></div>
    <div className="macbook-screen-body"><img src={macbookScreenBody} alt="" /></div>
    <div className="macbook-display"><img src={macbookDisplay} alt="" /></div>
    <div className="macbook-notch"><img src={macbookNotch} alt="" /></div>
    <div className="macbook-camera"><img src={macbookCamera} alt="" /></div>
  </div>
);

export default MacbookIllustration;
