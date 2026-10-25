import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getJson, postFormData, postJson } from '../services/api';
import '../styles/pages/CrudProduct.css';

// Mismos límites que valida el backend (POST /api/productos/imagen)
const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANIO_MAXIMO_IMAGEN = 5 * 1024 * 1024;

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
  // La imagen se puede subir como archivo o indicar con una URL externa
  const [imageMode, setImageMode] = useState('file');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Libera la URL temporal de la vista previa cuando cambia el archivo o se sale de la página
  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0] ?? null;
    let validationError = '';
    if (file && !TIPOS_IMAGEN.includes(file.type)) {
      validationError = 'Formato de imagen no soportado. Use JPG, PNG o WEBP.';
    } else if (file && file.size > TAMANIO_MAXIMO_IMAGEN) {
      validationError = 'La imagen supera el tamaño máximo permitido (5 MB).';
    }
    setError(validationError);
    if (validationError) event.target.value = '';
    // Un archivo inválido descarta también el que estaba elegido antes
    const validFile = validationError ? null : file;
    setImageFile(validFile);
    setImagePreview(validFile ? URL.createObjectURL(validFile) : '');
  };

  // Paso 1: si hay un archivo, se sube y el backend devuelve la URL con la que queda publicado
  const resolveImageUrl = async () => {
    if (imageMode === 'url') return product.image_url.trim();
    if (!imageFile) return '';
    const formData = new FormData();
    formData.append('imagen', imageFile);
    const { image_url: imageUrl } = await postFormData('/productos/imagen', formData);
    return imageUrl;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const imageUrl = await resolveImageUrl();
      // Paso 2: alta del producto con la URL de la imagen
      await postJson('/productos', {
        nombre: product.nombre.trim(),
        descripcion: product.descripcion.trim(),
        precio: Number(product.precio),
        stock: Number(product.stock),
        categoriaId: Number(product.categoriaId),
        image_url: imageUrl,
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

          <div className="crud-product-field">
            <span>Imagen</span>
            <div className="crud-product-image-modes" role="group" aria-label="Origen de la imagen">
              <button
                type="button"
                className={imageMode === 'file' ? 'is-active' : ''}
                aria-pressed={imageMode === 'file'}
                onClick={() => setImageMode('file')}
              >
                Subir archivo
              </button>
              <button
                type="button"
                className={imageMode === 'url' ? 'is-active' : ''}
                aria-pressed={imageMode === 'url'}
                onClick={() => setImageMode('url')}
              >
                Usar URL
              </button>
            </div>

            {imageMode === 'file' ? (
              <>
                <input
                  name="imagen"
                  type="file"
                  accept={TIPOS_IMAGEN.join(',')}
                  onChange={handleFileChange}
                  aria-label="Archivo de imagen"
                />
                <small className="crud-product-hint">JPG, PNG o WEBP, hasta 5 MB.</small>
                {imagePreview && (
                  <img className="crud-product-image-preview" src={imagePreview} alt="Vista previa de la imagen" />
                )}
              </>
            ) : (
              <input
                name="image_url"
                type="url"
                value={product.image_url}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                aria-label="URL de la imagen"
              />
            )}
          </div>

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
