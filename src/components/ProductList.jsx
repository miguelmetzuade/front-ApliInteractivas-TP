import React from 'react';
import products from '../data/products.json';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Nuestros Productos</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;