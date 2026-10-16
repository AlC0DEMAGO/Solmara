export const PAQUETES = [
  { id: 'basico',   nombre: 'Básico',   paneles: 4,  inversion: 36000, mensualidad24: 1690, reciboMin: 1500, reciboMax: 3000,     reciboReferencia: 2250, destacado: false },
  { id: 'familiar', nombre: 'Familiar', paneles: 6,  inversion: 52000, mensualidad24: 2450, reciboMin: 3000, reciboMax: 6000,     reciboReferencia: 4500, destacado: true },
  { id: 'premium',  nombre: 'Premium',  paneles: 10, inversion: 85000, mensualidad24: 3990, reciboMin: 6000, reciboMax: Infinity, reciboReferencia: 8000, destacado: false },
];

export const AJUSTE_TECHO = { teja: 1.10, losa: 1.00, lamina: 1.00 };

export const RECIBO_MINIMO_CONVENIENTE = 1500; // por debajo, la luz ya tiene subsidio
export const FACTOR_RECIBO_RESTANTE = 0.12;    // lo que se sigue pagando a la CFE
export const PAGO_MINIMO_CFE = 150;
export const FACTOR_RENDIMIENTO_REAL = 1.3;    // nubes, desgaste y mantenimiento
export const BIMESTRES_POR_ANIO = 6;

export const CALCULADORA = { min: 500, max: 12000, paso: 100, inicial: 4200, techoInicial: 'teja' };
