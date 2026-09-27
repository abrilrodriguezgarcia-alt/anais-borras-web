// Model de dades de Projectes: vocabulari, validació, selectors i porta de drets d'imatge.
// La font de dades és src/data/projects.json (vegeu docs/PROJECTS-DATA.md). Aquest mòdul no importa cap altre script
// perquè vite.config.js el carrega amb cache-busting; les plantilles HTML són a projects-render.js.
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Categories internes per a futurs filtres. NO són etiquetes personals de l'Anaïs (només Filòsofa i periodista).
export const CATEGORIES = {
  periodisme: 'Periodisme',
  audiovisual: 'Audiovisual',
  converses: 'Converses',
  moderacio: 'Moderació',
  cultura: 'Cultura',
  altres: 'Altres',
};

// Pes visual dins de la futura retícula (Fase 4).
export const SIZES = ['large', 'wide', 'medium', 'vertical', 'small'];

// Proporció de la portada, sempre com a "amplada/alçada" (mateix format que CSS aspect-ratio). Si és null es
// fa servir la proporció real de la imatge. Només se n'admeten aquests valors perquè no n'hi hagi de "solts".
export const RATIOS = ['1/1', '4/5', '3/4', '2/3', '4/3', '3/2', '16/9', '21/9'];

export const STATUSES = ['published', 'draft'];
export const MEDIA_TYPES = ['image', 'screenshot', 'frame', 'video'];
export const LINK_TYPES = {
  article: 'Article',
  audio: 'Àudio',
  video: 'Vídeo',
  program: 'Programa',
  interview: 'Entrevista',
  event: 'Acte',
  other: 'Enllaç',
};
export const OVERLAYS = ['editorial', 'soft', 'none'];

// Direcció d'art de la fitxa individual (Fase 8): variacions purament visuals, mai informació nova.
// HERO_VARIANTS — null (per defecte) és la composició apilada (Fase 5): text a sobre, visual a sota; sense visual
// cau sempre a `.project-hero--text`, sigui quin sigui `heroVariant`. «immersive» (visual de fons, títol a sobre,
// pensat per a un projecte amb molta energia audiovisual) i «split» (text i visual costat a costat, més editorial
// i contingut) només tenen efecte quan el projecte té una imatge real visible.
export const HERO_VARIANTS = ['immersive', 'split'];
// ARTICLES_VARIANTS — «cultural» (Teatre Barcelona): sense numeració, titulars en cursiva (com un programa de mà),
// més aire. null és el tractament per defecte, numerat i més dens (La Directa: arxiu periodístic).
export const ARTICLES_VARIANTS = ['cultural'];

