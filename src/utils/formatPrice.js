// Formatea un precio como en el resto de la app: $1.399 o $8,50
export const formatPrice = (value) =>
  `$${value.toLocaleString('es-AR', { maximumFractionDigits: 2 })}`;
