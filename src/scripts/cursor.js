// Cursor personalitzat: un punt lila que segueix el ratolí i creix sobre elements clicables.
// Només s'activa amb ratolí (hover + pointer fi); en dispositius tàctils no fa res
// i el cursor natiu es manté. Els estils són a styles/components/cursor.css.
const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)');

const CLICKABLE = [
  'a[href]',
  'button',
  'summary',
  'label',
  'select',
  '[role="button"]',
  '[role="link"]',
  '[tabindex]:not([tabindex="-1"])',
  '[data-cursor="hover"]',
].join(',');

// Zones de la web i el tema de color del cursor a cada una (light | lavender | dark | media).
// S'assignen com a data-cursor-theme en carregar, sense tocar el marcatge; les regles més específiques
// van primer i un data-cursor-theme escrit a mà a l'HTML sempre té prioritat. Les zones no llistades són "light".
// Es tria el tema de l'ancestre més proper amb data-cursor-theme.
const ZONES = [
  ['.card--ink .card__placeholder', 'dark'],
  ['.card--sand .card__placeholder', 'light'],
  ['.card--lavender-soft .card__placeholder', 'lavender'],
  ['.card__placeholder', 'lavender'],
  ['.button--ink', 'dark'],
  ['.button', 'lavender'],
  ['.contact', 'lavender'],
  ['.hero__media, .about-hero__media, .about__media, .project-media, .video__frame, .social__link', 'media'],
];
const DEFAULT_THEME = 'light';

// Camps on l'usuari escriu: es manté el cursor de text natiu.
const EDITABLE = 'input:not([type="button"],[type="submit"],[type="reset"],[type="checkbox"],[type="radio"],[type="range"],[type="color"],[type="file"],[type="image"]),textarea,[contenteditable=""],[contenteditable="true"]';

let cursor = null;
let theme = '';
let frame = 0;
let x = 0;
let y = 0;

function render() {
  frame = 0;
  cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

function tagZones() {
  for (const [selector, zoneTheme] of ZONES) {
    for (const el of document.querySelectorAll(selector)) {
      if (!el.hasAttribute('data-cursor-theme')) el.setAttribute('data-cursor-theme', zoneTheme);
    }
  }
}

function setTheme(el) {
  const next = el?.closest('[data-cursor-theme]')?.getAttribute('data-cursor-theme') ?? DEFAULT_THEME;
  if (next === theme) return;
  theme = next;
  cursor.dataset.cursorTheme = next;
}

function setState(target) {
  const el = target instanceof Element ? target : null;
  setTheme(el);
  const editable = Boolean(el?.closest(EDITABLE));
  document.documentElement.classList.toggle('cursor-native', editable);
  cursor.classList.toggle('is-hover', !editable && Boolean(el?.closest(CLICKABLE)));
}

function onMove(event) {
  if (event.pointerType !== 'mouse') return;
  x = event.clientX;
  y = event.clientY;
  cursor.classList.add('is-visible');
  if (!frame) frame = requestAnimationFrame(render);
}

function onOver(event) {
  if (event.pointerType === 'mouse') setState(event.target);
}

function onLeaveWindow(event) {
  if (!event.relatedTarget) cursor.classList.remove('is-visible');
}

function onDown() {
  cursor.classList.add('is-down');
}

function onUp() {
  cursor.classList.remove('is-down');
}

function enable() {
  if (cursor) return;
  cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span class="cursor__dot"></span>';
  tagZones();
  setTheme(null);
  document.body.append(cursor);
  document.documentElement.classList.add('has-cursor');

  document.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerover', onOver, { passive: true });
  document.addEventListener('pointerdown', onDown, { passive: true });
  document.addEventListener('pointerup', onUp, { passive: true });
  document.addEventListener('pointerout', onLeaveWindow, { passive: true });
}

function disable() {
  if (!cursor) return;
  document.removeEventListener('pointermove', onMove);
  document.removeEventListener('pointerover', onOver);
  document.removeEventListener('pointerdown', onDown);
  document.removeEventListener('pointerup', onUp);
  document.removeEventListener('pointerout', onLeaveWindow);
  cancelAnimationFrame(frame);
  frame = 0;
  cursor.remove();
  cursor = null;
  theme = '';
  document.documentElement.classList.remove('has-cursor', 'cursor-native');
}

function sync() {
  if (FINE_POINTER.matches) enable();
  else disable();
}

sync();
FINE_POINTER.addEventListener('change', sync);
