import React from 'react';
import './ProductCard.css';
import { useParams, Link } from 'react-router-dom'


const ProductCard = ({ product }) => {
  return (
    <div className="card-producto">
      
      <div className="producto-info">
        <h3 className="producto-nombre">{product.nombre}</h3>
        <p className="producto-descripcion">{product.descripcion}</p>
        
        <div className="producto-stock">
          <span className={product.stock > 0 ? 'en-stock' : 'sin-stock'}>
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
          </span>
        </div>
        
        <div className="producto-footer">
          <span className="producto-precio">${product.precio}</span>

          <Link to="/cart" >
          <button className="btn-agregar">Agregar</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