// CTA per tipus d'enllaç relacionat (Fase 5): el verb depèn del que hi ha a l'altra banda, no sempre «Veure».
export const LINK_ACTIONS = {
  article: 'Llegir article',
  audio: 'Escoltar peça',
  video: 'Veure vídeo',
  program: 'Veure programa',
  interview: 'Veure entrevista',
  event: 'Veure acte',
  other: 'Visitar enllaç',
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isText = (v) => typeof v === 'string' && v.trim() !== '';
const isUrl = (v) => typeof v === 'string' && /^https:\/\/\S+$/.test(v);
const isIsoDate = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const isPosInt = (v) => Number.isInteger(v) && v > 0;
const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const nullableText = (v) => v === null || isText(v);

// ---------------------------------------------------------------- validació

// Retorna { errors, warnings }. `publicDir` és la carpeta public/ (per comprovar que els fitxers existeixen).
export function validateProjects(list, { publicDir } = {}) {
  const errors = [];
  const warnings = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);

  if (!Array.isArray(list)) return { errors: ['projects.json ha de ser un array'], warnings };

  const fileExists = (src) => !publicDir || existsSync(resolve(publicDir, `.${src}`));

  const checkImage = (img, where) => {
    if (!isObject(img)) return err(where, 'falta la imatge');
    if (!isText(img.src) || !img.src.startsWith('/')) err(where, 'src ha de començar per «/» (ruta dins de public/)');
    else if (!fileExists(img.src)) err(where, `no existeix public${img.src}`);
    if (!isPosInt(img.width) || !isPosInt(img.height)) err(where, 'width i height han de ser enters positius (evita CLS)');
    if (!isText(img.alt)) err(where, 'alt és obligatori');
    if (img.original !== undefined && !nullableText(img.original)) err(where, 'original ha de ser text o null');
    // variants: mateixes imatges a altres amplades (srcset). src és la que es fa servir com a fallback.
    if (img.variants !== undefined) {
      if (!Array.isArray(img.variants) || img.variants.length < 2) err(where, 'variants ha de tenir almenys 2 elements {src, width}');
      else
        img.variants.forEach((v, k) => {
          if (!isText(v?.src) || !v.src.startsWith('/') || !fileExists(v.src)) err(`${where}.variants[${k}]`, 'src ha de ser una ruta existent dins de public/');
          if (!isPosInt(v?.width)) err(`${where}.variants[${k}]`, 'width ha de ser un enter positiu');
        });
    }
  };

  const checkMedia = (m, where, { cover = false } = {}) => {
    if (!isObject(m)) return err(where, 'ha de ser un objecte');
    if (!MEDIA_TYPES.includes(m.type)) err(where, `type ha de ser ${MEDIA_TYPES.join(' | ')}`);
    if (typeof m.rightsConfirmed !== 'boolean') err(where, 'rightsConfirmed és obligatori (true | false)');
    if (m.type === 'video') {
      if (cover) err(where, 'la portada no pot ser un vídeo (usa el camp video)');
      if (m.provider !== 'youtube') err(where, 'provider només pot ser «youtube»');
      if (!isText(m.videoId)) err(where, 'videoId és obligatori');
      if (!isText(m.title)) err(where, 'title és obligatori');
      checkImage(m.poster, `${where}.poster`);
    } else {
      checkImage(m, where);
    }
  };

  const ids = new Set();
  const slugs = new Set();
  const orders = new Set();

  list.forEach((p, i) => {
    const where = `projects[${i}]${isText(p?.id) ? ` (${p.id})` : ''}`;
    if (!isObject(p)) return err(where, 'ha de ser un objecte');

    if (!isText(p.id) || !SLUG.test(p.id)) err(where, 'id ha de ser kebab-case');
    else if (ids.has(p.id)) err(where, 'id duplicat');
    ids.add(p.id);

    if (!isText(p.slug) || !SLUG.test(p.slug) || p.slug.length > 40) err(where, 'slug ha de ser curt, sense accents ni majúscules ni espais (a-z, 0-9, guions)');
    else if (slugs.has(p.slug)) err(where, 'slug duplicat');
    slugs.add(p.slug);

    if (!Number.isInteger(p.order)) err(where, 'order ha de ser un enter');
    else if (orders.has(p.order)) err(where, 'order duplicat');
    orders.add(p.order);

    if (!STATUSES.includes(p.status)) err(where, `status ha de ser ${STATUSES.join(' | ')}`);
    if (typeof p.featured !== 'boolean') err(where, 'featured ha de ser true | false');
    if (!isText(p.title)) err(where, 'title és obligatori');
    if (!isText(p.description)) err(where, 'description és obligatori');

    for (const key of ['entity', 'context', 'role', 'format', 'contextHeadline', 'participation', 'fundingNote']) {
      if (!nullableText(p[key])) err(where, `${key} ha de ser text o null (mai una cadena buida)`);
    }
    if (!(p.year === null || Number.isInteger(p.year) || isText(p.year))) err(where, 'year ha de ser null, un any o un text (p. ex. «2023–2025»)');

    // Fitxa individual (Fase 5): cos de la secció Context — un titular curt (contextHeadline) i 1-2 paràgrafs
    // breus (contextBody). Sense contextBody no hi ha secció Context (un titular sol no s'hi mostra).
    if (!(p.contextBody === null || p.contextBody === undefined || (Array.isArray(p.contextBody) && p.contextBody.length >= 1 && p.contextBody.length <= 2 && p.contextBody.every(isText))))
      err(where, 'contextBody ha de ser null o un array d\'1 a 2 paràgrafs de text');

    // Direcció d'art (Fase 8): purament visual, mai una dada factual.
    if (!(p.heroVariant === null || p.heroVariant === undefined || HERO_VARIANTS.includes(p.heroVariant)))
      err(where, `heroVariant ha de ser null o ${HERO_VARIANTS.join(' | ')}`);
    if (!(p.articlesVariant === null || p.articlesVariant === undefined || ARTICLES_VARIANTS.includes(p.articlesVariant)))
      err(where, `articlesVariant ha de ser null o ${ARTICLES_VARIANTS.join(' | ')}`);

    if (!Array.isArray(p.categories) || p.categories.length === 0) err(where, 'categories ha de tenir almenys una categoria');
    else for (const c of p.categories) if (!(c in CATEGORIES)) err(where, `categoria desconeguda «${c}» (${Object.keys(CATEGORIES).join(', ')})`);

    if (!SIZES.includes(p.size)) err(where, `size ha de ser ${SIZES.join(' | ')}`);
    if (!(p.ratio === null || RATIOS.includes(p.ratio))) err(where, `ratio ha de ser null o ${RATIOS.join(' | ')}`);

    if (p.image !== null) checkMedia(p.image, `${where}.image`, { cover: true });
    if (!Array.isArray(p.gallery)) err(where, 'gallery ha de ser un array (pot ser buit)');
    else p.gallery.forEach((m, j) => checkMedia(m, `${where}.gallery[${j}]`));
    if (p.video !== null) {
      checkMedia(p.video, `${where}.video`);
      if (isObject(p.video) && p.video.type !== 'video') err(`${where}.video`, 'type ha de ser «video»');
    }

    if (!Array.isArray(p.links)) err(where, 'links ha de ser un array (pot ser buit)');
    else
      p.links.forEach((l, j) => {
        if (!isText(l?.label)) err(`${where}.links[${j}]`, 'label és obligatori');
        if (!isUrl(l?.url)) err(`${where}.links[${j}]`, 'url ha de començar per https://');
        if (!(l?.type in LINK_TYPES)) err(`${where}.links[${j}]`, `type ha de ser ${Object.keys(LINK_TYPES).join(' | ')}`);
      });
    if (!(p.externalUrl === null || isUrl(p.externalUrl))) err(where, 'externalUrl ha de ser null o una URL https://');

    if (!Array.isArray(p.funding)) err(where, 'funding ha de ser un array (pot ser buit)');
    else
      p.funding.forEach((f, j) => {
        if (!isText(f?.name) || !isText(f?.organization)) err(`${where}.funding[${j}]`, 'name i organization són obligatoris');
        if (!(f?.year === null || Number.isInteger(f?.year))) err(`${where}.funding[${j}]`, 'year ha de ser null o un any');
      });

    // Arxiu editorial (Fase 7): peces publicades en un altre mitjà (La Directa, revista de Teatre Barcelona…)
    // amb autoria d'Anaïs verificada a la font. `image` es manté null tret que hi hagi drets clars: no es
    // reutilitzen fotografies de tercers automàticament (docs/ASSETS.md).
    if (!Array.isArray(p.articles)) err(where, 'articles ha de ser un array (pot ser buit)');
    else
      p.articles.forEach((a, j) => {
        const aw = `${where}.articles[${j}]`;
        if (!isText(a?.title)) err(aw, 'title és obligatori');
        if (!isText(a?.publication)) err(aw, 'publication és obligatori (nom del mitjà)');
        if (!isUrl(a?.url)) err(aw, 'url ha de començar per https://');
        if (!isIsoDate(a?.date)) err(aw, 'date ha de ser una data «AAAA-MM-DD» verificada a la font');
        if (!(a?.category === null || a?.category === undefined || isText(a.category))) err(aw, 'category ha de ser text o null');
        if (!(a?.excerpt === null || a?.excerpt === undefined || isText(a.excerpt))) err(aw, 'excerpt ha de ser text o null');
        if (a?.image !== null && a?.image !== undefined) checkImage(a.image, `${aw}.image`);
      });

    // Selecció de vídeos (Fase 7): igual que `video`/`gallery`, cada peça necessita un pòster local amb
    // `rightsConfirmed` (aquí: fotograma oficial del propi vídeo de YouTube d'Anaïs, no material de tercers).
    if (!Array.isArray(p.videos)) err(where, 'videos ha de ser un array (pot ser buit)');
    else
      p.videos.forEach((v, j) => {
        const vw = `${where}.videos[${j}]`;
        if (!isText(v?.title)) err(vw, 'title és obligatori');
        if (!isText(v?.videoId)) err(vw, 'videoId és obligatori');
        if (!(v?.episode === null || v?.episode === undefined || isText(v.episode))) err(vw, 'episode ha de ser text o null');
        if (!(v?.duration === null || v?.duration === undefined || isText(v.duration))) err(vw, 'duration ha de ser text o null');
        checkImage(v?.poster, `${vw}.poster`);
      });

    if (!(p.logo === null || (isText(p.logo) && p.logo.startsWith('/') && fileExists(p.logo)))) err(where, 'logo ha de ser null o una ruta existent dins de public/');
    if (p.home !== null) {
      if (!isObject(p.home)) err(where, 'home ha de ser null o un objecte');
      else {
        if (!OVERLAYS.includes(p.home.overlay)) err(`${where}.home`, `overlay ha de ser ${OVERLAYS.join(' | ')}`);
        if (p.home.logoPosition !== 'bottom-left') err(`${where}.home`, 'logoPosition només pot ser «bottom-left»');
        if (!p.logo) err(`${where}.home`, 'les targetes de Home necessiten logo');
        if (p.home.image !== undefined) checkMedia(p.home.image, `${where}.home.image`);
        else if (!p.image) err(`${where}.home`, 'les targetes de Home necessiten image (o home.image)');
      }
    }
  });

  const featured = list.filter((p) => p?.status === 'published' && p?.featured === true);
  if (featured.length > 1) errors.push(`Només pot haver-hi un projecte destacat (featured: true); n'hi ha ${featured.length}: ${featured.map((p) => p.id).join(', ')}`);
  if (featured.length === 0) warnings.push('Cap projecte publicat té featured: true');
  if (list.some((p) => p?.status === 'draft' && p?.featured === true)) errors.push('Un projecte en draft no pot ser el destacat');

  return { errors, warnings };
}

