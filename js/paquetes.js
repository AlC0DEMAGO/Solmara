import { PAQUETES } from './datos.js';
import { calcularEstimacion } from './estimacion.js';
import { formatearDinero, formatearAnios } from './formato.js';

// Los boletos muestran la estimación de un recibo típico de cada rango con techo de
// losa (especificación, apartado 5).
const TECHO_DE_REFERENCIA = 'losa';

function rellenar(boleto, paquete) {
  const estimacion = calcularEstimacion(paquete.reciboReferencia, TECHO_DE_REFERENCIA);
  const cifras = {
    'recibo-minimo': formatearDinero(paquete.reciboMin),
    'recibo-maximo': formatearDinero(paquete.reciboMax),
    paneles: paquete.paneles,
    inversion: formatearDinero(paquete.inversion),
    mensualidad: formatearDinero(paquete.mensualidad24),
    'recibo-con-paneles': formatearDinero(estimacion.pagoConPaneles),
    retorno: formatearAnios(estimacion.retornoAnios),
  };

  // El Premium no tiene recibo máximo en el HTML ("más de $6,000"), así que se salta.
  Object.entries(cifras).forEach(([dato, texto]) => {
    const elemento = boleto.querySelector(`[data-dato="${dato}"]`);
    if (elemento) elemento.textContent = texto;
  });
}

// Mueve solo el carrusel por dentro (scrollLeft): scrollIntoView movería también la página.
function centrar(carrusel, boleto) {
  const izquierda = boleto.getBoundingClientRect().left - carrusel.getBoundingClientRect().left;
  carrusel.scrollLeft += izquierda - (carrusel.clientWidth - boleto.offsetWidth) / 2;
}

export function iniciarPaquetes() {
  const carrusel = document.querySelector('.paquetes__carrusel');
  if (!carrusel) return;

  const boletos = [...carrusel.querySelectorAll('[data-paquete]')];
  const puntos = [...document.querySelectorAll('.paquetes__punto')];
  const paqueteDe = (boleto) => PAQUETES.find((paquete) => paquete.id === boleto.dataset.paquete);

  boletos.forEach((boleto) => rellenar(boleto, paqueteDe(boleto)));

  function marcarPunto() {
    const centro = carrusel.getBoundingClientRect().left + carrusel.clientWidth / 2;
    const distancias = boletos.map((boleto) => {
      const caja = boleto.getBoundingClientRect();
      return Math.abs(caja.left + caja.width / 2 - centro);
    });
    const masCentrado = distancias.indexOf(Math.min(...distancias));
    puntos.forEach((punto, indice) => punto.classList.toggle('paquetes__punto--activo', indice === masCentrado));
  }

  // requestAnimationFrame: el evento scroll se dispara muchas veces por segundo, y basta
  // con revisar los puntos una vez por cuadro.
  let revisionPendiente = false;
  carrusel.addEventListener('scroll', () => {
    if (revisionPendiente) return;
    revisionPendiente = true;
    requestAnimationFrame(() => {
      revisionPendiente = false;
      marcarPunto();
    });
  }, { passive: true });

  const destacado = boletos.find((boleto) => paqueteDe(boleto).destacado);
  if (destacado) centrar(carrusel, destacado);
  marcarPunto();

  // Al llegar con Tab a un boleto que está fuera de la vista, el navegador no siempre
  // desplaza el carrusel, y el foco quedaría en un botón que no se ve.
  carrusel.addEventListener('focusin', (evento) => {
    const boleto = evento.target.closest('[data-paquete]');
    if (boleto) centrar(carrusel, boleto);
  });

  boletos.forEach((boleto) => {
    boleto.querySelector('.paquetes__accion').addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('paquete:elegido', { detail: { id: boleto.dataset.paquete } }));
    });
  });
}
