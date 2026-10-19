import { useState } from 'react';

const EMPTY_ADDRESS = { nombre: '', tipo: 'casa', direccion: '', telefono: '' };

// Formulario para agregar o editar una dirección (se muestra en lugar de la tarjeta)
const AddressForm = ({ initialValue = EMPTY_ADDRESS, onSave, onCancel }) => {
  const [form, setForm] = useState(initialValue);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      nombre: form.nombre.trim(),
      direccion: form.direccion.trim(),
      telefono: form.telefono.trim(),
    });
  };

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <div className="checkout-fields-row">
        <input
          className="checkout-input"
          name="nombre"
          placeholder="Nombre (ej: Casa de mis viejos)"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <select className="checkout-input" name="tipo" value={form.tipo} onChange={handleChange}>
          <option value="casa">Casa</option>
          <option value="oficina">Oficina</option>
        </select>
      </div>
      <input
        className="checkout-input"
        name="direccion"
        placeholder="Dirección completa"
        value={form.direccion}
        onChange={handleChange}
        required
      />
      <input
        className="checkout-input"
        name="telefono"
        type="tel"
        placeholder="Teléfono"
        value={form.telefono}
        onChange={handleChange}
        required
      />
      <div className="address-form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Guardar</button>
      </div>
    </form>
  );
};

export default AddressForm;
