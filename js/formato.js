// Se crea una sola vez y no en cada llamada: la calculadora formatea cifras cada vez
// que se mueve el control, y crear un Intl.NumberFormat cuesta más que usarlo.
const formatoDinero = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export function formatearDinero(numero) {
  return formatoDinero.format(numero);
}

export function formatearAnios(anios) {
  return `${anios} ${anios === 1 ? 'año' : 'años'}`;
}
