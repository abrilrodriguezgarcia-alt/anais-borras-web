# ASSETS — Origen i drets dels assets externs

Registre dels assets que NO són creats per Anaïs ni per aquest projecte. Tots estan guardats en local (sense hotlinks permanents).

Estat de drets: **cap fotografia externa té els drets verificats per a publicació**, excepte les de Wikimedia Commons amb llicència lliure (vegeu cada fila: CC0 / CC BY 2.0 amb atribució). Es mantenen TEMPORALMENT durant el desenvolupament, però **no estan aprovades per a publicació**. Abans de publicar cal demanar/verificar permís d'ús (o substituir-les per material propi). Cap d'aquestes imatges es pot considerar d'ús comercial lliure.

## Projectes destacats (Home)

Sistema comú a les quatre targetes (referència: Teatre Barcelona): fotografia a sang 4:3 (`object-fit: cover`) + overlay CSS subtil + logotip blanc/oficial a baix a l'esquerra (24px de marge). Les fotografies de FeminismeZ, La Directa i RAC1 tenen un tractament lleu i homogeni aplicat en exportar (saturació ≈ −12/−28 %, contrast +6/8 %), sense filtres CSS. La fotografia de Teatre Barcelona no s'ha retocat. Les rutes es prefixen amb el `base` de Vite (`scripts/render.js` → `publicUrl`). Estils a `src/styles/components/projects.css`, dades a `src/data/projects.json`.

### FeminismeZ

| Tipus | Font | URL original | Fitxer local | Estat drets |
|---|---|---|---|---|
| Logo | Asset propi del projecte (ja existent) | — | `public/images/logo feminisme z/Logo_FZ_lletres-blanques.png` (derivat de `Logo_FZ_Transparent_negre (2).png`) | Marca pròpia d'Anaïs. Adaptació només de color: les lletres «feminisme» passen de negre a blanc; la Z lila metàl·lica té els píxels idèntics a l'original (verificat) i el canal alfa/geometria no canvia. Retall dels marges transparents (caixa opaca x 256–1599, y 265–837). Amb el logo blanc sobre la moqueta clara, la targeta porta l'overlay editorial subtil. Variants sense ús: `Logo_FZ_negre.png`, `Logo_FZ_blanc.png`. L'original es conserva. |
| Fotografia | Material propi aportat al projecte: Anaïs asseguda al plató de FeminismeZ, sota el rètol de neó, amb micròfons | — | Original: `public/images/imatges/FeminismeZ.HEIC` · Web: `public/images/projects/feminismez.webp` (retall 4:3) | Material propi. |

Descartades: la fotografia anterior (Anaïs retallada sobre lavanda, `IMG_6979.jpg`), el plató buit `IMG_5311.HEIC`; els thumbnails d'episodi (porten títols i grafismes); la foto del plató amb Samantha Hudson (ja apareix a Articles destacats); un plató genèric de Wikimedia Commons (`El_Caster_Studio_tv.jpg`, CC0) que es va fer servir provisionalment.

### La Directa

| Tipus | Font | URL original | Fitxer local | Estat drets |
|---|---|---|---|---|
| Logo | directa.cat (SVG inline de la capçalera del web oficial, sense l'indicador "live") | https://directa.cat/ | `public/images/logos/la-directa.svg` (vermell oficial `#BF2C22`) i `public/images/logos/la-directa-blanc.svg` (variant monocroma blanca, la que s'utilitza) | Logo corporatiu / ús identificatiu |
| Fotografia | Material propi aportat al projecte: Anaïs fent un directe/reportatge per a La Directa en una manifestació (micròfon amb el logo de La Directa) | — | Original: `public/images/imatges/IMG_1140.PNG` · Web: `public/images/projects/la-directa.webp` (retall 4:3 que deixa el micròfon fora de la zona del logo) | Material propi. Confirmar que es pot publicar la imatge de persones al fons (manifestació). |

