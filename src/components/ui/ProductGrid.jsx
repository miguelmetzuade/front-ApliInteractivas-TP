import ProductCard from '../ProductCard';
import '../../styles/ui/ProductGrid.css';

// Grilla de tarjetas de producto (4 columnas en desktop, como en el Figma)
const ProductGrid = ({ products }) => (
  <div className="product-grid">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);

export default ProductGrid;
