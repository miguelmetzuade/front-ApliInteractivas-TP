import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getJson, postJson } from '../services/api';
import '../styles/pages/CrudProduct.css';

const INITIAL_PRODUCT = {
  nombre: 'Teclado mecánico',
  descripcion: 'Teclado mecánico retroiluminado',
  precio: '45000',
  stock: '10',
  categoriaId: '1',
  image_url: '',
};

const CrudProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(INITIAL_PRODUCT);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getJson('/categorias');
        setCategories(data);
      } catch (requestError) {
        setError(`No se pudieron cargar las categorías: ${requestError.message}`);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await postJson('/productos', {
        nombre: product.nombre.trim(),
        descripcion: product.descripcion.trim(),
        precio: Number(product.precio),
        stock: Number(product.stock),
        categoriaId: Number(product.categoriaId),
        image_url: product.image_url.trim(),
      });
      navigate('/seller');
    } catch (requestError) {
      setError(requestError.message || 'No se pudo crear el producto.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="crud-product-page">
      <section className="crud-product-card">
        <div className="crud-product-heading">
          <span className="crud-product-eyebrow">Catálogo</span>
          <h1>Agregar producto</h1>
          <p>Completa los datos para publicar un nuevo producto.</p>
        </div>

        <form className="crud-product-form" onSubmit={handleSubmit}>
          <label className="crud-product-field">
            <span>Nombre</span>
            <input
              name="nombre"
              value={product.nombre}
              onChange={handleChange}
              placeholder="Ej. Teclado mecánico"
              required
              maxLength={120}
            />
          </label>

          <label className="crud-product-field">
            <span>Descripción</span>
            <textarea
              name="descripcion"
              value={product.descripcion}
              onChange={handleChange}
              placeholder="Describe las características del producto"
              rows={4}
              required
              maxLength={1000}
            />
          </label>

          <label className="crud-product-field">
            <span>URL de la imagen</span>
            <input
              name="image_url"
              type="url"
              value={product.image_url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </label>

          <div className="crud-product-fields-row">
            <label className="crud-product-field">
              <span>Precio</span>
              <input
                name="precio"
                type="number"
                value={product.precio}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
              />
            </label>

            <label className="crud-product-field">
              <span>Stock</span>
              <input
                name="stock"
                type="number"
                value={product.stock}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
            </label>
          </div>

          <label className="crud-product-field">
            <span>Categoría</span>
            <select
              name="categoriaId"
              value={product.categoriaId}
              onChange={handleChange}
              required
              disabled={loadingCategories || categories.length === 0}
            >
              {categories.length === 0 && <option value="1">Categoría 1</option>}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="crud-product-error" role="alert">{error}</p>}

          <div className="crud-product-actions">
            <Link className="crud-product-cancel" to="/products">Cancelar</Link>
            <button className="crud-product-submit" type="submit" disabled={submitting || loadingCategories || categories.length === 0}>
              {submitting ? 'Guardando…' : 'Aceptar'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CrudProduct;