Fotografies anteriors descartades: la rotativa d'impremta de Wikimedia Commons (`Euzkadi_egunkariaren_errotatiba_-_Orconera_eraikina_-_05.jpg`, CC BY-SA 4.0, massa industrial), la fotografia d'arxiu de la primera redacció (https://directa.cat/app/uploads/2026/04/especial_20_anys_arxiu_00.jpg; no funcionava visualment), Samantha Hudson (https://directa.cat/app/uploads/2026/05/Samantha_Hudson_arxiu_02-1024x683.jpg, continua a Articles destacats) i la redacció actual vista des de dalt (https://cooperativa.directa.cat/wp-content/uploads/2024/02/MG_4584.jpg).

### RAC1

| Tipus | Font | URL original | Fitxer local | Estat drets |
|---|---|---|---|---|
| Logo | rac1.cat (SVG inline del peu del web oficial). Identitat estàndard negre + vermell; NO és el logo commemoratiu dels 25 anys | https://www.rac1.cat/ | `public/images/logos/rac1.svg` (colors corporatius originals) | Logo corporatiu / ús identificatiu |
| Fotografia | Material propi aportat al projecte: Anaïs amb auriculars i micròfon de RAC1 a l'estudi, amb el rètol de RAC1 al fons | — | Original: `public/images/imatges/RAC 1.PNG` · Web: `public/images/projects/rac1.webp` (retall 4:3) | Material propi. Sembla una captura de pantalla (resolució 1021×1816): substituir per l'original si n'hi ha. |

Fotografies RAC1 descartades: estudi buit de Wikimedia Commons (CC BY 2.0, ja no s'utilitza, no cal crèdit) i, abans, la de «La primera pedra»: «La primera pedra» (https://www.rac1.cat/files/fp/uploads/2026/04/08/69d605529875a.r_d.655-208-3164.jpeg), perquè hi apareixien dues persones que no són Anaïs.

### Teatre Barcelona

| Tipus | Font | URL original | Fitxer local | Estat drets |
|---|---|---|---|---|
| Logo | teatrebarcelona.com (SVG inline `#tb-site-logo` de la capçalera/peu del web oficial; el JPG `logo-tb-quadrat.jpg` és opac i s'ha descartat) | https://www.teatrebarcelona.com/ | `public/images/logos/teatre-barcelona.svg` (colors oficials) i `public/images/logos/teatre-barcelona-blanc.svg` (variant monocroma blanca, la que s'utilitza) | Logo corporatiu / ús identificatiu |
| Fotografia | Article «El teatre com a eina de transformació social», imatge «Fantàstic Ramon» | Imatge: https://www.teatrebarcelona.com/wp-content/uploads/2024/06/TEATRE-BARCELONA-Fantastic-Ramon-5.jpg · Article: https://www.teatrebarcelona.com/revista/el-teatre-com-a-eina-de-transformacio-social | `public/images/projects/teatre-barcelona.webp` (retall 4:3) | **TODO — verificar drets d'ús abans de publicació.** Ús temporal en desenvolupament; no aprovada. |

## Variants monocromes dels logos

`la-directa-blanc.svg`, `teatre-barcelona-blanc.svg` i `Logo_FZ_blanc.png` són el mateix vector oficial amb `fill` blanc (geometria verificada idèntica a l'original; només canvia el color). Els originals es conserven al mateix directori, perquè els logos oficials només existeixen en colors foscos/vermell i les fotografies són fosques. Validar amb cada marca que aquest ús és acceptable.

## Maqueta de disseny

La captura de la maqueta aprovada (abans `public/images/WhatsApp Image 2026-09-25 at 15.07.19.jpeg`) és ara a `docs/design/home-mockup.jpeg`. És material de referència intern: no s'utilitza a la web i no s'ha de publicar.

## Pendents (fora d'aquesta secció)

- Les imatges de `src/data/articles.json` (La Directa) i els thumbnails de `src/data/videos.json` (YouTube) continuen en hotlink. TODO: descarregar-les en local i documentar-les aquí.

## Sobre mi (`/sobre-mi`)

Hero: `public/images/anais/IMG_6979.jpg` (Anaïs dempeus sobre fons lavanda; material propi). Versions web (WebP, 800/1200/1600 px d'ample) a `src/assets/images/anais-sobre-mi-*.webp`. Estils a `src/styles/components/about-page.css`.

Seccions "Com treballo": `public/images/anais/IMG_7272.jpg` (Pensar; blanc i negre via CSS, com el retrat de la Home) → `src/assets/images/anais-pensar-{700,1000}.webp`, i `public/images/imatges/IMG_6475.HEIC` (Explicar; Anaïs al plató de FeminismeZ, retall 3:2) → `src/assets/images/anais-explicar-{900,1400}.webp`. Material propi; confirmar amb Anaïs que es pot publicar el plató.

Statement "Escoltar també és una manera de pensar" (`/sobre-mi`): `public/images/imatges/FeminismeZ.HEIC` (Anaïs al plató de FeminismeZ; és la mateixa foto de la targeta de FeminismeZ de la Home, amb un altre retall) → `src/assets/images/anais-escoltar-{1600,2400}.webp` (apaïsat 1,9:1) i `anais-escoltar-v-{800,1200}.webp` (vertical 4:5, mòbil). Material propi.

Trajectòria (`/sobre-mi`): les fotografies del panell són les de `src/data/projects.json` (`/images/projects/*.webp`). Dades a `src/data/trajectory.json`; Seny i Ràbia, Pantube, Onada Feminista i Presentació/moderació no tenen fotografia (bloc tipogràfic) ni pàgina de projecte. Textos a partir de `docs/CONTENT.md`; validar amb Anaïs.

## Franja «He col·laborat amb» — Generalitat de Catalunya

| Element | Origen | URL | Fitxer | Estat de drets |
|---|---|---|---|---|
| Logo | web.gencat.cat (SVG del peu del web oficial: `/content/dam/webgencat/logos/Logo Generalitat de Catalunya.svg`) | https://web.gencat.cat/ca/inici/ | `public/images/logos/generalitat.svg` | Logo institucional. Versió monocroma tinta (`#111111`): l'original és blanc (per a fons vermell); només canvia el color de farciment, la geometria és idèntica. Context: Beca Propulsió (FeminismeZ). Confirmar ús amb la Generalitat si cal seguir el manual d'identitat. |

## Projectes (`/projectes`) — fotografies afegides a la Fase 2

Dades i estat de drets de cada imatge: `src/data/projects.json` (`rightsConfirmed`, `rightsNote`). Informe: `npm run check:projects`.

| Fitxer web | Original | Ús | Estat de drets |
|---|---|---|---|
| `public/images/projects/feminismez-plato-dempeus.webp` (1200×1500, 4:5, tractament lleu: saturació −12 %, contrast +6 %) | `public/images/imatges/IMG_7811.JPG` (4284×5355) | Galeria de FeminismeZ; candidata a comparar amb la portada | **Pendent**: procedència i autoria no documentades. |
| `public/images/projects/la-directa-carrer.webp` (1200×1500, 4:5, saturació −20 %, contrast +6 %) | `public/images/imatges/La Directa.JPG` (2602×3252) | Galeria de La Directa; candidata a comparar amb la portada | **Pendent** (decisió del client): no dependre'n per tancar el disseny. |

Teatre Barcelona (`teatre-barcelona.webp`) també consta com a `rightsConfirmed: false`. La build de producció retira aquestes imatges de
Projectes i esborra de `dist/` les que no fa servir cap altra pàgina. Atenció: la de Teatre Barcelona continua a la Home, que no passa per aquesta porta.

### Portada de FeminismeZ a `/projectes` (Fase 3)

`public/images/projects/feminismez-cover-{1200,1800,2400}.webp` (4:3): retall a tot l'ample (des del rètol fins a les mans, mateix enquadrament que
la targeta de Home) de `public/images/imatges/FeminismeZ.HEIC` (fotografia vertical original, 4284×5712), amb el tractament lleu de la resta
(saturació −12 %, contrast +6 %). Material propi (drets confirmats). Home i Sobre mi continuen fent servir `feminismez.webp` (960×720) via `home.image`.

### Pòsters dels vídeos de FeminismeZ (Fase 7)

`public/images/projects/feminismez-e01-poster.jpg` … `feminismez-e09-poster.jpg` (1280×720, JPG sense processar):
miniatura oficial (`maxresdefault`) de cadascun dels 9 episodis publicats al canal de YouTube d'Anaïs Borràs
(`youtube.com/@anaisborras`), un fotograma del propi vídeo — no material de tercers. `rightsConfirmed: true`.
Dades a `src/data/projects.json` (`feminismez.videos`); vegeu la Fase 7 a `docs/PROJECTS-DATA.md` per a la llista
completa (títol, convidada, durada) i la font (`youtube.com/@anaisborras/videos`).

