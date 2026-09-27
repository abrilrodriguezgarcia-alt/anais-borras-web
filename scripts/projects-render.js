// Plantilles HTML de Projectes (llistat, targeta, destacat, meta, mitjans i fitxa individual).
// Reben tot el que necessiten per paràmetre (helpers de render.js + model de projects.js) perquè vite.config.js
// pot carregar cada mòdul amb cache-busting i així els canvis es veuen en dev sense reiniciar.
//
// Norma: una dada null/buida no es renderitza mai (ni «null», ni «—», ni etiqueta sense valor).
// Estructura provisional de la Fase 2: el disseny final (retícula, hero, hovers) arriba a les fases 3–4.

export function createProjectRenderers({
  esc,
  publicUrl,
  ARROW,
  PLAY,
  LINK_TYPES,
  LINK_ACTIONS,
  HERO_VARIANTS,
  ARTICLES_VARIANTS,
  projectPath,
  coverRatio,
  listProjects,
  featuredProject,
  nextProject,
  PAUSE_AFTER_ID,
}) {
  const filled = (value) => value !== null && value !== undefined && String(value).trim() !== '';
  const pad = (n) => String(n).padStart(2, '0');
  const href = (base, p) => publicUrl(base, projectPath(p));

  // Format curt de data (Fase 7, arxiu d'articles): «10 juliol 2026». Mapa propi (no Intl) perquè el build no depèn
  // de les dades de locale disponibles a l'entorn.
  const MONTHS = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
  const formatDate = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return `${d} ${MONTHS[m - 1]} ${y}`;
  };

  const META_LABELS = { entity: 'Entitat', role: 'Rol', format: 'Format', year: 'Any' };

  // ProjectMeta: llista de dades presents. Si no n'hi ha cap, no retorna res.
  const projectMeta = (p, keys = ['entity', 'role', 'format', 'year']) => {
    // `funding` és un array (no un camp de text pla) i té la seva pròpia fila: es tracta a banda, mai amb
    // META_LABELS/filled genèrics (que farien «undefined» / «[object Object]»).
    const rows = keys.filter((key) => key !== 'funding' && filled(p[key]));
    const funding = keys.includes('funding') ? p.funding.filter((f) => filled(f.name)) : [];
    if (!rows.length && !funding.length) return '';
    return `<dl class="project-meta">
${rows.map((key) => `      <div class="project-meta__row"><dt>${META_LABELS[key]}</dt><dd>${esc(p[key])}</dd></div>`).join('\n')}
${funding
  .map(
    (f) =>
      `      <div class="project-meta__row"><dt>Beca / organització</dt><dd>${esc(f.name)}${filled(f.organization) ? ` — ${esc(f.organization)}` : ''}${filled(f.year) ? ` (${esc(f.year)})` : ''}</dd></div>`,
  )
  .join('\n')}
    </dl>`;
  };

  // mode: 'lazy' (per defecte) | 'eager' | 'high' (eager + fetchpriority). Amb `variants` genera srcset.
  const imgTag = (m, base, { cls, mode = 'lazy', sizes } = {}) => {
    const srcset = m.variants ? ` srcset="${m.variants.map((v) => `${esc(publicUrl(base, v.src))} ${v.width}w`).join(', ')}"${sizes ? ` sizes="${esc(sizes)}"` : ''}` : '';
    const loading = mode === 'high' ? 'fetchpriority="high"' : mode === 'eager' ? 'loading="eager"' : 'loading="lazy"';
    return `<img class="${cls}" src="${esc(publicUrl(base, m.src))}"${srcset} alt="${esc(m.alt)}" width="${m.width}" height="${m.height}" ${loading} decoding="async"${filled(m.position) ? ` style="object-position:${esc(m.position)}"` : ''}>`;
  };

  // ProjectMedia: portada amb la proporció pròpia del projecte (--ratio); dimensions conegudes i lazy loading.
  // Sense imatge, usa el pòster del vídeo; si tampoc n'hi ha, no hi ha bloc de mitjà (targeta tipogràfica).
  const projectMedia = (p, base, { eager = false } = {}) => {
    const shown = p.image ?? p.video?.poster ?? null;
    if (!shown) return '';
    const ratio = coverRatio(p);
    const style = ratio ? ` style="--ratio:${esc(ratio)}"` : '';
    const mark = !p.image && p.video ? '<span class="project-cover__play" aria-hidden="true"></span>' : '';
    return `<div class="project-cover" data-cursor-theme="media"${style}>
      ${imgTag(shown, base, { cls: 'project-cover__img', mode: eager ? 'high' : 'lazy' })}
      <span class="project-cover__tint" aria-hidden="true"></span>
      ${mark}
    </div>`;
  };

  // ProjectCard: la targeta base. Funciona amb qualsevol combinació de dades null.
  const projectArticle = (p, { base, number, variant = 'card' }) => {
    const ratio = coverRatio(p);
    const videoOnly = !p.image && p.video;
    const hasCover = Boolean(p.image ?? p.video?.poster);
    return `<article class="project-card project-card--${variant}${hasCover ? '' : ' project-card--text'}" id="${esc(p.id)}" data-project="${esc(p.id)}" data-size="${esc(p.size)}"${ratio ? ` data-ratio="${esc(ratio)}"` : ''}${p.featured ? ' data-featured' : ''}>
    ${number ? `<span class="project-card__num" aria-hidden="true">${pad(number)}</span>` : ''}
    ${projectMedia(p, base, { eager: variant === 'featured' })}
    <div class="project-card__body">
      <h3 class="project-card__title"><a class="project-card__link" href="${esc(href(base, p))}">${esc(p.title)}${videoOnly ? '<span class="sr-only"> (inclou vídeo)</span>' : ''}</a></h3>
      ${filled(p.context) ? `<p class="project-card__context">${esc(p.context)}</p>` : ''}
      ${projectMeta(p, ['role', 'format', 'year'])}
      ${filled(p.description) ? `<p class="project-card__text">${esc(p.description)}</p>` : ''}
      ${ARROW}
    </div>
  </article>`;
  };

  // L'atribut va també a l'<li> (l'element real de la retícula) perquè projects-grid.css el llegeixi sense un
  // selector `:has()`.
  // data-reveal a l'<li> (no dins l'article): tota la targeta entra com una sola unitat — número, imatge, nom,
  // metadades i CTA es mouen junts, no cadascun per separat. Reutilitza el reveal ja existent a about-scroll.js.
  const projectCard = (p, opts) => `<li class="projects-grid__item" data-size="${esc(p.size)}" data-reveal>
  ${projectArticle(p, opts)}
</li>`;

  // Retícula (Fase 4A): la resta de projectes publicats, sense el destacat (que ja s'ha renderitzat com a feature).
  // La composició NO es decideix aquí: cada targeta declara data-size (pes) i --ratio (proporció de la imatge,
  // via projectMedia) i és projects-grid.css qui interpreta aquests atributs amb un grid dens. Afegir un projecte
  // a projects.json (amb status: "published") l'incorpora sol, sense tocar cap plantilla ni CSS.
  const projectsGrid = (rest, { base, numberOf }) => {
    if (!rest.length) return '';
    return `<ol class="projects-grid">
${rest.map((p) => projectCard(p, { base, number: numberOf(p) })).join('\n')}
    </ol>`;
  };

  // FeaturedProject (Fase 3): obertura de la pàgina. Visual gran + informació, amb el nom com a part de la composició.
  // Una sola CTA enllaçada (el visual duplica l'enllaç però és aria-hidden i fora de l'ordre de tabulació).
  // Sense imatge ni pòster, cau a una composició només tipogràfica (.feature--text).
  const FEATURE_SIZES = '(min-width: 1100px) min(60vw, 900px), 100vw';

  const featuredBlock = (p, { base, number }) => {
    const shown = p.image ?? p.video?.poster ?? null;
    const ratio = coverRatio(p);
    const url = esc(href(base, p));
    const title = esc(p.title);
    const visual = shown
      ? `<a class="feature__visual" href="${url}" tabindex="-1" aria-hidden="true" data-cursor-theme="media">
        <span class="feature__frame"${ratio ? ` style="--ratio:${esc(ratio)}"` : ''}>
          ${imgTag(shown, base, { cls: 'feature__img', mode: 'eager', sizes: FEATURE_SIZES })}
          <span class="feature__tint" aria-hidden="true"></span>${!p.image && p.video ? '\n          <span class="project-cover__play" aria-hidden="true"></span>' : ''}
        </span>
      </a>`
      : '';
    return `<article class="feature${shown ? '' : ' feature--text'}" data-project="${esc(p.id)}" data-size="${esc(p.size)}"${ratio ? ` data-ratio="${esc(ratio)}"` : ''} data-featured>
      <p class="feature__num" aria-hidden="true">${pad(number)}</p>
      ${visual}
      <div class="feature__body" data-reveal>
        <h2 class="feature__title" id="featured-title">${title}</h2>
        ${filled(p.context) ? `<p class="feature__context">${esc(p.context)}</p>` : ''}
        ${projectMeta(p, ['role', 'format', 'year'])}
        ${filled(p.description) ? `<p class="feature__text">${esc(p.description)}</p>` : ''}
        <a class="link-arrow feature__cta" href="${url}">Veure projecte<span class="sr-only">: ${title}</span> ${ARROW}</a>
      </div>
    </article>`;
  };

  // Pausa editorial (Fase 4C): una sola frase entre dos blocs de la retícula, més discreta que el Hero.
  // TODO: text provisional; validar amb l'Anaïs (mateix criteri que el titular del Hero).
  const editorialPause = () => `<p class="projects-pause" data-reveal>
      <span class="projects-pause__line">Una idea també</span>
      <span class="projects-pause__line projects-pause__line--accent">pot ser una conversa.</span>
    </p>`;

  // Pàgina /projectes: el destacat (featured === true) i, després, la retícula amb la resta.
  // La numeració és la posició a `listProjects` (per `order`): el destacat ja és 01, la resta continua des de 02
  // encara que no aparegui al llistat — el destacat mai es torna a renderitzar dins la retícula.
  const projectsPage = (list, { base = '/' } = {}) => {
    const ordered = listProjects(list);
    const featured = featuredProject(list);
    const numberOf = (p) => ordered.indexOf(p) + 1;
    const rest = ordered.filter((p) => p !== featured);

    // La pausa s'ancora a PAUSE_AFTER_ID (no a una posició de l'array): si l'id existeix i encara li segueix algun
    // projecte, parteix la retícula en dos blocs amb la frase entremig; si no (l'id ha desaparegut, o és l'últim),
    // es renderitza una sola retícula sense pausa. Res d'això depèn de tenir exactament 8 projectes.
    const pauseIndex = rest.findIndex((p) => p.id === PAUSE_AFTER_ID);
    const hasPause = pauseIndex !== -1 && pauseIndex < rest.length - 1;
    const restA = hasPause ? rest.slice(0, pauseIndex + 1) : rest;
    const restB = hasPause ? rest.slice(pauseIndex + 1) : [];

    return `${
      featured
        ? `<section class="projects-featured" id="projecte-destacat" aria-labelledby="featured-title">
  <div class="container">
    ${featuredBlock(featured, { base, number: numberOf(featured) })}
  </div>
</section>`
        : ''
    }
${
  rest.length
    ? `<section class="projects-rest" aria-labelledby="projects-rest-title">
  <div class="container">
    <h2 class="sr-only" id="projects-rest-title">Altres projectes</h2>
    ${projectsGrid(restA, { base, numberOf })}
    ${hasPause ? editorialPause() : ''}
    ${hasPause ? projectsGrid(restB, { base, numberOf }) : ''}
  </div>
</section>`
    : ''
}`;
  };

  // ==================================================================================================
  // Fitxa individual (/projectes/:slug) — Fase 5.
  // ProjectDetailPage: rep un projecte (i la llista sencera, per calcular el «Següent projecte») i renderitza
  // NOMÉS les seccions amb informació real. Un projecte amb només nom + format + visual ha de funcionar igual
  // que un amb tot ple — cap secció no deixa mai un títol o un espai buit.
  // ==================================================================================================

  const videoEmbed = (v, base, cls = 'project-detail__video') => `<div class="video__frame ${cls}" data-video-id="${esc(v.videoId)}" data-video-title="${esc(v.title)}">
        <img class="video__thumb" src="${esc(publicUrl(base, v.poster.src))}" alt="${esc(v.poster.alt)}" loading="lazy" decoding="async" width="${v.poster.width}" height="${v.poster.height}">
        <button class="video__play" type="button" aria-label="Reproduir ${esc(v.title)}">${PLAY}</button>
      </div>`;

  // 01 — HERO. Número + categoria/context si existeix, nom, descripció curta (lede), metadades (rol/format/any/
  // entitat/beca) i el visual principal (foto real > pòster de vídeo). Mai un logo com a protagonista.
  // Fase 8 — direcció d'art: 3 variants estructurals reutilitzables, sempre amb els mateixos marges, tipografia,
  // paleta i microinteraccions. `heroVariant` només té efecte quan hi ha `shown` (visual real); sense visual,
  // sigui quin sigui el valor, cau sempre a `--text` (variant D del briefing: tipogràfica, sense fotografia).
  const projectHero = (p, { base, number }) => {
    const shown = p.image ?? p.video?.poster ?? null;
    const ratio = coverRatio(p);
    const videoOnly = !p.image && p.video;
    const variant = shown && HERO_VARIANTS.includes(p.heroVariant) ? p.heroVariant : shown ? 'stacked' : 'text';
    const play = videoOnly ? '<span class="project-cover__play" aria-hidden="true"></span>' : '';

    const head = `<div class="project-hero__head">
        <p class="project-hero__num" aria-hidden="true">${pad(number)}</p>
        ${filled(p.context) ? `<p class="project-hero__category">${esc(p.context)}</p>` : ''}
      </div>`;
    const title = `<h1 class="project-hero__title">${esc(p.title)}${videoOnly ? '<span class="sr-only"> (inclou vídeo)</span>' : ''}</h1>`;
    const lead = filled(p.description) ? `<p class="project-hero__lead">${esc(p.description)}</p>` : '';
    const meta = projectMeta(p, ['role', 'format', 'year', 'entity', 'funding']);

    if (variant === 'immersive') {
      // Visual a sang de fons (tot el hero), degradat + text clar a sobre: la composició més «atrevida» reservada
      // a un projecte amb molta energia audiovisual (p. ex. FeminismeZ). Mateix degradat que project-next__tint.
      return `<header class="project-hero project-hero--immersive" data-cursor-theme="media">
    <figure class="project-hero__bg"${ratio ? ` style="--ratio:${esc(ratio)}"` : ''}>
      ${imgTag(shown, base, { cls: 'project-hero__img', mode: 'high', sizes: '100vw' })}
      ${play}
      <span class="project-hero__tint" aria-hidden="true"></span>
    </figure>
    <div class="container project-hero__inner" data-reveal>
      ${head}
      ${title}
      ${lead}
      ${meta}
    </div>
  </header>`;
    }

    if (variant === 'split') {
      // Text i visual costat a costat (≥900px): to editorial, la fotografia acompanya sense dominar.
      return `<header class="project-hero project-hero--split">
    <div class="container project-hero__inner" data-reveal>
      <div class="project-hero__col">
        ${head}
        ${title}
        ${lead}
        ${meta}
      </div>
      <figure class="project-hero__visual" data-cursor-theme="media">
        <span class="project-hero__frame"${ratio ? ` style="--ratio:${esc(ratio)}"` : ''}>
          ${imgTag(shown, base, { cls: 'project-hero__img', mode: 'high', sizes: '(min-width: 900px) 46rem, 100vw' })}
          ${play}
        </span>
      </figure>
    </div>
  </header>`;
    }

    // 'stacked' (per defecte, Fase 5) i 'text' (sense visual): mateixa estructura, `--text` només ajusta tipografia.
    const visual = shown
      ? `<figure class="project-hero__visual" data-cursor-theme="media">
        <span class="project-hero__frame"${ratio ? ` style="--ratio:${esc(ratio)}"` : ''}>
          ${imgTag(shown, base, { cls: 'project-hero__img', mode: 'high', sizes: '(min-width: 900px) 62rem, 100vw' })}
          ${play}
        </span>
      </figure>`
      : '';
    return `<header class="project-hero${variant === 'text' ? ' project-hero--text' : ''}">
    <div class="container project-hero__inner" data-reveal>
      ${head}
      ${title}
      ${lead}
      ${meta}
    </div>
    ${visual}
  </header>`;
  };

  // 02 — CONTEXT. Titular curt + 1-2 paràgrafs breus, amplada de lectura controlada. Sense contextBody no hi ha
  // secció (un titular sol no s'hi mostra). TODO: text provisional a partir de docs/CONTENT.md; validar amb l'Anaïs.
  const projectContext = (p) => {
    if (!Array.isArray(p.contextBody) || !p.contextBody.length) return '';
    return `<section class="project-context" aria-labelledby="project-context-title">
    <div class="container project-context__inner" data-reveal>
      <h2 class="project-detail__subtitle project-section__label" id="project-context-title">Context</h2>
      <div class="project-section__body">
        <!-- TODO: text provisional; validar la redacció amb l'Anaïs. -->
        ${filled(p.contextHeadline) ? `<p class="project-context__headline">${esc(p.contextHeadline)}</p>` : ''}
        <div class="project-context__body">
${p.contextBody.map((paragraph) => `          <p>${esc(paragraph)}</p>`).join('\n')}
        </div>
      </div>
    </div>
  </section>`;
  };

  // 03 — PARTICIPACIÓ DE L'ANAÏS. Què hi va fer concretament, mai deduït pel tipus de projecte: només es mostra
  // si `participation` té contingut verificat. Cap dels 8 projectes en té encara (tots amb `role: null`).
  const projectParticipation = (p) => {
    if (!filled(p.participation)) return '';
    return `<section class="project-participation" aria-labelledby="project-participation-title">
    <div class="container project-participation__inner" data-reveal>
      <h2 class="project-participation__lead" id="project-participation-title">Què hi va fer l'Anaïs</h2>
      <p class="project-participation__text">${esc(p.participation)}</p>
    </div>
  </section>`;
  };

  // 03b — SELECCIÓ DE VÍDEOS (Fase 7). Nomès per a projectes amb vídeos propis verificats (`p.videos`), com el
  // conjunt d'episodis de FeminismeZ. Reutilitza el mateix embed «lite» (pòster + Play explícit) que Material,
  // però en una llista pròpia perquè quedi clar que és el projecte en si, no un «material relacionat».
  const projectVideos = (p, base) => {
    if (!p.videos.length) return '';
    return `<section class="project-videos" aria-labelledby="project-videos-title">
    <div class="container">
      <h2 class="project-detail__subtitle" id="project-videos-title">Selecció de vídeos</h2>
      <ul class="project-videos__list">
${p.videos
  .map(
    (v) => `        <li class="project-videos__item" data-reveal>
          ${videoEmbed(v, base, 'project-videos__video')}
          <p class="project-videos__caption">${filled(v.episode) ? `<span class="project-videos__episode">${esc(v.episode)}</span> ` : ''}${esc(v.title)}${filled(v.duration) ? `<span class="project-videos__duration">${esc(v.duration)}</span>` : ''}</p>
        </li>`,
  )
  .join('\n')}
      </ul>
    </div>
  </section>`;
  };

  // 03c — ARXIU D'ARTICLES (Fase 7). Peces publicades en un altre mitjà amb autoria d'Anaïs verificada a la font
  // (`p.articles`): arxiu editorial agrupat per any (si n'hi ha de diversos), mai una graella de cards genèriques.
  // Sense imatge (política de drets: mai es reutilitzen fotografies de tercers sense confirmar-ne l'ús): la
  // tipografia, la data i la numeració fan tot el treball visual.
  // Numeració pròpia de l'arxiu (01, 02…), independent del número de la fitxa: només al tractament «editorial»
  // per defecte (La Directa). El tractament «cultural» (Teatre Barcelona, `articlesVariant`) no en porta —
  // menys tècnic, més a prop d'un programa de mà— i italitza el titular (el nom de l'obra/peça).
  const articleItem = (a, { index, cultural }) => `        <li class="project-articles__item" data-reveal>
          ${!cultural ? `<p class="project-articles__num" aria-hidden="true">${pad(index)}</p>` : ''}
          <div class="project-articles__body">
            <p class="project-articles__meta">${filled(a.category) ? `${esc(a.category)} · ` : ''}${esc(formatDate(a.date))}</p>
            <h3 class="project-articles__title">${esc(a.title)}</h3>
            ${filled(a.excerpt) ? `<p class="project-articles__excerpt">${esc(a.excerpt)}</p>` : ''}
            <a class="link-arrow project-articles__link" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">Llegir a ${esc(a.publication)}<span class="sr-only"> (s'obre en una pestanya nova)</span> ${ARROW}</a>
          </div>
        </li>`;

  const projectArticles = (p) => {
    if (!p.articles.length) return '';
    const cultural = p.articlesVariant === 'cultural';
    const byYear = new Map();
    for (const a of [...p.articles].sort((x, y) => (x.date < y.date ? 1 : -1))) {
      const year = a.date.slice(0, 4);
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year).push(a);
    }
    const groups = [...byYear.entries()];
    let index = 0;
    return `<section class="project-articles-section${cultural ? ' project-articles-section--cultural' : ''}" aria-labelledby="project-articles-title">
    <div class="container">
      <h2 class="project-detail__subtitle" id="project-articles-title">Articles</h2>
${groups
  .map(
    ([year, items]) => `      <div class="project-articles__group">
