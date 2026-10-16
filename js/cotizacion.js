import { PAQUETES } from './datos.js';
import { formatearDinero } from './formato.js';

// \p{L} cuenta cualquier letra, también las acentuadas y la ñ.
const LETRA = /\p{L}/gu;

export function iniciarCotizacion() {
  const seccion = document.getElementById('cotizacion');
  if (!seccion) return;

  const formulario = seccion.querySelector('.cotizacion__formulario');
  const exito = seccion.querySelector('.cotizacion__exito');
  const cifras = seccion.querySelector('.cotizacion__resumen-cifras');
  const reciboHoy = seccion.querySelector('.cotizacion__hoy');
  const monto = seccion.querySelector('.cotizacion__monto');
  const conSolmara = seccion.querySelector('.cotizacion__con-solmara');
  const aviso = seccion.querySelector('.cotizacion__aviso');
  const lineaPaquete = seccion.querySelector('.cotizacion__paquete');
  const nombrePaquete = seccion.querySelector('.cotizacion__paquete-nombre');
  const opciones = [...formulario.querySelectorAll('.selector__opcion')];
  const { nombre, telefono, cp, recibo, techo, paquete } = formulario.elements;

  const campos = [
    { control: nombre, valido: (valor) => (valor.match(LETRA) || []).length >= 2 },
    { control: telefono, valido: (valor) => /^\d{10}$/.test(valor.replace(/[\s-]/g, '')) },
    { control: cp, valido: (valor) => /^\d{5}$/.test(valor.trim()) },
  ];

  function marcarTecho(elegido) {
    opciones.forEach((opcion) => opcion.setAttribute('aria-pressed', String(opcion.dataset.techo === elegido)));
    techo.value = elegido;
  }

  // El mensaje de error reemplaza a la ayuda, y aria-describedby apunta siempre a lo
  // visible: un mensaje oculto referenciado por aria-describedby igual se leería.
  function mostrarError({ control }, conError) {
    const error = document.getElementById(`${control.id}-error`);
    const ayuda = document.getElementById(`${control.id}-ayuda`);
    const visible = conError ? error : ayuda;

    error.hidden = !conError;
    if (ayuda) ayuda.hidden = conError;

    if (visible) {
      control.setAttribute('aria-describedby', visible.id);
    } else {
      control.removeAttribute('aria-describedby');
    }

    if (conError) {
      control.setAttribute('aria-invalid', 'true');
    } else {
      control.removeAttribute('aria-invalid');
    }
  }

  document.addEventListener('estimacion:actualizada', ({ detail }) => {
    reciboHoy.textContent = formatearDinero(detail.recibo);
    cifras.classList.toggle('cotizacion__resumen-cifras--sin-ahorro', !detail.conviene);
    monto.hidden = !detail.conviene;
    conSolmara.hidden = !detail.conviene;
    aviso.hidden = detail.conviene;
    if (detail.conviene) monto.textContent = formatearDinero(detail.pagoConPaneles);

    recibo.value = detail.recibo;
    marcarTecho(detail.techo);
  });

  document.addEventListener('paquete:elegido', ({ detail }) => {
    const elegido = PAQUETES.find((opcion) => opcion.id === detail.id);
    if (!elegido) return;
    nombrePaquete.textContent = elegido.nombre;
    lineaPaquete.hidden = false;
    paquete.value = elegido.id;
  });

  // Solo se emite cuando la persona toca este selector, nunca al actualizarlo por un
  // evento de la calculadora: así los dos módulos no se responden en ciclo.
  opciones.forEach((opcion) => {
    opcion.addEventListener('click', () => {
      marcarTecho(opcion.dataset.techo);
      document.dispatchEvent(new CustomEvent('techo:elegido', { detail: { techo: opcion.dataset.techo } }));
    });
  });

  campos.forEach((campo) => {
    campo.control.addEventListener('input', () => {
      const teniaError = campo.control.getAttribute('aria-invalid') === 'true';
      if (teniaError && campo.valido(campo.control.value)) mostrarError(campo, false);
    });
  });

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const invalidos = campos.filter((campo) => !campo.valido(campo.control.value));
    campos.forEach((campo) => mostrarError(campo, invalidos.includes(campo)));

    if (invalidos.length) {
      invalidos[0].control.focus();
      return;
    }

    exito.querySelector('.cotizacion__exito-nombre').textContent = nombre.value.trim();
    exito.querySelector('.cotizacion__exito-telefono').textContent = telefono.value.trim();
    formulario.hidden = true;
    exito.hidden = false;
    exito.querySelector('.cotizacion__exito-titulo').focus();
  });

  // Vacía solo los datos de contacto: el cálculo y el paquete siguen siendo los de la
  // calculadora y los boletos.
  exito.querySelector('.cotizacion__exito-accion').addEventListener('click', () => {
    campos.forEach((campo) => {
      campo.control.value = '';
      mostrarError(campo, false);
    });
    exito.hidden = true;
    formulario.hidden = false;
    nombre.focus();
  });
}
