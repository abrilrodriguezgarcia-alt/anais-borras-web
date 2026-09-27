# Projectes — font de dades i rutes

Font única: **`src/data/projects.json`** (un array). Home, Sobre mi, `/projectes` i `/projectes/:slug` en deriven.
Afegir un projecte = afegir un objecte a l'array (equivalent a `projects.push({...})`); no cal tocar cap plantilla.

```
npm run check:projects   # valida el JSON i llista el que falta i els drets pendents
```

Una dada desconeguda es deixa a `null` (o `[]`): la interfície no la renderitza mai. Mai «—», «N/A» ni text inventat.

## Camps

| Camp | Valors | Notes |
|---|---|---|
| `id` | kebab-case, estable | Àncora (`#id`) i referència de `trajectory.json`. No canviar. |
| `slug` | `a-z`, `0-9`, guions; ≤ 40 | URL: `/projectes/<slug>/`. Curt, sense accents ni majúscules. |
| `order` | enter únic | Ordre a la pàgina; no depèn de la posició a l'array. |
| `status` | `published` \| `draft` | Un `draft` no surt a cap llistat i el seu slug dona 404. |
| `featured` | `true` \| `false` | Només un projecte publicat pot ser `true`. La interfície el busca per `featured === true`, mai per posició. |
| `title`, `description` | text | Obligatoris. |
| `entity`, `context`, `role`, `format` | text \| `null` | `context`: p. ex. el programa (RAC1 → «Ens ho prenem amb Filosofia»). `role` sense confirmar → `null`. |
| `year` | enter \| text \| `null` | Text per a rangs («2023–2025»). |
| `categories` | ≥ 1 de `periodisme`, `audiovisual`, `converses`, `moderacio`, `cultura`, `altres` | **Internes**, per a futurs filtres. No són etiquetes personals de l'Anaïs. |
| `size` | `large` \| `wide` \| `medium` \| `vertical` \| `small` | Pes a la retícula (Fase 4). Encara no canvia el disseny. |
| `ratio` | `1/1`, `4/5`, `3/4`, `2/3`, `4/3`, `3/2`, `16/9`, `21/9` \| `null` | Proporció de la portada, sempre `amplada/alçada` (com `aspect-ratio`). `null` → la de la imatge. |
| `image` | mitjà \| `null` | Portada. |
| `gallery` | `[mitjà]` | Imatges, captures (`screenshot`), fotogrames (`frame`) i vídeos (`video`). |
| `video` | mitjà `video` \| `null` | Vídeo principal: només pòster fins que es prem Play (`youtube-nocookie`). |
| `links` | `[{ label, url, type }]` | `type`: `article`, `audio`, `video`, `program`, `interview`, `event`, `other`. Per a les peces de RAC1, etc. |
| `externalUrl` | `https://…` \| `null` | Destí extern principal del projecte. |
| `funding` | `[{ name, organization, year }]` | Beques/finançament. `year: null` fins que es confirmi. **No es mostra encara.** |
| `logo`, `home` | ruta \| `null`, objecte \| `null` | Targetes de Home i previsualització de Sobre mi (`home: { overlay, logoPosition }`; `home.image` fixa una imatge petita per a aquests usos perquè canviar la portada gran de Projectes no els alteri). `home: null` → no surt a Home. |

Mitjà (`image`, galeria, `video`):
`{ type, src, width, height, alt, original?, rightsConfirmed, rightsNote?, position? }` — `src` dins de `public/`, `alt` obligatori,
`width`/`height` reals (evita CLS), `original` = fitxer/URL font (intern), `position` = `object-position` opcional,
`variants` = `[{ src, width }]` de la mateixa imatge a altres amplades (genera `srcset`; `src` és el fallback).
Un vídeo porta `{ type: "video", provider: "youtube", videoId, title, poster: { src, width, height, alt }, rightsConfirmed }`.

## FeminismeZ, Beca Propulsió i la Generalitat

FeminismeZ és el projecte; la beca és `funding[0]` = `{ name: "Beca Propulsió", organization: "Generalitat de Catalunya", year: null }`.
La Generalitat és l'entitat que impulsa la beca, no la propietària del projecte (`entity` queda a `null`).
La franja «He col·laborat amb» de la Home (`partners.json`) és independent d'aquesta relació.

## Drets d'imatge