export function assertValidProjects(list, opts) {
  const { errors } = validateProjects(list, opts);
  if (errors.length) throw new Error(`src/data/projects.json no és vàlid:\n - ${errors.join('\n - ')}`);
}

// FASE 4C. La retícula ja mostra tots els projectes publicats (a banda del destacat), sense cap filtre provisional
// (les fases 4A/4B en tenien un, `GRID_PREVIEW_IDS`, mentre s'incorporaven d'un en un).

// Pausa editorial: una sola frase breu entre dos blocs de la retícula, després que el lector ja n'hagi vist uns
// quants (no just després del destacat). S'ancora a un `id` real, no a una posició de l'array, perquè continuï
// funcionant si s'afegeixen o es reordenen projectes: es col·loca després del projecte amb aquest id (si existeix
// i li segueix algun altre projecte) i, si no, simplement no es mostra — la retícula no en depèn per funcionar.
export const PAUSE_AFTER_ID = 'teatre-barcelona';

// ---------------------------------------------------------------- selectors

export const published = (list) => list.filter((p) => p.status === 'published');
export const listProjects = (list) => [...published(list)].sort((a, b) => a.order - b.order);
// El destacat es busca sempre per featured === true, mai per posició.
export const featuredProject = (list) => published(list).find((p) => p.featured === true) ?? null;
export const projectBySlug = (list, slug) => published(list).find((p) => p.slug === slug) ?? null;
export const projectsByCategory = (list, category) => listProjects(list).filter((p) => p.categories.includes(category));
export const projectPath = (p) => `/projectes/${p.slug}/`;

