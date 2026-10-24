import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSellerProduct, fetchSellerProducts, updateProductStock } from '../store/slices/sellerSlice';
import '../styles/pages/SellerProducts.css';

const SellerProducts = () => {
  const dispatch = useDispatch();
  const { products, status, error, pendingIds, updateErrors } = useSelector((state) => state.seller);
  const [stockValues, setStockValues] = useState({});

  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  const updateStock = (productId, value) => {
    setStockValues((values) => ({ ...values, [productId]: value }));
  };

  const saveStock = (productId, currentStock) => {
    const stock = Number(stockValues[productId] ?? currentStock ?? 0);
    dispatch(updateProductStock({ id: productId, stock }));
  };

  const deactivateProduct = (product) => {
    const confirmed = window.confirm(`¿Quieres dar de baja "${product.nombre}"?`);
    if (confirmed) dispatch(deleteSellerProduct(product.id));
  };

  if (status === 'loading' || status === 'idle') {
    return <p className="seller-status">Cargando tus productos...</p>;
  }

  if (status === 'failed') {
    return <p className="seller-status error">Error al cargar tus productos: {error}</p>;
  }

  return (
    <main className="seller-page">
      <h1 className="seller-title">Mis productos</h1>
      {products.length === 0 ? (
        <p className="seller-status">Todavía no publicaste productos.</p>
      ) : (
        <div className="seller-product-list">
          {products.map((product) => {
            const value = stockValues[product.id] ?? String(product.stock ?? 0);
            const parsedStock = Number(value);
            const isValid = value !== '' && Number.isInteger(parsedStock) && parsedStock >= 0;
            const isPending = pendingIds.includes(product.id);

            return (
              <article className="seller-product" key={product.id}>
                <div className="seller-product-info">
                  <Link to={`/products/${product.id}`} className="seller-product-name">
                    {product.nombre}
                  </Link>
                  <span>{product.categoriaNombre || 'Sin categoría'}</span>
                  <strong>${product.precio.toLocaleString('es-AR')}</strong>
                </div>
                <div className="seller-stock">
                  <label htmlFor={`stock-${product.id}`}>Stock</label>
                  <input
                    id={`stock-${product.id}`}
                    type="number"
                    min="0"
                    step="1"
                    value={value}
                    onChange={(event) => updateStock(product.id, event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => saveStock(product.id, product.stock)}
                    disabled={!isValid || isPending || parsedStock === product.stock}
                  >
                    {isPending ? 'Guardando...' : 'Guardar stock'}
                  </button>
                  <button
                    type="button"
                    className="seller-product-deactivate"
                    onClick={() => deactivateProduct(product)}
                    disabled={isPending}
                  >
                    {isPending ? 'Procesando...' : 'Dar de baja'}
                  </button>
                  {updateErrors[product.id] && (
                    <span className="seller-product-error" role="alert">
                      {updateErrors[product.id]}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default SellerProducts;
