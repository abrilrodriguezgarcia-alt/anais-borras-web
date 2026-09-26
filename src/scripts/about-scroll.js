// Pàgina /sobre-mi: aparició progressiva de blocs ([data-reveal]) i progrés lligat a l'scroll de
// "Una mirada, molts formats" ([data-formats]). Els estils inicials només s'apliquen amb .js-reveal a <html>,
// així que sense JS, o amb prefers-reduced-motion, tot queda visible i estàtic.
const reveals = document.querySelectorAll('[data-reveal]');
const formats = document.querySelector('[data-formats]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if ((reveals.length || formats) && !reduceMotion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
  );
  reveals.forEach((el) => observer.observe(el));

  if (formats) initFormats(formats);
}

function initFormats(section) {
  const track = section.querySelector('.formats__track');
  const items = [...section.querySelectorAll('.formats__item')];
  let frame = 0;

  function update() {
    frame = 0;
    const vh = window.innerHeight;
    const { top, height } = track.getBoundingClientRect();
    // 0 quan la pista ha pujat fins al 45% de la finestra; 1 quan l'escenari deixa de ser fix.
    const start = vh * 0.45;
    const end = vh - height;
    const progress = Math.min(1, Math.max(0, (start - top) / (start - end)));
    // L'última paraula arriba al 85% del recorregut i hi queda una estona abans de sortir.
    const shown = Math.min(items.length, Math.floor((progress * items.length) / 0.85));
    items.forEach((item, i) => {
      item.classList.toggle('is-on', i < shown);
      item.classList.toggle('is-current', i === shown - 1);
    });
  }

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();
}
