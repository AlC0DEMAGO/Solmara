import { iniciarMenu } from './menu.js';
import { iniciarCotizacion } from './cotizacion.js';
import { iniciarPaquetes } from './paquetes.js';
import { iniciarCalculadora } from './calculadora.js';

iniciarMenu();
// La cotización arranca antes que la calculadora para escuchar el cálculo que la
// calculadora avisa al cargar.
iniciarCotizacion();
iniciarPaquetes();
iniciarCalculadora();
