const ESCRITORIO = window.matchMedia('(min-width: 1024px)');

export function iniciarMenu() {
  const boton = document.querySelector('.encabezado__boton-menu');
  if (!boton) return;
  const panel = document.getElementById(boton.getAttribute('aria-controls'));

  const estaAbierto = () => boton.getAttribute('aria-expanded') === 'true';

  function abrir() {
    boton.setAttribute('aria-expanded', 'true');
    boton.setAttribute('aria-label', 'Cerrar menú');
    panel.hidden = false;
    panel.querySelector('a').focus();
  }

  // El foco regresa al botón solo al cerrar con el botón o con Escape: tras tocar un
  // enlace, regresarlo haría que la página volviera hasta el header.
  function cerrar({ regresarFoco }) {
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-label', 'Abrir menú');
    panel.hidden = true;
    if (regresarFoco) boton.focus();
  }

  boton.addEventListener('click', () => {
    if (estaAbierto()) {
      cerrar({ regresarFoco: true });
    } else {
      abrir();
    }
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && estaAbierto()) cerrar({ regresarFoco: true });
  });

  panel.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) cerrar({ regresarFoco: false });
  });

  document.addEventListener('click', (evento) => {
    const fuera = !panel.contains(evento.target) && !boton.contains(evento.target);
    if (estaAbierto() && fuera) cerrar({ regresarFoco: false });
  });

  ESCRITORIO.addEventListener('change', (evento) => {
    if (evento.matches && estaAbierto()) cerrar({ regresarFoco: false });
  });
}
