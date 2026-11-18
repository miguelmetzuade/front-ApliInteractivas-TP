import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getJson, postFormData, postJson, putJson } from '../services/api';
import '../styles/pages/CrudProduct.css';

// Mismos límites que valida el backend (POST /api/productos/imagen y alta/modificación de productos)
const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANIO_MAXIMO_IMAGEN = 5 * 1024 * 1024;
const MAXIMO_IMAGENES = 6;

// El formulario arranca vacío: los inputs controlados usan '' (no undefined)
const INITIAL_PRODUCT = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  categoriaId: '',
};

// Cada imagen de la lista es una de dos:
// - { clave, url }            -> ya publicada (o URL externa): se manda tal cual
// - { clave, file, preview }  -> archivo nuevo: se sube al enviar; preview es una URL temporal (blob:)
// La clave identifica cada imagen en la lista (las URLs se pueden repetir)
const nuevaClave = () => crypto.randomUUID();

// Sube un archivo y devuelve la URL con la que queda publicado (POST /api/productos/imagen)
const subirImagen = async (file) => {
  const formData = new FormData();
  formData.append('imagen', file);
  const { image_url: url } = await postFormData('/productos/imagen', formData);
  return url;
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
  // Las imágenes se agregan subiendo archivos o con una URL externa
  const [imageMode, setImageMode] = useState('file');
  // Fotos del producto, en orden: la primera es la principal
  const [imagenes, setImagenes] = useState([]);
  const [urlExterna, setUrlExterna] = useState('');

  // Al salir de la página se liberan las URLs temporales de las vistas previas.
  // Se usa un ref porque el cleanup de un efecto con [] solo vería la lista inicial
  const imagenesRef = useRef(imagenes);
  useEffect(() => {
    imagenesRef.current = imagenes;
  }, [imagenes]);
  useEffect(() => () => {
    imagenesRef.current.forEach((imagen) => imagen.preview && URL.revokeObjectURL(imagen.preview));
  }, []);

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
        });
        setImagenes((data.imagenes ?? []).map((url) => ({ clave: nuevaClave(), url })));
        setCargaProducto({ id, error: null });
      })
      .catch((requestError) => setCargaProducto({ id, error: requestError.message }));
  }, [id]);

  const cargandoProducto = esEdicion && cargaProducto.id !== id;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct((current) => ({ ...current, [name]: value }));
  };

  const lugaresLibres = MAXIMO_IMAGENES - imagenes.length;

  // Agrega a la lista los archivos elegidos (input con multiple). Los inválidos se descartan con un aviso
  const handleFileChange = (event) => {
    const archivos = [...event.target.files];
    // Se limpia el input para poder volver a elegir el mismo archivo
    event.target.value = '';
    const validos = archivos.filter((file) => TIPOS_IMAGEN.includes(file.type) && file.size <= TAMANIO_MAXIMO_IMAGEN);
    const aAgregar = validos.slice(0, lugaresLibres);

    let aviso = '';
    if (validos.length < archivos.length) aviso = 'Se descartaron archivos que no son JPG, PNG o WEBP o superan los 5 MB.';
    if (aAgregar.length < validos.length) aviso = `Se puede cargar como máximo ${MAXIMO_IMAGENES} imágenes.`;
    setError(aviso);

    const nuevas = aAgregar.map((file) => ({ clave: nuevaClave(), file, preview: URL.createObjectURL(file) }));
    setImagenes((actuales) => [...actuales, ...nuevas]);
  };

  // Agrega una URL externa a la lista
  const agregarUrl = () => {
    const url = urlExterna.trim();
    if (!url) return;
    if (lugaresLibres === 0) {
      setError(`Se puede cargar como máximo ${MAXIMO_IMAGENES} imágenes.`);
      return;
    }
    setImagenes((actuales) => [...actuales, { clave: nuevaClave(), url }]);
    setUrlExterna('');
    setError('');
  };

  const quitarImagen = (clave) => {
    const imagen = imagenes.find((i) => i.clave === clave);
    if (imagen?.preview) URL.revokeObjectURL(imagen.preview);
    setImagenes((actuales) => actuales.filter((i) => i.clave !== clave));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // La consigna pide "una o más fotos"
    if (imagenes.length === 0) {
      setError('Agregá al menos una imagen del producto.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      // Paso 1: se suben en paralelo los archivos nuevos; las que ya tienen URL quedan igual.
      // Promise.all mantiene el orden de la lista (la primera sigue siendo la principal)
      const urls = await Promise.all(imagenes.map((imagen) => (imagen.file ? subirImagen(imagen.file) : imagen.url)));
      const body = {
        nombre: product.nombre.trim(),
        descripcion: product.descripcion.trim(),
        precio: Number(product.precio),
        stock: Number(product.stock),
        categoriaId: Number(product.categoriaId),
        imagenes: urls,
      };
      // Paso 2: modificación (PUT) o alta (POST) del producto con las URLs de las imágenes
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
            <span>Imágenes ({imagenes.length}/{MAXIMO_IMAGENES})</span>
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
              <input
                name="imagen"
                type="file"
                multiple
                accept={TIPOS_IMAGEN.join(',')}
                onChange={handleFileChange}
                disabled={lugaresLibres === 0}
                aria-label="Archivos de imagen"
              />
            ) : (
              <div className="crud-product-url-row">
                <input
                  type="url"
                  value={urlExterna}
                  onChange={(event) => setUrlExterna(event.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  aria-label="URL de la imagen"
                  disabled={lugaresLibres === 0}
                />
                <button type="button" onClick={agregarUrl} disabled={lugaresLibres === 0 || !urlExterna.trim()}>
                  Agregar
                </button>
              </div>
            )}
            <small className="crud-product-hint">
              De 1 a {MAXIMO_IMAGENES} fotos. JPG, PNG o WEBP, hasta 5 MB cada una. La primera es la principal.
            </small>

            {imagenes.length > 0 && (
              <ul className="crud-product-images">
                {imagenes.map((imagen, index) => (
                  <li key={imagen.clave} className="crud-product-image-item">
                    <img
                      className="crud-product-image-preview"
                      src={imagen.preview ?? imagen.url}
                      alt={`Imagen ${index + 1}`}
                    />
                    {index === 0 && <span className="crud-product-image-badge">Principal</span>}
                    <button
                      type="button"
                      className="crud-product-image-remove"
                      aria-label={`Quitar imagen ${index + 1}`}
                      onClick={() => quitarImagen(imagen.clave)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
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
