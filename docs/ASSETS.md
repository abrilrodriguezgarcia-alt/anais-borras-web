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

Hero: `public/images/anais/IMG_6979.jpg` (Anaïs dempeus sobre fons lavanda; material propi). Versions web (JPG, 800/1200/1600 px d'ample) a `src/assets/images/anais-sobre-mi-*.jpg`. Estils a `src/styles/components/about-page.css`.
