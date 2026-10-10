import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="card-producto">

      <div className="producto-info">
        {/* Link de react-router: navega al detalle sin recargar la página */}
        <Link to={`/productos/${product.id}`} className="producto-link">
          <h3 className="producto-nombre">{product.nombre}</h3>
        </Link>
        <p className="producto-descripcion">{product.descripcion}</p>

        <div className="producto-stock">
          <span className={product.stock > 0 ? 'en-stock' : 'sin-stock'}>
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
          </span>
        </div>

        <div className="producto-footer">
          <span className="producto-precio">${product.precio.toLocaleString('es-AR')}</span>
          <Link to={`/productos/${product.id}`} className="btn-agregar">Ver detalle</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
