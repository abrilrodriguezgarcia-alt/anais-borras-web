// Plantilles de les parts de la Home que s'alimenten de src/data/*.json.
// Vite les injecta a index.html en build i en dev (vegeu vite.config.js).

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const ICONS = {
  instagram:
    '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
  tiktok: '<path d="M14 3.5v11a3.75 3.75 0 1 1-3.75-3.75"/><path d="M14 3.5c.35 2.6 2.1 4.3 5 4.6"/>',
  youtube:
    '<rect x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path d="m10 9.25 5 2.75-5 2.75z" fill="currentColor"/>',
  spotify:
    '<circle cx="12" cy="12" r="9.5"/><path d="M6.8 9.6c3.7-1.1 7.5-.8 10.5 1"/><path d="M7.4 13c3-.9 5.9-.5 8.4 1"/><path d="M8 16.2c2.4-.6 4.5-.4 6.5.8"/>',
};

const ARROW =
  '<svg class="arrow" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M4 12h16m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';

// Enllaços interns amb el `base` de Vite (p. ex. /anais-borras-web/ a GitHub Pages) i barra final (carpeta/index.html).
// `current` és la ruta de la pàgina activa i es marca amb aria-current.
export const nav = (site, base = '/', current = '') =>
  site.nav
    .map((item) => {
      const href = `${base.replace(/\/$/, '')}${item.href.replace(/\/$/, '')}/`;
      const active = item.href === current ? ' aria-current="page"' : '';
      return `<li><a class="nav__link" href="${esc(href)}"${active}>${esc(item.label)}</a></li>`;
    })
    .join('\n');

export const socials = (site) =>
  site.socials
    .map((s) => {
      // TODO: URL pendent de confirmar; mentrestant l'enllaç queda inactiu.
      const attrs = s.url
        ? `href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"`
        : 'href="#" data-todo="url-pendent"';
      return `<li><a class="socials__link" ${attrs} aria-label="${esc(s.label)}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[s.id]}</svg></a></li>`;
    })
    .join('\n');

export const legal = (site) => site.legal.map((l) => `<li><a class="footer__link" href="${esc(l.href)}">${esc(l.label)}</a></li>`).join('\n');

export const instagramUrl = (site) => site.socials.find((s) => s.id === 'instagram').url;

export const year = () => String(new Date().getFullYear());

export const topics = (site) => site.topics.map((t) => `<li>${esc(t)}</li>`).join('\n');

export const partners = (list) =>
  list
    .map(
      (p) =>
        // TODO: substituir el wordmark tipogràfic per l'SVG oficial (camp `logo`) quan existeixi.
        `<li class="partners__item"><span class="wordmark wordmark--${esc(p.variant)}">${esc(p.name)}</span></li>`,
    )
    .join('\n');

// Zona visual de cada targeta: fotografia real + overlay + logotip oficial (decoratius; el nom apareix a sota).
// Origen i estat de drets de cada asset: docs/ASSETS.md.
// Prefixa les rutes de public/ amb el base de Vite (p. ex. /anais-borras-web/ a GitHub Pages).
const publicUrl = (base, path) => encodeURI(`${base.replace(/\/$/, '')}${path}`);

const projectMedia = (p, base) => {
  const logo = `<img class="project-media__logo" src="${esc(publicUrl(base, p.logo))}" alt="" loading="lazy" decoding="async">`;
  const photo = p.image
    ? `<img class="project-media__img" src="${esc(publicUrl(base, p.image))}" alt="" loading="lazy" decoding="async" width="${p.imageWidth}" height="${p.imageHeight}">
    <span class="project-media__overlay" aria-hidden="true"></span>`
    : '';
  return `<div class="card__media project-media project-media--${esc(p.id)}" data-logo-position="${esc(p.logoPosition)}" data-overlay="${esc(p.overlay ?? 'none')}">
    ${photo}
    ${logo}
  </div>`;
};