// Següent projecte (Fase 5, fitxa individual): sempre calculat per `order`, mai hardcodejat. Del destacat (01)
// avança normalment; en arribar a l'últim, torna al primer NO destacat (02) — no al destacat, perquè el destacat
// ja no forma part del cicle regular de la retícula (docs/PROJECTS-DATA.md). Si `current` no es troba (no hauria
// de passar: un projecte en draft no genera fitxa), cau al primer no destacat en lloc de trencar la pàgina.
export const nextProject = (list, current) => {
  const ordered = listProjects(list);
  const firstNonFeatured = ordered.find((p) => !p.featured) ?? null;
  const idx = ordered.indexOf(current);
  if (idx === -1) return firstNonFeatured;
  const candidate = ordered[(idx + 1) % ordered.length];
  return candidate.featured ? firstNonFeatured : candidate;
};

// Proporció de la portada: la declarada o, si és null, la real de la imatge (o del pòster del vídeo).
export const coverRatio = (p) => {
  if (p.ratio) return p.ratio;
  const shown = p.image ?? p.video?.poster;
  return shown ? `${shown.width}/${shown.height}` : null;
};

// ---------------------------------------------------------------- Home i Sobre mi (formes heretades)
// render.projects() i render.trajectory() esperen el format antic (image com a text, imageWidth…). Aquests mapejos
// mantenen la seva sortida idèntica sense duplicar dades. Sempre amb les imatges sense filtrar per drets (com abans).

