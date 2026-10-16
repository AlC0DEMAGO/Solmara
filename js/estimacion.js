import {
  PAQUETES,
  AJUSTE_TECHO,
  RECIBO_MINIMO_CONVENIENTE,
  FACTOR_RECIBO_RESTANTE,
  PAGO_MINIMO_CFE,
  FACTOR_RENDIMIENTO_REAL,
  BIMESTRES_POR_ANIO,
} from './datos.js';

const redondearADecenas = (numero) => Math.round(numero / 10) * 10;

const redondearAMedioAnio = (anios) => Math.round(anios * 2) / 2;

// Función pura (apartado 5 de la especificación): recibe números, devuelve un objeto
// y no toca la página, para poder probarla sola desde la consola.
export function calcularEstimacion(recibo, techo) {
  if (recibo < RECIBO_MINIMO_CONVENIENTE) {
    return { conviene: false };
  }

  const paquete = PAQUETES.find((p) => p.reciboMin <= recibo && recibo < p.reciboMax);
  const pagoConPaneles = Math.max(PAGO_MINIMO_CFE, redondearADecenas(recibo * FACTOR_RECIBO_RESTANTE));
  const ahorro = recibo - pagoConPaneles;
  const inversion = paquete.inversion * AJUSTE_TECHO[techo];
  const retornoAnios = redondearAMedioAnio((inversion / (ahorro * BIMESTRES_POR_ANIO)) * FACTOR_RENDIMIENTO_REAL);

  return { conviene: true, paquete, pagoConPaneles, ahorro, inversion, retornoAnios };
}