`rightsConfirmed: false` = no publicar. En **dev** es veu tot (maquetació local). En **build** les imatges amb `false` queden
fora de les pàgines de Projectes, i s'esborren de `dist/` (imatge i `original` local) si cap pàgina no les fa servir; la build
n'imprimeix la llista. `ALLOW_PENDING_RIGHTS=1 npm run build` les inclou. Per substituir-la: canviar `src`/`alt`/`width`/`height`
i posar `rightsConfirmed: true`. Home i Sobre mi no passen per aquesta porta.

## Rutes

| URL | Origen |
|---|---|
| `/projectes/` | `projectes/index.html`: hero (HTML estàtic) + slot `projectsPage` = projecte destacat (`featured === true`). La retícula amb la resta arriba a la Fase 4 (`projectCard` ja existeix). |
| `/projectes/<slug>/` | motlle `projectes/_projecte.html`; una pàgina per projecte publicat |
| qualsevol altra ruta | `404.html` (GitHub Pages el serveix per a rutes inexistents; en dev, estat 404) |

En build, `scripts/vite-project-pages.js` genera `dist/projectes/<slug>/index.html` i descarta el motlle. Tots els enllaços
respecten `base` (`/anais-borras-web/` a GitHub Pages).

## Retícula editorial (Fase 4A)

`/projectes/` renderitza, després del destacat, la resta de projectes publicats en una retícula (`.projects-grid`,
`src/styles/components/projects-grid.css`). El sistema interpreta dues dades de cada projecte, sense cap posició
fixa per projecte:

- **`size`** → pes visual, via `grid-column`/`grid-row` sobre un grid de 12 columnes amb `grid-auto-flow: row dense`:
  `large` (8 cols × 2 files), `wide` (12 × 1), `vertical` (5 × 2), `medium` (4 × 1), `small` (3 × 1). El flux `dense`
  omple els buits sol; quan uns pesos no sumen exactament 12, el sobrant esdevé aire («espai de respiració»), no un
  error.
- **`ratio`** → proporció real de la imatge (`--ratio`, ja fet servir pel destacat); mai es força a 16:9.

`ProjectCard` (`projectArticle` a `scripts/projects-render.js`) és el mateix component reutilitzat pel destacat:
número, imatge (o buit → targeta tipogràfica, `.project-card--text`), nom, context/rol/format/any si n'hi ha, descripció
i CTA. Cap dada `null` es renderitza. La numeració continua la del destacat (01) sense tornar-lo a comptar.

**Fase 4C — retícula completa.** Ja no hi ha cap filtre provisional: `projectsPage` rep tots els projectes publicats
i la retícula en mostra els 8 (02–08, després del destacat). `GRID_PREVIEW_IDS` (Fase 4A/4B) s'ha retirat.

**Hover base (Fase 4B, es manté igual):** només amb `@media (hover: hover)` — zoom de la imatge (`scale(1.03)`), capa
lila molt subtil (`.project-cover__tint`, opacitat 0 → 0,08) i petit desplaçament de la fletxa del CTA;
`prefers-reduced-motion` ho desactiva tot. Mateix cursor estrella (tema «media», ja existent a `cursor.js`).

**Pausa editorial (Fase 4C):** `<p class="projects-pause" data-reveal>` entre dos blocs `<ol class="projects-grid">`
dins la mateixa secció `<section class="projects-rest">` (no és un `<li>`, no compta com a projecte ni consumeix
numeració). S'ancora a `model.PAUSE_AFTER_ID` (`scripts/projects.js`, actualment `'teatre-barcelona'`) — no a una
posició de l'array —, i `projectsPage` la insereix després d'aquest id, entre la resta de projectes (`restA`) i els
que el segueixen (`restB`). Si l'id no existeix o és l'últim de la llista, no es mostra cap pausa i la retícula es
renderitza sencera; provat afegint un 9è projecte sintètic i traient l'àncora, sense trencar-se en cap dels dos casos.
Reutilitza el sistema de reveal ja existent (`about-scroll.js` + `.js-reveal [data-reveal]`), no n'introdueix cap de nou.

**Atenció — Teatre Barcelona (04):** la seva fotografia real ja es veu en dev, però té `rightsConfirmed: false`
(docs/ASSETS.md): en producció, `gateRights` la retira i la targeta cau a `.project-card--text` (tipogràfica, sense
foto). No és un error — és la mateixa protecció de drets validada a la Fase 2/3.

