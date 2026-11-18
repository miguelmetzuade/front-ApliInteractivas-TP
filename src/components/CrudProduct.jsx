import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getJson, postFormData, postJson, putJson } from '../services/api';
import '../styles/pages/CrudProduct.css';

// Mismos límites que valida el backend (POST /api/productos/imagen)
const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANIO_MAXIMO_IMAGEN = 5 * 1024 * 1024;

// El formulario arranca vacío: los inputs controlados usan '' (no undefined)
const INITIAL_PRODUCT = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  categoriaId: '',
  image_url: '',
};

// Formulario de alta y de edición de productos.
// - /products/new                -> alta (POST /api/productos)
// - /seller/products/:id/edit    -> edición de un producto propio (PUT /api/productos/{id})
const CrudProduct = () => {
  const navigate = useNavigate();
  // useParams lee el :id de la URL. Si existe, el formulario está en modo edición
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const [product, setProduct] = useState(INITIAL_PRODUCT);
  // Resultado de cargar el producto a editar: guarda de qué id es (si no coincide con el de la URL, está cargando)
  const [cargaProducto, setCargaProducto] = useState({ id: null, error: null });
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

  // Solo en edición: trae el producto y completa el formulario. Se vuelve a ejecutar si cambia el id.
  // GET /productos/mios/{id} responde 404 si el producto no es del usuario logueado.
  useEffect(() => {
    if (!id) return;
    getJson(`/productos/mios/${id}`)
      .then((data) => {
        // Los inputs controlados trabajan con strings
        setProduct({
          nombre: data.nombre,
          descripcion: data.descripcion ?? '',
          precio: String(data.precio),
          stock: String(data.stock),
          categoriaId: String(data.categoriaId),
          image_url: data.image_url ?? '',
        });
        setCargaProducto({ id, error: null });
      })
      .catch((requestError) => setCargaProducto({ id, error: requestError.message }));
  }, [id]);

  const cargandoProducto = esEdicion && cargaProducto.id !== id;

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

  // Paso 1: si hay un archivo, se sube y el backend devuelve la URL con la que queda publicado.
  // Sin archivo nuevo se mantiene la imagen que ya tenía (en el alta es '', o sea sin imagen)
  const resolveImageUrl = async () => {
    if (imageMode === 'url') return product.image_url.trim();
    if (!imageFile) return product.image_url;
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
      const body = {
        nombre: product.nombre.trim(),
        descripcion: product.descripcion.trim(),
        precio: Number(product.precio),
        stock: Number(product.stock),
        categoriaId: Number(product.categoriaId),
        image_url: imageUrl,
      };
      // Paso 2: modificación (PUT) o alta (POST) del producto con la URL de la imagen
      if (esEdicion) {
        await putJson(`/productos/${id}`, body);
        navigate(`/seller/products/${id}`);
      } else {
        await postJson('/productos', body);
        navigate('/seller');
      }
    } catch (requestError) {
      setError(requestError.message || 'No se pudo guardar el producto.');
    } finally {
      setSubmitting(false);
    }
  };

  // En edición, mientras llega el producto o si no se pudo cargar, no se muestra el formulario
  if (cargandoProducto) {
    return <main className="crud-product-page"><p className="crud-product-hint">Cargando producto...</p></main>;
  }
  if (esEdicion && cargaProducto.error) {
    return (
      <main className="crud-product-page">
        <p className="crud-product-error" role="alert">No se pudo cargar el producto: {cargaProducto.error}</p>
        <Link className="crud-product-cancel" to="/seller">Volver a Mis productos</Link>
      </main>
    );
  }

  // Imagen a mostrar: la nueva elegida o, si no hay, la que ya tiene el producto
  const vistaPrevia = imagePreview || product.image_url;

  return (
    <main className="crud-product-page">
      <section className="crud-product-card">
        <div className="crud-product-heading">
          <span className="crud-product-eyebrow">Catálogo</span>
          <h1>{esEdicion ? 'Editar producto' : 'Agregar producto'}</h1>
          <p>
            {esEdicion
              ? 'Modificá los datos de tu publicación y guardá los cambios.'
              : 'Completa los datos para publicar un nuevo producto.'}
          </p>
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
              // La columna description en la base es varchar(255): se deja margen
              maxLength={240}
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
                {vistaPrevia && (
                  <img className="crud-product-image-preview" src={vistaPrevia} alt="Vista previa de la imagen" />
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
              {/* Opción inicial no elegible: con required obliga a elegir una categoría */}
              <option value="" disabled>Elegí una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="crud-product-error" role="alert">{error}</p>}

          <div className="crud-product-actions">
            <Link className="crud-product-cancel" to={esEdicion ? `/seller/products/${id}` : '/products'}>Cancelar</Link>
            <button className="crud-product-submit" type="submit" disabled={submitting || loadingCategories || categories.length === 0}>
              {submitting ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Aceptar'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CrudProduct;
