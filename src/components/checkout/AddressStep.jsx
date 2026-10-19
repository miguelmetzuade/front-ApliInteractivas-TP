import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addAddress,
  removeAddress,
  selectAddress,
  setStep,
  updateAddress,
} from '../../store/slices/checkoutSlice';
import AddressForm from './AddressForm';
import StatusMessage from '../ui/StatusMessage';
import radio from '../../assets/checkout/radio.svg';
import radioChecked from '../../assets/checkout/radio-checked.svg';
import iconEdit from '../../assets/checkout/icon-edit.svg';
import iconClose from '../../assets/cart/icon-close.svg';
import iconPlus from '../../assets/checkout/icon-plus-circle.svg';
import line from '../../assets/checkout/line.svg';
import lineRight from '../../assets/checkout/line-2.svg';

const TAGS = { casa: 'Casa', oficina: 'Oficina' };

// Paso 1 ("Select Address" del Figma): elegir, agregar, editar o borrar direcciones
const AddressStep = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addresses, selectedAddressId } = useSelector((state) => state.checkout);
  // id de la dirección que se está editando, 'new' si se está agregando una, o null
  const [editingId, setEditingId] = useState(addresses.length === 0 ? 'new' : null);

  const saveNew = (address) => {
    dispatch(addAddress(address));
    setEditingId(null);
  };

  const saveEdit = (address) => {
    dispatch(updateAddress(address));
    setEditingId(null);
  };

  return (
    <div className="checkout-step-content">
      <div className="checkout-block">
        <h2 className="checkout-heading">Elegí una dirección</h2>

        <div className="checkout-block-list">
          <div className="address-list" role="radiogroup" aria-label="Direcciones">
            {addresses.map((address) =>
              editingId === address.id ? (
                <AddressForm
                  key={address.id}
                  initialValue={address}
                  onSave={saveEdit}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div key={address.id} className="address-card">
                  <label className="address-card-content">
                    <span className="address-card-top">
                      <input
                        type="radio"
                        name="address"
                        className="visually-hidden"
                        checked={address.id === selectedAddressId}
                        onChange={() => dispatch(selectAddress(address.id))}
                      />
                      <img src={address.id === selectedAddressId ? radioChecked : radio} alt="" className="radio-icon" />
                      <span className="address-name">{address.nombre}</span>
                      <span className="address-tag">{TAGS[address.tipo]}</span>
                    </span>
                    <span className="address-info">
                      <span>{address.direccion}</span>
                      <span>{address.telefono}</span>
                    </span>
                  </label>

                  <div className="address-actions">
                    <button
                      type="button"
                      className="checkout-icon-button"
                      aria-label={`Editar ${address.nombre}`}
                      onClick={() => setEditingId(address.id)}
                    >
                      <img src={iconEdit} alt="" />
                    </button>
                    <button
                      type="button"
                      className="checkout-icon-button"
                      aria-label={`Borrar ${address.nombre}`}
                      onClick={() => dispatch(removeAddress(address.id))}
                    >
                      <img src={iconClose} alt="" />
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>

          {editingId === 'new' ? (
            <AddressForm onSave={saveNew} onCancel={() => setEditingId(null)} />
          ) : (
            <button type="button" className="add-address" onClick={() => setEditingId('new')}>
              <span className="add-address-line">
                <img src={line} alt="" />
                <img src={iconPlus} alt="" className="add-address-icon" />
                <img src={lineRight} alt="" className="add-address-line-right" />
              </span>
              <span className="add-address-text">Agregar dirección</span>
            </button>
          )}

          {addresses.length === 0 && editingId !== 'new' && (
            <StatusMessage>Agregá una dirección para continuar.</StatusMessage>
          )}
        </div>
      </div>

      <div className="checkout-buttons">
        <button type="button" className="btn-secondary btn-large" onClick={() => navigate('/cart')}>
          Volver
        </button>
        <button
          type="button"
          className="btn-primary btn-large"
          onClick={() => dispatch(setStep(2))}
          disabled={!selectedAddressId || editingId !== null}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default AddressStep;
