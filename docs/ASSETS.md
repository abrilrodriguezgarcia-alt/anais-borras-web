# ASSETS — Origen i drets dels assets externs

Registre dels assets que NO són creats per Anaïs ni per aquest projecte. Tots estan guardats en local (sense hotlinks permanents).

Estat de drets: **cap fotografia externa té els drets verificats.** Abans de la publicació definitiva cal demanar/verificar permís d'ús (o substituir-les per material propi).

## Projectes destacats (Home)

Composició de cada targeta: fotografia (`public/images/projects/`) + overlay CSS + logotip superposat. Estils a `src/styles/components/projects.css`, dades a `src/data/projects.json`.

### FeminismeZ

| Tipus | Font | URL original | Fitxer local | Estat drets |
|---|---|---|---|---|
| Logo | Asset propi del projecte (ja existent) | — | `public/images/logo feminisme z/Logo_FZ_Transparent_negre (2).png` | Marca pròpia d'Anaïs. Es retalla els marges transparents amb CSS; no s'ha duplicat ni modificat el fitxer. |
| Fotografia | Sessió fotogràfica d'Anaïs (material propi) | — | `public/images/projects/feminismez.webp` (retall 4:3 de `public/images/anais/IMG_6979.jpg`) | Material propi. |

Nota: s'ha descartat el thumbnail d'episodi (prioritat 1 de l'encàrrec) perquè són escenes fosques amb el logotip i el títol ja impresos; el logo real és negre i no hi tindria contrast.

### La Directa

| Tipus | Font | URL original | Fitxer local | Estat drets |
|---|---|---|---|---|
| Logo | directa.cat (SVG inline de la capçalera del web oficial, sense l'indicador "live") | https://directa.cat/ | `public/images/logos/la-directa.svg` (vermell oficial `#BF2C22`) i `public/images/logos/la-directa-blanc.svg` (variant monocroma blanca, la que s'utilitza) | Logo corporatiu / ús identificatiu |
| Fotografia | Article d'Anaïs a La Directa «Ser queer té molt a veure amb abraçar la monstruositat» (Samantha Hudson; mateixa imatge que a Articles destacats) | https://directa.cat/app/uploads/2026/05/Samantha_Hudson_arxiu_02-1024x683.jpg | `public/images/projects/la-directa.webp` (retall 4:3) | TODO: verificar drets d'ús abans de publicació definitiva |

### RAC1

| Tipus | Font | URL original | Fitxer local | Estat drets |
|---|---|---|---|---|
| Logo | rac1.cat (SVG inline del peu del web oficial). Identitat estàndard negre + vermell; NO és el logo commemoratiu dels 25 anys | https://www.rac1.cat/ | `public/images/logos/rac1.svg` | Logo corporatiu / ús identificatiu |
| Fotografia | rac1.cat, secció «La primera pedra» — peça «Marta Vilamajó, organitzadora professional…» (estudi de RAC1 amb micròfons RAC) | Imatge: https://www.rac1.cat/files/fp/uploads/2026/04/08/69d605529875a.r_d.655-208-3164.jpeg · Peça: https://www.rac1.cat/llar/20260407/336568/marta-vilamajo-organitzadora-professional-carmanyola-solta-sense-tapa-utilitzar-colocar-tapes-vertical-vista-primerapedra.html | `public/images/projects/rac1.webp` (retall 4:3) | TODO: verificar drets d'ús abans de publicació definitiva. No hi apareix Anaïs (no s'ha trobat cap foto seva a rac1.cat). |

### Teatre Barcelona

| Tipus | Font | URL original | Fitxer local | Estat drets |
|---|---|---|---|---|
| Logo | teatrebarcelona.com (SVG inline `#tb-site-logo` de la capçalera/peu del web oficial; el JPG `logo-tb-quadrat.jpg` és opac i s'ha descartat) | https://www.teatrebarcelona.com/ | `public/images/logos/teatre-barcelona.svg` (colors oficials) i `public/images/logos/teatre-barcelona-blanc.svg` (variant monocroma blanca, la que s'utilitza) | Logo corporatiu / ús identificatiu |
| Fotografia | Article «El teatre com a eina de transformació social», imatge «Fantàstic Ramon» | Imatge: https://www.teatrebarcelona.com/wp-content/uploads/2024/06/TEATRE-BARCELONA-Fantastic-Ramon-5.jpg · Article: https://www.teatrebarcelona.com/revista/el-teatre-com-a-eina-de-transformacio-social | `public/images/projects/teatre-barcelona.webp` (retall 4:3) | TODO: verificar drets d'ús abans de publicació definitiva |

## Variants monocromes dels logos

`la-directa-blanc.svg` i `teatre-barcelona-blanc.svg` són el mateix vector oficial amb `fill` blanc, perquè els logos oficials només existeixen en colors foscos/vermell i les fotografies són fosques. Validar amb cada marca que aquest ús és acceptable.

## Pendents (fora d'aquesta secció)

- Les imatges de `src/data/articles.json` (La Directa) i els thumbnails de `src/data/videos.json` (YouTube) continuen en hotlink. TODO: descarregar-les en local i documentar-les aquí.
