import tabLine from '../../assets/home/tab-line.svg';
import '../../styles/ui/Tabs.css';

// Pestañas controladas: el padre guarda la pestaña activa (value) y la cambia con onChange
const Tabs = ({ tabs, value, onChange }) => (
  <div className="tabs" role="tablist">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={value === tab.id}
        className={value === tab.id ? 'tab active' : 'tab'}
        onClick={() => onChange(tab.id)}
      >
        {tab.label}
        {value === tab.id && <img src={tabLine} alt="" className="tab-line" />}
      </button>
    ))}
  </div>
);

export default Tabs;
