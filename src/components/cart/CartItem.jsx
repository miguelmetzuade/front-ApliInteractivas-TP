import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeCartItem, updateCartItem } from '../../store/slices/cartSlice';
import { formatPrice } from '../../utils/formatPrice';
import iconMinus from '../../assets/cart/icon-minus.svg';
import iconPlus from '../../assets/cart/icon-plus.svg';
import iconClose from '../../assets/cart/icon-close.svg';
import '../../styles/cart/CartItem.css';

// Renglón del carrito ("Cart Product" del Figma): imagen, nombre, contador, subtotal y botón para sacarlo
const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const pending = useSelector((state) => state.cart.pendingIds.includes(item.productoId));
  const imagen = item.image_url || item.imagenUrl || item.imagen;
  const sinStockSuficiente = item.cantidad > item.stockDisponible;

  const changeQuantity = (cantidad) => {
    dispatch(updateCartItem({ productoId: item.productoId, cantidad }));
  };

  return (
    <li className="cart-item">
      <Link to={`/products/${item.productoId}`} className="cart-item-image">
        {imagen
          ? <img src={imagen} alt={item.nombre} />
          : <span className="cart-item-placeholder">{item.nombre.charAt(0)}</span>}
      </Link>

      <div className="cart-item-content">
        <div className="cart-item-info">
          <Link to={`/products/${item.productoId}`} className="cart-item-name">{item.nombre}</Link>
          <span className="cart-item-code">#{item.productoId}</span>
          {sinStockSuficiente && (
            <span className="cart-item-warning">Solo quedan {item.stockDisponible} unidades</span>
          )}
        </div>

        <div className="cart-item-actions">
          <div className="cart-counter">
            <button
              type="button"
              className="cart-icon-button"
              aria-label="Restar una unidad"
              onClick={() => changeQuantity(item.cantidad - 1)}
              disabled={pending || item.cantidad <= 1}
            >
              <img src={iconMinus} alt="" />
            </button>
            <span className="cart-counter-number">{item.cantidad}</span>
            <button
              type="button"
              className="cart-icon-button"
              aria-label="Sumar una unidad"
              onClick={() => changeQuantity(item.cantidad + 1)}
              disabled={pending || item.cantidad >= item.stockDisponible}
            >
              <img src={iconPlus} alt="" />
            </button>
          </div>

          <span className="cart-item-price">{formatPrice(item.subtotal)}</span>

          <button
            type="button"
            className="cart-icon-button"
            aria-label={`Sacar ${item.nombre} del carrito`}
            onClick={() => dispatch(removeCartItem(item.productoId))}
            disabled={pending}
          >
            <img src={iconClose} alt="" />
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
