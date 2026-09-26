# ASSETS — Origen i drets dels assets externs

Registre dels assets que NO són creats per Anaïs ni per aquest projecte. Tots estan guardats en local (sense hotlinks permanents).

Estat de drets: **cap fotografia externa té els drets verificats per a publicació**, excepte les de Wikimedia Commons amb llicència lliure (vegeu cada fila: CC0 / CC BY 2.0 amb atribució). Es mantenen TEMPORALMENT durant el desenvolupament, però **no estan aprovades per a publicació**. Abans de publicar cal demanar/verificar permís d'ús (o substituir-les per material propi). Cap d'aquestes imatges es pot considerar d'ús comercial lliure.

## Projectes destacats (Home)

Sistema comú a les quatre targetes (referència: Teatre Barcelona): fotografia a sang 4:3 (`object-fit: cover`) + overlay CSS subtil + logotip blanc/oficial a baix a l'esquerra (24px de marge). Les tres fotografies noves (FeminismeZ, La Directa, RAC1) tenen un tractament lleu i homogeni aplicat en exportar (saturació ≈ −12/−28 %, contrast +6/8 %), sense filtres CSS. La fotografia de Teatre Barcelona no s'ha retocat. Les rutes es prefixen amb el `base` de Vite (`scripts/render.js` → `publicUrl`). Estils a `src/styles/components/projects.css`, dades a `src/data/projects.json`.

### FeminismeZ

| Tipus | Font | URL original | Fitxer local | Estat drets |
|---|---|---|---|---|
| Logo | Asset propi del projecte (ja existent) | — | `public/images/logo feminisme z/Logo_FZ_blanc.png` (derivat de `Logo_FZ_Transparent_negre (2).png`) | Marca pròpia d'Anaïs. Variant blanca: mateix canal alfa de l'original, només canvia el color (negre → blanc) i s'han retallat els marges transparents (caixa opaca x 256–1599, y 265–837). Geometria idèntica. L'original es conserva. |
| Fotografia | Wikimedia Commons — «El Caster Studio tv.jpg», autor: Elcasterstudio (obra pròpia, 2023). Plató de videopòdcast genèric (NO és el plató de FeminismeZ). | https://commons.wikimedia.org/wiki/File:El_Caster_Studio_tv.jpg | `public/images/projects/feminismez.webp` (retall 4:3 centrat en la càmera i la taula, sense les pantalles amb la marca de l'estudi) | Llicència **CC0** (domini públic segons Commons; no cal atribució). **TODO — substituir abans de publicació** per una fotografia real del plató de FeminismeZ (sense convidades protagonistes ni grafismes), idealment de l'equip audiovisual de La Directa. |

Descartades: la fotografia anterior (Anaïs retallada sobre lavanda, `IMG_6979.jpg`); els thumbnails d'episodi (porten títols i grafismes); la foto del plató amb Samantha Hudson (ja apareix a Articles destacats).

### La Directa

| Tipus | Font | URL original | Fitxer local | Estat drets |
|---|---|---|---|---|
| Logo | directa.cat (SVG inline de la capçalera del web oficial, sense l'indicador "live") | https://directa.cat/ | `public/images/logos/la-directa.svg` (vermell oficial `#BF2C22`) i `public/images/logos/la-directa-blanc.svg` (variant monocroma blanca, la que s'utilitza) | Logo corporatiu / ús identificatiu |
| Fotografia | Web de la cooperativa de La Directa (cooperativa.directa.cat, portada): redacció de La Directa vista des de dalt, amb un exemplar de la revista a la taula. Autoria no indicada a la pàgina. | https://cooperativa.directa.cat/wp-content/uploads/2024/02/MG_4584.jpg | `public/images/projects/la-directa.webp` (retall 4:3) | **TODO — substituir o verificar drets abans de publicació.** Cal demanar permís a La Directa (i crèdit del/de la fotògraf/a). Ús temporal en desenvolupament; no aprovada. |

Substitueix la fotografia de Samantha Hudson (https://directa.cat/app/uploads/2026/05/Samantha_Hudson_arxiu_02-1024x683.jpg), que continua a Articles destacats.

### RAC1

| Tipus | Font | URL original | Fitxer local | Estat drets |
|---|---|---|---|---|
| Logo | rac1.cat (SVG inline del peu del web oficial). Identitat estàndard negre + vermell; NO és el logo commemoratiu dels 25 anys | https://www.rac1.cat/ | `public/images/logos/rac1.svg` (colors corporatius originals) | Logo corporatiu / ús identificatiu |
| Fotografia | Wikimedia Commons — «MINORIA ABSOLUTA I LA SEGONA HORA - RAC1 - 30 JUNY 09 (3675546914).jpg», autor: Miquel C. from Sant Boi, Catalunya (Flickr). Estudi de RAC1 buit: micròfons de l'emissora, taula i cadires, sense persones. | https://commons.wikimedia.org/wiki/File:MINORIA_ABSOLUTA_I_LA_SEGONA_HORA_-_RAC1_-_30_JUNY_09_(3675546914).jpg | `public/images/projects/rac1.webp` (retall 4:3 dels micròfons; s'han deixat fora les pantalles de TV amb persones) | Llicència **CC BY 2.0** (https://creativecommons.org/licenses/by/2.0/). Permet l'ús amb **atribució obligatòria**. **TODO — afegir el crèdit** («Foto: Miquel C., CC BY 2.0») en algun lloc visible (p. ex. peu de pàgina o pàgina de crèdits) abans de publicació. Foto de 2009. |

Fotografia retirada anteriorment (2026-09-26): «La primera pedra» (https://www.rac1.cat/files/fp/uploads/2026/04/08/69d605529875a.r_d.655-208-3164.jpeg), perquè hi apareixien dues persones que no són Anaïs.

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