export const projects = (list, base = '/') =>
  list
    .map(
      (p) => `<li class="card card--project">
  ${projectMedia(p, base)}
  <div class="card__body">
    <h3 class="card__title"><a class="card__link" href="${esc(p.href)}">${esc(p.name)}</a></h3>
    <p class="card__text">${esc(p.description)}</p>
    ${ARROW}
  </div>
</li>`,
    )
    .join('\n');

const dateFormat = new Intl.DateTimeFormat('ca-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// Llista d'articles reutilitzable a la Home (destacats) i a la futura pàgina /articles.
export const articles = (list) =>
  list
    .map((a) => {
      // TODO: verificar drets d'ús de les imatges de La Directa abans de publicació definitiva.
      // Si no hi ha imatge, es mostra un fallback tipogràfic.
      const media = a.image
        ? `<img class="card__img" src="${esc(a.image)}" alt="${esc(a.imageAlt ?? '')}" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="1024" height="683">`
        : `<span class="card__placeholder" data-todo="imatge-pendent" aria-hidden="true">${esc(a.publication)}</span>`;
      return `<li class="card card--${esc(a.tone)}">
  <article class="article">
    <div class="card__media">${media}</div>
    <div class="card__body">
      <p class="article__meta"><span>${esc(a.publication)}</span> · <span>${esc(a.category)}</span></p>
      <h3 class="article__title">${esc(a.title)}</h3>
      <p class="card__text">${esc(a.excerpt)}</p>
      <p class="article__foot">
        <time class="article__date" datetime="${esc(a.date)}">${dateFormat.format(new Date(a.date))}</time>
        <a class="card__link article__cta" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">Llegir l'article<span class="sr-only">: ${esc(a.title)} (s'obre a La Directa, en una pestanya nova)</span> ${ARROW}</a>
      </p>
    </div>
  </article>
</li>`;
    })
    .join('\n');

const PLAY =
  '<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="32" fill="currentColor" class="video__play-bg"/><path d="M26 20.5v23l19-11.5z" fill="#111"/></svg>';

// Vídeos amb "lite embed": només thumbnail fins que l'usuari prem Play (vegeu src/scripts/lite-youtube.js).
export const videos = (list) =>
  list
    .map(
      (v) => `<li class="video">
  <article>
    <div class="video__frame" data-video-id="${esc(v.youtubeId)}" data-video-title="${esc(v.youtubeTitle ?? v.title)}">
      <img class="video__thumb" src="${esc(v.thumbnail)}" alt="" loading="lazy" decoding="async" width="1280" height="720">
      ${v.duration ? `<span class="video__duration">${esc(v.duration)}</span>` : ''}
      <button class="video__play" type="button" aria-label="Reproduir ${esc(v.title)}">${PLAY}</button>
    </div>
    <p class="video__meta">FeminismeZ${v.episode ? ` · ${esc(v.episode)}` : ''}</p>
    <h3 class="video__title">${esc(v.title)}</h3>
  </article>
</li>`,
    )
    .join('\n');

const TYPE_ICONS = {
  reel: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="m10 8.75 5 3.25-5 3.25z" fill="currentColor"/>',
  carousel: '<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 5.5v-.5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h.5"/>',
};
const TYPE_LABELS = { reel: 'Reel', carousel: 'Publicació', post: 'Publicació' };

// Selecció curada de publicacions reals d'Instagram: portada local + enllaç al post original (sense SDK de Meta).
export const instagram = (list, base = '/') =>
  list
    .map((p) => {
      const icon = TYPE_ICONS[p.type]
        ? `<span class="social__type" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false">${TYPE_ICONS[p.type]}</svg></span>`
        : '';
      return `<li class="social__item">
  <a class="social__link" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">
    <img class="social__img" src="${esc(publicUrl(base, p.thumbnail))}" alt="${esc(p.alt)}" loading="lazy" decoding="async" width="${p.width}" height="${p.height}">
    ${icon}
    <span class="sr-only">${TYPE_LABELS[p.type] ?? 'Publicació'} a Instagram: ${esc(p.title)} (s'obre en una pestanya nova)</span>
  </a>
</li>`;
    })
    .join('\n');