${groups.length > 1 ? `        <p class="project-articles__year" aria-hidden="true">${esc(year)}</p>\n` : ''}        <ul class="project-articles${cultural ? ' project-articles--cultural' : ''}">
${items.map((a) => articleItem(a, { index: ++index, cultural })).join('\n')}
        </ul>
      </div>`,
  )
  .join('\n')}
    </div>
  </section>`;
  };

  // 04 — MATERIAL / RESULTAT. Vídeo principal (si n'hi ha) + galeria adaptativa. Cap patró fix: la composició es
  // decideix pel nombre real d'assets (gallerySpan), no per una maquetació impossible de reutilitzar.
  // 1 → a sang; 2 → 50/50; 3 → gran + dues petites; 4+ → seqüència modular (mateix cicle de 3, es repeteix).
  const gallerySpan = (i, total) => {
    if (total === 1) return { col: 12, row: 1 };
    if (total === 2) return { col: 6, row: 1 };
    const cycle = [
      { col: 7, row: 2 },
      { col: 5, row: 1 },
      { col: 5, row: 1 },
    ];
    return cycle[i % cycle.length];
  };

  const galleryItem = (m, base, span) => {
    const style = `--ratio:${m.width}/${m.height};--gallery-col:${span.col};--gallery-row:${span.row}`;
    return m.type === 'video'
      ? `<li class="project-gallery__item project-gallery__item--video" style="${style}" data-reveal>${videoEmbed(m, base, 'project-gallery__video')}</li>`
      : `<li class="project-gallery__item" style="${style}" data-reveal><figure class="project-gallery__fig" data-cursor-theme="media">${imgTag(m, base, { cls: 'project-gallery__img' })}</figure></li>`;
  };

  const projectMaterial = (p, base) => {
    const hasVideo = Boolean(p.video);
    const hasGallery = p.gallery.length > 0;
    if (!hasVideo && !hasGallery) return '';
    return `<section class="project-material" aria-labelledby="project-material-title">
    <div class="container">
      <h2 class="sr-only" id="project-material-title">Material</h2>
      ${
        hasVideo
          ? `<div class="project-material__video">${videoEmbed(p.video, base, 'project-material__video-frame')}</div>`
          : ''
      }
      ${
        hasGallery
          ? `<ul class="project-gallery">
${p.gallery.map((m, i) => galleryItem(m, base, gallerySpan(i, p.gallery.length))).join('\n')}
      </ul>`
          : ''
      }
    </div>
  </section>`;
  };

  // 04b — BECA / FINANÇAMENT (Fase 7). Explica la relació amb precisió (projecte beneficiari, mai «treballa per»):
  // només si hi ha `fundingNote` real a més de `funding` (evita repetir la mateixa fila que ja surt al Hero).
  const projectFunding = (p) => {
    if (!p.funding.length || !filled(p.fundingNote)) return '';
    return `<section class="project-funding" aria-labelledby="project-funding-title">
    <div class="container project-funding__inner" data-reveal>
      <h2 class="project-detail__subtitle project-section__label" id="project-funding-title">${esc(p.funding.map((f) => f.name).join(' / '))}</h2>
      <p class="project-funding__text project-section__body">${esc(p.fundingNote)}</p>
    </div>
  </section>`;
  };

  // 05 — ENLLAÇOS RELACIONATS. Un verb per tipus real (Llegir / Escoltar / Veure...), mai «Veure» per defecte.
  // Marcador purament decoratiu de tipus «àudio» (mai una forma d'ona real ni un reproductor fingit — Fase 8,
  // briefing exprés: «no generis formes d'ona inventades associades a una peça concreta»). Barres estàtiques,
  // iguals a tot arreu, com el ▶ de vídeo: indiquen el TIPUS d'enllaç, no representen cap àudio en concret.
  const AUDIO_ICON = `<svg class="audio-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="1" y="5" width="2" height="4" rx="1" fill="currentColor"/><rect x="6" y="2" width="2" height="10" rx="1" fill="currentColor"/><rect x="11" y="6" width="2" height="2" rx="1" fill="currentColor"/></svg>`;

  const projectLinks = (p) => {
    if (!p.links.length && !filled(p.externalUrl)) return '';
    return `<section class="project-links-section" aria-labelledby="project-links-title">
    <div class="container">
      <h2 class="project-detail__subtitle" id="project-links-title">Escoltar / veure / llegir</h2>
      ${
        p.links.length
          ? `<ul class="project-links">
${p.links
  .map(
    (l) =>
      `        <li class="project-links__item"><a class="project-links__link" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer"><span class="project-links__action">${l.type === 'audio' ? AUDIO_ICON : ''}${esc(LINK_ACTIONS[l.type])}</span><span class="project-links__label">${esc(l.label)}</span><span class="sr-only"> (s'obre en una pestanya nova)</span> ${ARROW}</a></li>`,
  )
  .join('\n')}
      </ul>`
          : ''
      }
      ${
        filled(p.externalUrl)
          ? `<p class="project-links__external"><a class="link-arrow" href="${esc(p.externalUrl)}" target="_blank" rel="noopener noreferrer">Visitar projecte<span class="sr-only"> (s'obre en una pestanya nova)</span> ${ARROW}</a></p>`
          : ''
      }
    </div>
  </section>`;
  };

  // 06 — SEGÜENT PROJECTE. Obligatori: mai footer immediat. Calculat per `order` (docs/PROJECTS-DATA.md), mai
  // hardcodejat; només necessita la portada del projecte següent (sense galeria ni vídeo: pes mínim).
  const projectNext = (list, current, { base }) => {
    const next = nextProject(list, current);
    if (!next) return '';
    const shown = next.image ?? next.video?.poster ?? null;
    const url = esc(href(base, next));
    const number = pad(listProjects(list).indexOf(next) + 1);
    return `<section class="project-next" aria-labelledby="project-next-title">
    <a class="project-next__link${shown ? '' : ' project-next__link--text'}" href="${url}">
      ${
        shown
          ? `<span class="project-next__visual" data-cursor-theme="media">${imgTag(shown, base, { cls: 'project-next__img' })}<span class="project-next__tint" aria-hidden="true"></span></span>`
          : ''
      }
      <span class="container project-next__inner">
        <span class="project-next__label" id="project-next-title">Següent projecte</span>
        <span class="project-next__num" aria-hidden="true">${number}</span>
        <span class="project-next__title">${esc(next.title)} ${ARROW}</span>
        ${filled(next.context) || filled(next.format) ? `<span class="project-next__category">${esc(next.context || next.format)}</span>` : ''}
      </span>
    </a>
  </section>`;
  };

  const projectDetail = (p, { base = '/', list = [p] } = {}) => {
    const number = listProjects(list).indexOf(p) + 1;
    return `<article class="project-detail" data-project="${esc(p.id)}">
  <div class="container project-detail__top">
    <p class="project-detail__back"><a class="link-arrow" href="${esc(publicUrl(base, '/projectes/'))}">Tots els projectes</a></p>
  </div>
  ${projectHero(p, { base, number: number > 0 ? number : 1 })}
  ${projectContext(p)}
  ${projectParticipation(p)}
  ${projectVideos(p, base)}
  ${projectArticles(p)}
  ${projectMaterial(p, base)}
  ${projectFunding(p)}
  ${projectLinks(p)}
  ${projectNext(list, p, { base })}
</article>`;
  };

  // Omple el motlle projectes/_projecte.html. Els marcadors {{project.*}} no són <!-- @slot --> perquè aquests
  // els resol dataSlots() i, en build, el motlle es processa una sola vegada abans de generar cada fitxa.
  const fillProjectTemplate = (html, p, { base = '/', list = [p] } = {}) =>
    html
      .replaceAll('{{project.title}}', () => esc(p.title))
      .replaceAll('{{project.description}}', () => esc(p.description))
      .replaceAll('{{project.content}}', () => projectDetail(p, { base, list }));

  return { projectMeta, projectMedia, projectCard, featuredProject: featuredBlock, projectsPage, projectDetail, fillProjectTemplate };
}
