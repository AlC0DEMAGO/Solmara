import { CALCULADORA } from './datos.js';
import { calcularEstimacion } from './estimacion.js';
import { formatearDinero, formatearAnios } from './formato.js';

// Espera tras el último cambio antes de anunciar: con las flechas del teclado cada
// pulsación es un cambio, y así el lector de pantalla no encadena anuncios.
const ESPERA_ANUNCIO = 500;

export function iniciarCalculadora() {
  const seccion = document.getElementById('calculadora');
  if (!seccion) return;

  const control = seccion.querySelector('.calculadora__control');
  const valor = seccion.querySelector('.calculadora__cifra');
  const [limiteMinimo, limiteMaximo] = seccion.querySelectorAll('.calculadora__limites span');
  const opciones = [...seccion.querySelectorAll('.selector__opcion')];
  const resultado = seccion.querySelector('.calculadora__resultado');
  const noConviene = seccion.querySelector('.calculadora__no-conviene');
  const monto = seccion.querySelector('.calculadora__cifra-xl');
  const reciboHoy = seccion.querySelector('.calculadora__hoy s');
  const ahorro = seccion.querySelector('[data-dato="ahorro"]');
  const paneles = seccion.querySelector('[data-dato="paneles"]');
  const retorno = seccion.querySelector('[data-dato="retorno"]');
  const [botonVisita, botonDudas] = seccion.querySelectorAll('.calculadora__accion');
  const anuncio = document.getElementById('calculadora-anuncio');

  // El HTML trae el rango escrito para cuando no hay JavaScript, pero las cifras
  // tienen una sola fuente: datos.js.
  control.min = CALCULADORA.min;
  control.max = CALCULADORA.max;
  control.step = CALCULADORA.paso;
  limiteMinimo.textContent = formatearDinero(CALCULADORA.min);
  limiteMaximo.textContent = formatearDinero(CALCULADORA.max);

  const elegida = opciones.find((opcion) => opcion.getAttribute('aria-pressed') === 'true');
  let techo = elegida ? elegida.dataset.techo : CALCULADORA.techoInicial;
  let temporizadorAnuncio;

  function actualizar({ emitir }) {
    const recibo = Number(control.value);
    const estimacion = calcularEstimacion(recibo, techo);
    const progreso = ((recibo - CALCULADORA.min) / (CALCULADORA.max - CALCULADORA.min)) * 100;

    valor.textContent = formatearDinero(recibo);
    control.style.setProperty('--progreso', `${progreso}%`);
    control.setAttribute('aria-valuetext', `${formatearDinero(recibo)} cada dos meses`);
    opciones.forEach((opcion) => opcion.setAttribute('aria-pressed', String(opcion.dataset.techo === techo)));

    resultado.hidden = !estimacion.conviene;
    botonVisita.hidden = !estimacion.conviene;
    noConviene.hidden = estimacion.conviene;
    botonDudas.hidden = estimacion.conviene;

    if (estimacion.conviene) {
      monto.textContent = formatearDinero(estimacion.pagoConPaneles);
      reciboHoy.textContent = formatearDinero(recibo);
      ahorro.textContent = formatearDinero(estimacion.ahorro);
      paneles.textContent = estimacion.paquete.paneles;
      retorno.textContent = formatearAnios(estimacion.retornoAnios);
    }

    if (emitir) {
      document.dispatchEvent(new CustomEvent('estimacion:actualizada', { detail: { recibo, techo, ...estimacion } }));
    }
  }

  // Copia el texto visible del recibo en la región oculta con aria-live: el recibo no
  // lleva aria-live porque se actualiza con cada movimiento del control.
  function anunciar() {
    clearTimeout(temporizadorAnuncio);
    temporizadorAnuncio = setTimeout(() => {
      const visible = resultado.hidden ? noConviene : resultado;
      anuncio.textContent = visible.innerText.replace(/\s+/g, ' ').trim();
    }, ESPERA_ANUNCIO);
  }

  control.addEventListener('input', () => actualizar({ emitir: true }));
  control.addEventListener('change', anunciar);

  opciones.forEach((opcion) => {
    opcion.addEventListener('click', () => {
      techo = opcion.dataset.techo;
      actualizar({ emitir: true });
      anunciar();
    });
  });

  // El techo elegido en el formulario se refleja aquí sin anunciar ni emitir: si la
  // calculadora respondiera con otro evento, los dos módulos se avisarían en ciclo.
  document.addEventListener('techo:elegido', ({ detail }) => {
    techo = detail.techo;
    actualizar({ emitir: false });
  });

  actualizar({ emitir: true });
}