**05–08 (Seny i Ràbia, Pantube, Onada Feminista, Presentació i moderació):** cap dels quatre té cap fotografia,
captura ni fotograma disponible (`image: null` des de la Fase 1/2); totes són `size: "small"` i cauen a
`.project-card--text`. `IMG_7811` i `La Directa.JPG` (que la Fase 4C demanava considerar) pertanyen a les galeries
de FeminismeZ i La Directa respectivament (afegides a la Fase 3) — usar-les aquí hauria atribuït una foto d'un
projecte diferent a aquests quatre, així que no s'han fet servir.

## Fase 5 — ProjectDetailPage (2026-09-27)

`projectDetail(p, { base, list })` a `scripts/projects-render.js` compon la fitxa individual amb 6 seccions
independents, cadascuna renderitzada NOMÉS si hi ha informació real (mai un títol o un espai buit):

1. **Hero** (`projectHero`) — sempre present: número, categoria (`context`, si existeix), nom, entradeta
   (`description`), metadades (`role`/`format`/`year`/`entity`/`funding`, cada fila independent) i el visual
   principal (foto real; pòster de vídeo si no hi ha foto; tipogràfic si no hi ha cap dels dos, `.project-hero--text`).
2. **Context** (`projectContext`) — només si `contextBody` té contingut; `contextHeadline` és opcional.
3. **Participació de l'Anaïs** (`projectParticipation`) — només si `participation` té contingut. **Cap dels 8
   projectes en té encara** (cap `role` confirmat): la secció existeix i està provada (fixture), però no es mostra
   enlloc fins que hi hagi dades reals.
4. **Material** (`projectMaterial`) — vídeo principal (`p.video`) + galeria adaptativa (`gallerySpan`, per
   `gallery.length`, no per posició fixa): 1 → a sang (12/12); 2 → 50/50 (6/12); 3 → gran + dues petites (7+5+5,
   2 files); 4+ → el mateix cicle de 3 repetit. Reutilitza el grid dens de `projects-grid.css` amb un altre
   vocabulari (`--gallery-col`/`--gallery-row` per `<li>`, no `data-size`). Únic canvi de fons de tota la fitxa:
   `--paper-deep`, ja existent.
5. **Enllaços relacionats** (`projectLinks`) — verb segons `type` (`LINK_ACTIONS`: Llegir article / Escoltar peça /
   Veure vídeo / Veure programa / Veure entrevista / Veure acte / Visitar enllaç), mai «Veure» per defecte. Si hi ha
   `externalUrl`, un CTA «Visitar projecte» addicional.
6. **Següent projecte** (`projectNext`, obligatori) — calculat amb `model.nextProject(list, current)` per `order`,
   mai hardcodejat: avança amb normalitat i, en arribar a l'últim, torna al primer NO destacat (02), no al destacat.
   Només necessita la portada del projecte següent (sense galeria ni vídeo). Sense imatge, cau a un bloc només
   tipogràfic (`.project-next__link--text`).

**Camps nous a `projects.json`** (opcionals, `null` per defecte): `contextHeadline`, `contextBody` (array d'1-2
paràgrafs), `participation`. Només FeminismeZ té `contextHeadline`/`contextBody` omplerts, redactats a partir de
`docs/CONTENT.md` (temes i format ja documentats des de la Fase 1) — **TODO: validar la redacció amb l'Anaïs**, com
el titular del Hero i la pausa editorial. `participation` és `null` a tots 8: cap rol confirmat encara.

**Projecte pilot: FeminismeZ** (destacat). És l'únic amb prou material real per validar el sistema sencer: portada
pròpia, 3 enllaços de vídeo reals, relació Beca Propulsió/Generalitat de Catalunya ja modelada (`funding`), i
almenys una imatge de galeria (pendent de drets, útil per validar el *fallback* de material). Verificat també amb
un projecte gairebé buit (Pantube: `format`/`year`/`role`/`image` tots `null`) → només es mostren Hero (tipogràfic)
i Següent projecte, sense cap secció ni fila buida.

**Escalabilitat de `nextProject`** verificada amb un 9è projecte sintètic (no escrit a `projects.json`): s'afegeix
sol al final de la seqüència amb el número correcte, i si l'id de l'àncora d'algun mecanisme desapareixiera, res
no trenca la pàgina.

## Fase 4D — QA i refinament (2026-09-27)