export const homeCards = (list) =>
  listProjects(list)
    .filter((p) => p.home)
    .map((p) => {
      const image = p.home.image ?? p.image;
      return {
        id: p.id,
        name: p.title,
        description: p.description,
        href: projectPath(p),
        image: image.src,
        imageWidth: image.width,
        imageHeight: image.height,
        logo: p.logo,
        logoPosition: p.home.logoPosition,
        overlay: p.home.overlay,
      };
    });

export const trajectoryProjects = (list) =>
  listProjects(list).map((p) => ({
    id: p.id,
    name: p.title,
    href: projectPath(p),
    image: (p.home?.image ?? p.image)?.src,
    imageWidth: (p.home?.image ?? p.image)?.width,
    imageHeight: (p.home?.image ?? p.image)?.height,
  }));

// ---------------------------------------------------------------- drets d'imatge

// Retira de Projectes les imatges amb rightsConfirmed !== true, tret que includePending sigui true.
// vite.config.js l'activa en dev (maquetació local) i en build només amb ALLOW_PENDING_RIGHTS=1.
// Retorna també `excludedFiles`: rutes de public/ (imatge i original local) dels mitjans retirats, perquè la build
// pugui esborrar-les de dist/ si cap pàgina no les fa servir (vegeu vite-project-pages.js).
export function gateRights(list, { includePending = false } = {}) {
  const excluded = [];
  const excludedFiles = new Set();
  const keep = (m, label) => {
    if (includePending || m.rightsConfirmed === true) return true;
    excluded.push(label);
    for (const file of [m.src ?? m.poster.src, m.original]) if (typeof file === 'string' && file.startsWith('/')) excludedFiles.add(file);
    return false;
  };
  const gated = list.map((p) => ({
    ...p,
    image: p.image && keep(p.image, `${p.id}: portada (${p.image.src})`) ? p.image : null,
    gallery: p.gallery.filter((m, i) => keep(m, `${p.id}: galeria[${i}] (${m.src ?? m.poster.src})`)),
    video: p.video && keep(p.video, `${p.id}: vídeo (${p.video.videoId})`) ? p.video : null,
  }));
  return { list: gated, excluded, excludedFiles: [...excludedFiles] };
}

// Tots els mitjans amb drets pendents (independentment de la porta), per a informes.
export function pendingRights(list) {
  const out = [];
  for (const p of list) {
    if (p.image && !p.image.rightsConfirmed) out.push({ id: p.id, where: 'portada', src: p.image.src, note: p.image.rightsNote ?? null });
    p.gallery.forEach((m, i) => {
      if (!m.rightsConfirmed) out.push({ id: p.id, where: `galeria[${i}]`, src: m.src ?? m.poster.src, note: m.rightsNote ?? null });
    });
    if (p.video && !p.video.rightsConfirmed) out.push({ id: p.id, where: 'vídeo', src: p.video.poster.src, note: p.video.rightsNote ?? null });
  }
  return out;
}

// ---------------------------------------------------------------- informació pendent

// Camps que encara no tenim confirmats (null / buits). Ús intern; la interfície mai els mostra.
export function missingFields(p) {
  const missing = [];
  if (p.year === null) missing.push('year');
  if (p.role === null) missing.push('role');
  if (p.format === null) missing.push('format');
  if (!p.image) missing.push('image');
  if (p.links.length === 0 && p.articles.length === 0 && p.videos.length === 0 && !p.externalUrl) missing.push('links');
  p.funding.forEach((f, i) => {
    if (f.year === null) missing.push(`funding[${i}].year`);
  });
  return missing;
}
