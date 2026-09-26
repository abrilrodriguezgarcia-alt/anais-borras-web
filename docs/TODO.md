# TODO / Roadmap

## Disseny i contingut

- [x] Definir posicionament inicial.
- [x] Definir direcció editorial digital contemporània.
- [x] Definir tipografies: Newsreader + Inter.
- [x] Definir paleta.
- [x] Definir arquitectura base multipàgina.
- [x] Aprovar direcció del hero.
- [x] Aprovar direcció de Projectes destacats.
- [x] Definir continuació conceptual de la Home.

## Assets

- [x] Afegir foto hero real a `public/images/anais-hero.jpg`. (ubicada a `public/images/anais/anais-hero.jpg`; el hero en fa un mirall CSS.)
- [ ] Recollir retrats addicionals.
- [ ] Recollir logos oficials en SVG/PNG.
- [ ] Verificar permisos/drets de fotografies de mitjans.
- [ ] **Verificar drets d’ús de les imatges de La Directa abans de publicació.** Ara mateix les 3 targetes d’Articles destacats carreguen directament les imatges publicades per La Directa (`og:image`) per poder validar el disseny. Decidir: mantenir, demanar autorització, usar asset propi o substituir.
- [ ] Validar el copy provisional de la secció FeminismeZ (menciona «salut mental», que no apareix als 3 episodis triats).
- [ ] Revisar si les miniatures de YouTube (amb gràfica pròpia de FeminismeZ) es mantenen o s’allotgen en local.
- [x] Preparar thumbnails de vídeos. (miniatures oficials de YouTube.)
- [x] Preparar thumbnails/imatges d’Instagram seleccionades. (`public/images/social/instagram-01..06.webp`.)

## Contingut

- [ ] Validar bio amb Anaïs. (El teaser de Sobre mi usa un copy provisional, marcat amb TODO a `index.html`.)
- [ ] Validar claim principal.
- [x] Seleccionar 3–6 articles de La Directa. (3 seleccionats a la Home; falta ampliar per a `/articles`.)
- [x] Seleccionar els 3 articles de Home.
- [x] Seleccionar 2–3 vídeos de FeminismeZ per Home. (E01, E04 i E09.)
- [x] Seleccionar 3–6 posts/reels d’Instagram. (6 posts reals.)
- [ ] Seleccionar peces de RAC1.
- [ ] Confirmar projectes prioritaris.
- [ ] Confirmar email professional.
- [ ] Confirmar textos de contacte.

## UX / Arquitectura

- [ ] Tancar arquitectura definitiva de cada pàgina.
- [ ] Dissenyar Sobre mi.
- [ ] Dissenyar Projectes.
- [ ] Dissenyar Articles.
- [ ] Dissenyar Contacte.
- [ ] Definir estats mobile.
- [ ] Definir navegació mobile.

## Desenvolupament

- [x] Decidir stack. (Vite + HTML/CSS/JS, dades a `src/data/*.json`.)
- [x] Inicialitzar projecte.
- [x] Implementar tokens de disseny.
- [x] Implementar header.
- [x] Implementar hero aprovat.
- [x] Implementar franja de col·laboracions.
- [x] Implementar Projectes destacats.
- [x] Implementar Articles destacats.
- [x] Implementar FeminismeZ.
- [x] Implementar Instagram.
- [x] Implementar Sobre mi teaser.
- [x] Implementar contacte.
- [x] Implementar footer.
- [ ] Crear pàgines internes.
- [x] Responsive de la Home (desktop, portàtil, tauleta i mòbil). Pendent per a les pàgines internes.
- [ ] Accessibilitat. (Home: encapçalaments, alts, focus-visible i navegació per teclat revisats; falta auditoria completa amb eines.)

## Integracions

- [x] Decidir galeria pròpia vs embed d’Instagram. (galeria pròpia: portada local + enllaç al post original, sense SDK de Meta.)
- [x] Implementar YouTube lazy embed / nocookie.
- [x] Configurar links reals de La Directa.
- [ ] Definir integració RAC1.
- [ ] Formulari de contacte.

## SEO / legal / llançament

- [ ] Titles i descriptions.
- [ ] Canonical.
- [ ] Open Graph.
- [ ] Sitemap.
- [ ] robots.txt.
- [ ] Schema.org adequat.
- [ ] Search Console.
- [ ] Analítica, només si es decideix.
- [ ] Avís legal.
- [ ] Privacitat.
- [ ] Cookies si són necessàries.
- [ ] Optimització WebP/AVIF.
- [ ] Lighthouse.
- [ ] QA navegadors.
- [ ] QA mobile.

## Pendents de la Home (fase final)

- [ ] Validar amb Anaïs els copys provisionals: intro «A la xarxa», bio de Sobre mi, anotació «idees · converses · persones · possibilitats», text de «Parlem?».
- [ ] Validar els enllaços socials. Estan extrets del seu Linktree (`linktr.ee/anaisborras`): TikTok `@anaisborras`, YouTube `@anaisborras`, Spotify `show/5TABfhIAJVMkbNLWaA2Z6x`. Confirmar quin programa és el show de Spotify (el Linktree en llista dos) i si es vol enllaçar el segon.
- [ ] Substituir el retrat de Sobre mi (ara `IMG_7163.jpg` en blanc i negre, sessió del hero) per un segon retrat definitiu. Alternatives a `public/images/anais/`: `IMG_7272.jpg`, `IMG_7253.jpg` o `IMG_6979.jpg`.
- [ ] Revisar les publicacions d’Instagram triades i, si convé, canviar-les (`src/data/social.json`). Les miniatures són les de 640 px de la graella pública: si es vol més resolució, exportar-les del compte.
- [ ] Decidir si les publicacions d’Instagram s’han d’obrir amb embed oficial després d’interacció; ara enllacen directament al post original.
- [ ] Revisar drets d’ús de les miniatures d’Instagram i de la fotografia de Sobre mi (ús propi de la creadora, però confirmar).
- [ ] Contingut final: «salut mental» al copy de FeminismeZ, seleccions definitives d’articles i vídeos, i email de contacte.
- [ ] Moure fora de `public/` (p. ex. a `assets-src/`) els originals de `public/images/anais/IMG_*.jpg` i `anais-hero.jpg`: acabarien a `dist/` (~55 MB). (La maqueta ja s'ha mogut a `docs/design/home-mockup.jpeg`.)
- [ ] Construir les pàgines `/sobre-mi`, `/projectes`, `/articles`, `/contacte`, `/avis-legal`, `/privacitat` i `/cookies` (els enllaços ja existeixen a la Home).
