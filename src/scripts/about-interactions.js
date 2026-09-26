// Pàgina /sobre-mi: previsualització de la Trajectòria i deriva de "Fora de càmera" segons el cursor.
// Tot és millora progressiva: sense JS la llista funciona amb :hover/:focus-within i les paraules queden fixes.
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

initTrajectory();
initDrift();

// La fila activa (hover o focus de teclat) marca la fotografia del panell enganxat.
function initTrajectory() {
  const list = document.querySelector('[data-trajectory-list]');
  if (!list) return;
  const items = [...list.querySelectorAll('[data-trajectory]')];
  const figures = [...document.querySelectorAll('.trajectory__fig')];
  if (!items.length) return;

  const activate = (item, mark = true) => {
    items.forEach((el) => el.classList.toggle('is-active', mark && el === item));
    figures.forEach((fig) => fig.classList.toggle('is-active', fig.dataset.for === item.dataset.trajectory));
  };

  // Amb ratolí, la primera fila comença oberta; amb tàctil només es mostra la fotografia.
  activate(items[0], finePointer.matches);
  for (const item of items) {
    item.addEventListener('pointerenter', () => activate(item));
    item.addEventListener('focusin', () => activate(item));
  }
}

// El cursor mou cada paraula una mica, a profunditats diferents (--depth). Només amb ratolí i sense reduced-motion.
function initDrift() {
  const stage = document.querySelector('[data-drift]');
  if (!stage) return;
  let frame = 0;
  let mx = 0;
  let my = 0;
  let active = false;

  const paint = () => {
    frame = 0;
    stage.style.setProperty('--mx', mx.toFixed(3));
    stage.style.setProperty('--my', my.toFixed(3));
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(paint);
  };
  const onMove = (event) => {
    if (event.pointerType !== 'mouse') return;
    const rect = stage.getBoundingClientRect();
    mx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    my = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    schedule();
  };
  const onLeave = () => {
    mx = 0;
    my = 0;
    schedule();
  };
  const sync = () => {
    const should = finePointer.matches && !reduceMotion.matches;
    if (should === active) return;
    active = should;
    stage.classList.toggle('is-drifting', should);
    const method = should ? 'addEventListener' : 'removeEventListener';
    stage[method]('pointermove', onMove, { passive: true });
    stage[method]('pointerleave', onLeave, { passive: true });
    if (!should) onLeave();
  };

  sync();
  finePointer.addEventListener('change', sync);
  reduceMotion.addEventListener('change', sync);
}