**Entrada de cada targeta com una unitat:** `data-reveal` a l'`<li class="projects-grid__item">` (no a l'article ni
a cap element intern): número, imatge, nom, metadades i CTA es mouen junts amb un sol fade + translateY, reutilitzant
`about-scroll.js`/`.js-reveal [data-reveal]` ja existent. Sense JS o amb `prefers-reduced-motion`, `about-scroll.js`
no afegeix `.js-reveal` i el contingut es queda visible d'entrada — no calia CSS nou.

**Ajust de tauleta (768 px):** les 4 targetes `small` (05–08) en una sola fila de 3/12 quedaven massa estretes per
llegir amb aire («Presentació i moderació» a 4 línies). A `@media (max-width: 900px)` (mateix trencament que
header.css/hero.css) passen a 6/12 (2 columnes de 2 files) fins al pas a mòbil (699 px), on ja cauen totes a una
columna. Els pesos grans (vertical/medium) ja tenien prou amplada a 768 px i no s'han tocat.

**Verificat a 375 / 430 / 768 (abans i després de l'ajust) / 1000 / 1280 / 1440 px:** ordre de projectes, crops,
ratios, marges, numeració, titulars, metadades, CTA i pausa editorial — sense solapaments ni overflow horitzontal a
cap amplada (comprovat per mesura, no només visualment).

**Accessibilitat:** ordre de headings correcte (H1 → H2 destacat → H2 sr-only "Altres projectes" → H3 per targeta),
totes les imatges amb `alt`, cap `div` clicable (només `<a>`), ordre de focus per teclat 100% seqüencial per tota la
retícula (02→08), contrast AA verificat (`--muted`/`--violet-text` sobre `--card-bg` i `--paper`, ≥ 4,7:1).

**Rendiment:** lazy loading a totes les imatges de la retícula (el destacat és `eager`, intencional, ja de la Fase 3),
dimensions reservades a totes (CLS = 0 verificat amb un test net, keyboard-only, sense contaminació d'scripts de
prova), cap vídeo encara, cap asset duplicat (comprovat per hash). Pes propi de les imatges de Projectes ≈ 876 KB.

**GitHub Pages / `base`:** build de producció verificada amb un servidor estàtic pla (sense el *fallback* SPA propi
de `vite preview`): les 8 fitxes + el llistat responen com a fitxers reals (200) i una ruta inexistent dona 404 real.
Clic des de Home i refresc directe d'una fitxa, sense errors de consola.

## Validació de la Fase 3 (2026-09-27)

Build de producció (`npm run build` + `vite preview`, i també servint `dist/` amb un servidor estàtic pla per confirmar
el comportament sense el fallback SPA propi de `vite preview`): assets, imatges, CSS, fonts, enllaços interns, clic des
de Home, «enrere» i refresc directe d'una ruta de projecte funcionen correctament amb `base: '/anais-borras-web/'`
(coincideix amb el nom del repositori a GitHub). Un slug inexistent dona 404 real (no cau a la Home); `vite preview` sí
que fa aquest fallback silenciós — és una particularitat pròpia seva, no de GitHub Pages ni de la build.

Revisió visual (no només mesures) del Hero + projecte destacat a 375, 430, 768, 1280 i 1440 px: sense canvis de
breakpoints. La transició cap al footer no deixa cap espai buit (comprovat amb el DOM: gap = 0 a totes les amplades).

## Fase 6 — Contingut real dels 8 projectes (2026-09-27)

Auditoria de `projects.json` projecte per projecte abans de tocar cap component (cap secció nova, cap CSS nou:
la plantilla de la Fase 5 ja gestiona qualsevol combinació de dades). Només s'hi ha afegit informació ja
documentada i verificada a `docs/CONTENT.md`/`docs/ASSETS.md`, mai deduïda:

- **La Directa** — `contextHeadline`/`contextBody` nous, redactats directament a partir dels àmbits ja confirmats
  a `docs/CONTENT.md` («articles, entrevistes, cultura, feminisme, memòria, LGBTIQ+, violències masclistes,
  anàlisi»). **TODO: validar la redacció amb l'Anaïs**, mateix criteri que la resta de text editorial provisional.
  Ja tenia portada amb drets confirmats i 3 articles reals (`links`); ara la fitxa és: Hero → Context → Material
  (galeria amb drets pendents, només en dev) → Enllaços → Següent.
- **Teatre Barcelona** — nou `links[0]` apuntant a l'article real ja documentat a `ASSETS.md`
  («El teatre com a eina de transformació social», teatrebarcelona.com/revista/…). La portada té
  `rightsConfirmed: false` (fotografia de tercers): en producció el Hero cau a `.project-hero--text` (sense
  visual) i no hi ha secció Material (`gallery: []`, `video: null`); la fitxa és Hero (tipogràfic) → Enllaços →
  Següent. No s'hi ha afegit `contextHeadline`: no hi ha cap fet concret sobre el projecte/la col·laboració
  d'Anaïs prou verificat per redactar-lo (només `role`/`entity`/`format` encara `null`).
- **RAC1** — ja tenia `context` («Ens ho prenem amb Filosofia», visible com a categoria al Hero) i portada
  confirmada; no hi ha cap URL d'episodi documentada enlloc del repositori, així que `links` es manté buit. No
  s'hi afegeix cap Context nou (seria repetir la mateixa frase que ja mostra la descripció del Hero): Hero →
  Següent.
- **Seny i Ràbia, Pantube, Onada Feminista, Presentació i moderació** — sense canvis: cap font local documenta
  cap imatge, enllaç o dada addicional. Fitxa mínima (Hero tipogràfic + Següent), tal com demana l'apartat 5 del
  briefing («no emplenis espais amb copy inventat»).

**Verificació de les 8 fitxes** (dev, `npm run check:projects` i build de producció): cap `null`/`undefined`/
`[object` a cap `<main>` generat; jerarquia de capçaleres H1→H2 correcta a cadascuna; les 8 cards de `/projectes`
enllacen al seu `slug` (`document.querySelectorAll('a[href*="/projectes/"]')`, comprovat un per un); cicle
«Següent projecte» complet i correcte (01 destacat → 02 → 03 → … → 08 → torna a 02, no al destacat); sense
overflow horitzontal a 375/768px a les fitxes noves (La Directa, Teatre Barcelona); build de producció retira
`teatre-barcelona.webp` de la fitxa (Hero cau a text) però el manté a `dist/` perquè Home el continua fent
servir (no passa per la porta de drets de Projectes).

## Fase 7 — Contingut real, articles i arxiu editorial (2026-09-27)

Recerca directa a les fonts públiques (mai suposant que un resultat és seu sense confirmar-hi l'autoria) i dues
seccions noves a la fitxa individual, reutilitzables per qualsevol projecte via dades:

- **`articles[]`** (`title`, `publication`, `url`, `date` «AAAA-MM-DD», `category`, `excerpt`, `image` sempre
  `null` — mai es reutilitzen fotografies de tercers sense drets clars) — `projectArticles` a
  `scripts/projects-render.js`: arxiu editorial agrupat per any (només si n'hi ha de diversos), CTA «Llegir a
  {publication}», mai una graella de cards.
- **`videos[]`** (`title`, `episode`, `videoId`, `duration`, `poster` amb `rightsConfirmed`) — `projectVideos`:
  reutilitza el mateix embed «lite» (pòster + Play explícit, `youtube-nocookie.com`) que Material, en una secció
  pròpia «Selecció de vídeos».
- **`fundingNote`** (text o `null`) — `projectFunding`: explica la relació amb precisió (projecte beneficiari,
  mai «treballa per»); només es mostra si hi ha `funding` i `fundingNote` alhora.

**La Directa** — pàgina d'autora real (`directa.cat/persons/anais-borras/`, categoria «Col·laboradors»):
**13 articles** amb autoria d'Anaïs Borràs verificada al peu de cada peça (dos en coautoria: amb Meritxell Rigol
i amb Gemma Garcia), 2024–2026. Es van descartar 5 resultats que apareixien a la mateixa pàgina però eren d'un
altre columnista (Marc August Muntanya) — confirmat obrint-ne un i comprovant la fitxa d'autoria abans d'assumir
que era seu. `links` es buida (les 3 peces que hi havia ja són dins `articles`).

**Teatre Barcelona** — trobada la fitxa de col·laboradora (`teatrebarcelona.com/autor/anais-borras`, «Info: 5
Articles»): **5 articles** reals 2025–2026. D'aquí `role: "Col·laboradora de la revista"` i
`format: "Col·laboracions escrites"` — tots dos citen literalment la categorització «Col·laboradors» de la font,
no una deducció. `context` passa a «Revista de Teatre Barcelona» (paral·lel al `context` de RAC1).
`contextHeadline`/`contextBody` resumeixen els 5 temes reals (patriarcat, cancel·lació, violència intragènere,
teatre polític, teatre social). La portada continua amb `rightsConfirmed: false` (foto de tercers): en producció
el Hero cau a `.project-hero--text`, sense afectar la nova secció d'articles.

**FeminismeZ** — el canal de YouTube d'Anaïs (`youtube.com/@anaisborras/videos`) té 9 episodis de FeminismeZ
(E01–E09), un per cadascun dels 9 temes ja documentats a `docs/CONTENT.md` (abans només en teníem 3 enllaçats).
Pòsters descarregats (miniatura oficial `maxresdefault`, 1280×720) i afegits a `public/images/projects/` amb
`rightsConfirmed: true` (fotograma del propi vídeo). `funding[0].organization` precisat a «Departament de
Política Lingüística — Generalitat de Catalunya» (font: Viquipèdia + govern.cat) i `fundingNote` nou explicant
què són les Beques Propulsió i que FeminismeZ n'és el projecte beneficiari — sense inventar import, any ni
convocatòria concreta (no verificats). `links` es buida (les 3 peces que hi havia ja són dins `videos`).

**RAC1** — trobat un arxiu real d'intervencions (`omny.fm/shows/la-primera-pedra-prenem-filosofia`, el podcast
de La Primera Pedra de RAC1): almenys 14 peces breus d'Anaïs Borràs entre una rotació de col·laboradors, al
llarg de mesos. `participation` i `role: "Col·laboradora habitual"` es basen directament en aquesta evidència
pública i repetida (mai deduïts d'una fotografia). `links` inclou una selecció de 4 peces reals (`type: audio`,
CTA «Escoltar peça») en lloc de les 14 senceres, per no fer la fitxa caòtica; l'estructura final és
Context → Participació → Enllaços, tal com demanava el briefing per a un projecte sense galeria pròpia.

**Resta de projectes** — una entrevista real i verificada (`uoc.edu/ca/news/2025/entrevista-anais-borras-creadora-continguts`,
publicada per la seva pròpia universitat) confirma explícitament que l'Anaïs «és periodista a la Directa» i
«col·labora amb diversos mitjans com RAC1 o Onada Feminista, a més de formar part del col·lectiu Pantube». D'aquí:
`la-directa.role` puja de buit a **"Periodista"**; `onada-feminista.role` passa a **"Col·laboradora"** (cap
article ni peça concreta trobada encara, així que la fitxa es queda només amb Hero + Següent); i **Pantube**
guanya contingut real propi: `format`/`role`/`context` (paràfrasi pròpia, mai citació literal, de la descripció
que el mateix col·lectiu fa de si mateix a `pantube.tv` i a un reportatge de Mèdia.cat), un `externalUrl` a la
seva fitxa oficial al directori (`pantube.tv/anais-borras/`, amb un text de presentació signat per ella mateixa)
i un enllaç real (`links`, tipus vídeo) a la peça que hi va fer per al projecte Al-Himaya de Novact/SUDS/Irídia
sobre la criminalització d'organitzacions palestines (verificat encreuant `novact.org` i `suds.cat`, que
confirmen l'autoria i l'URL exacte de l'Instagram reel). Seny i Ràbia i Presentació i moderació continuen sense
cap font pública trobada més enllà del que ja teníem.

**Verificació**: `npm run check:projects` OK; build de producció sense `null`/`undefined` a cap fitxa; jerarquia
de capçaleres corregida (les 3 seccions noves usaven `<p class="project-detail__subtitle">` en lloc de `<h2>`,
trencant l'ordre H1→H2→H3 — detectat i corregit abans de passar-ho per bo); pòsters de FeminismeZ verificats un
per un a `dist/`; sense overflow a 375px a les fitxes noves.

## Fase 8 — Direcció d'art i poliment visual (2026-09-27)

Sense contingut nou: només composició, jerarquia i ritme. Camps purament visuals (mai una dada factual):
`heroVariant` (`HERO_VARIANTS`: `immersive` | `split`; `null` = apilada, Fase 5) i `articlesVariant`
(`ARTICLES_VARIANTS`: `cultural`; `null` = arxiu numerat). Sense visual real, `heroVariant` no té efecte: sempre
cau a `.project-hero--text`.

- **Hero, 3 variants + la tipogràfica** (`projectHero`): **immersiva** (FeminismeZ) — visual a sang amb degradat
  i text clar a sobre; l'`aspect-ratio` viu al bloc de text, no al contenidor, perquè és un mínim preferit i mai
  talla contingut si les metadades necessiten més alçada. **Costat a costat** (La Directa) — text i visual en
  2 columnes a partir de 900px. **Apilada** (RAC1, per defecte) i **tipogràfica** (Teatre Barcelona en producció
  + els 4 projectes sense fotografia): mateixa d'abans, amb una estrella d'accent nova al número.
- **`image.position` individual**: FeminismeZ (`center 24%`) perquè el retall cinematogràfic de l'`immersive` no
  tallés el rètol de neó ni la cara (briefing §16).
- **Arxiu d'articles, 2 tractaments** (`projectArticles`): **numerat** (La Directa, per defecte) — número gran i
  secundari al costat del titular (§17). **Cultural** (Teatre Barcelona) — sense numeració, titulars en cursiva,
  més aire.
- **Selecció de vídeos**: el primer episodi trenca la graella (span 2 columnes); hover de zoom una mica més
  marcat que el `.video__frame:hover` per defecte (videos.css), amb la seva pròpia guarda de
  `prefers-reduced-motion`.
- **Enllaços d'àudio**: marcador estàtic de 3 barres (`AUDIO_ICON`) abans de «Escoltar peça» — mai una forma
  d'ona real ni un reproductor fingit (briefing §5), només un indicador de tipus, com el ▶ dels vídeos.
- **Nota marginal** (`project-detail__subtitle project-section__label` + `project-section__body`): a partir de
  900px, Context i Beca/finançament passen de «illa» flotant amb tot l'ample sobrant al costat a una etiqueta
  visible en una columna estreta + el text (encara acotat a 42rem per llegibilitat). Substitueix l'`<h2 class="sr-only">`
  de Context per un de visible.
- **Següent projecte**: nova línia de categoria (`context` o, si no n'hi ha, `format` del projecte següent) sota
  el titular.

**Bugs reals detectats i corregits durant la verificació** (no artefactes de captura — confirmats sempre per DOM,
mai només per screenshot, seguint el criteri d'altres fases):
1. La primera versió de l'`immersive` (alçada per `vw` al contenidor) produïa un retall extrem (fins a ~1.96:1)
   que, amb `object-position` per defecte, deixava fora el rètol i la cara de FeminismeZ, mostrant només el fons
   negre de l'estudi. Solucionat lligant l'`aspect-ratio` al bloc de text (mínim preferit, mai un límit dur) i
   afegint `image.position`.
2. Primera versió amb `.project-hero__bg` i `.project-hero__inner` tots dos `position:absolute; inset:0`: el
   contenidor no tenia cap referència d'alçada pròpia i acabava creixent més que la imatge (866px de contingut
   dins d'un fons de 810px), deixant 56px de fons pla sense imatge. Solucionat fent `__inner` de flux normal
   (defineix l'alçada real) i només `__bg` absolut.
3. `.project-articles__num { grid-row: 1 / -1 }` combinat amb auto-placement d'un nombre variable de germans
   produïa un titular d'una sola paraula per línia (encaixat a la columna de 3.5rem del número). Solucionat
   agrupant meta/titular/entradeta/enllaç dins d'un únic `.project-articles__body`, de manera que el grid només
   necessita col·locar 2 elements (número, cos), mai calcular files.

**Verificació**: `npm run check:projects` OK; build de producció sense `null`/`undefined`; les 3 variants de Hero
confirmades a `dist/` (`feminisme-z` → `--immersive`, `la-directa` → `--split`, `teatre-barcelona` → `--text`,
correcte perquè la seva imatge es filtra en producció); sense overflow a 375/834/1440px; jerarquia de capçaleres
H1→H2 correcta; `/projectes` sense canvis (no s'ha tocat `projects-grid.css`/`projects-hero.css`/`projectsPage`).

## Codi

- `scripts/projects.js` — vocabulari, validació, selectors (`listProjects`, `featuredProject`, `projectBySlug`…), porta de drets.
- `scripts/projects-render.js` — `ProjectCard`, `FeaturedProject`, `ProjectMeta`, `ProjectMedia`, `ProjectDetail`, pàgina.
- `scripts/vite-project-pages.js` — rutes `/projectes/:slug` (build i dev) i neteja de fitxers amb drets pendents.
- `src/styles/components/projects-page.css` — estructura **provisional** (Fase 2); el disseny final és a les fases 3–4.
