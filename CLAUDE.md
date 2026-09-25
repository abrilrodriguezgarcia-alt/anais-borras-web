# CLAUDE.md — Anaïs Borràs Web

Aquest és el document mestre de context per a qualsevol agent o sessió de Claude que treballi en aquest repositori.

## 1. Objectiu

Construir la web personal i professional d’**Anaïs Borràs**, periodista, comunicadora i creadora de contingut.

La web ha d’unificar una trajectòria distribuïda entre periodisme escrit, ràdio, pòdcast/videopòdcast, creació digital, cultura i moderació d’actes.

### Posicionament de treball

**Anaïs Borràs — periodista, comunicadora i creadora de contingut.**

**Filosofia, actualitat i cultura per mirar una mica més enllà del titular.**

La filosofia és el fil conductor de la seva mirada, no necessàriament un servei o secció independent.

## 2. Principi de marca

La web NO ha de semblar:
- una web d’influencer genèrica,
- una plantilla SaaS,
- una web corporativa institucional,
- un agregador de links,
- una web activista brutalista genèrica.

Ha de semblar:
- una revista cultural contemporània,
- un portfolio periodístic,
- una casa digital personal,
- una experiència editorial amb recursos digitals actuals.

Paraules clau:
**rigor · proximitat · pensament · cultura · actualitat · feminismes · periodisme · català · contemporaneïtat**

## 3. Direcció visual TANCADA

### Tipografia
- Display/editorial: **Newsreader**
- Sans/UI: **Inter**

### Paleta
- `#111111` — negre tinta
- `#F4F1EB` — cru editorial
- `#A79CEF` — lavanda principal
- `#7255FF` — violeta intens
- `#F31372` — fúcsia accent
- `#6B6966` — gris secundari

La web NO és “una web violeta”.
Base visual: **cru + negre**.
Lavanda = identitat.
Violeta = interacció.
Fúcsia = accent molt puntual.

## 4. HERO DE LA HOME — DIRECCIÓ APROVADA / NO REDISSENYAR

El hero visual aprovat és el que combina:
- capçalera molt neta,
- logotip tipogràfic “ANAÏS BORRÀS” a dalt a l’esquerra,
- navegació: Sobre mi · Projectes · Articles · Contacte,
- xarxes socials a la dreta,
- gran composició partida entre text i fotografia,
- fotografia d’Anaïs amb fons lavanda,
- eyebrow en Inter violeta,
- “ANAÏS BORRÀS” en Newsreader molt gran,
- claim editorial a sota,
- CTA lavanda,
- petites categories al lateral,
- franja inferior amb mitjans/projectes.

**No reinterpretar ni substituir aquesta direcció sense petició explícita.**

### Foto hero
La fotografia aprovada és la foto vertical d’Anaïs estirada sobre fons lavanda aportada al projecte durant la fase de disseny. Quan s’afegeixi al repositori, guardar preferentment com:
`public/images/anais-hero.jpg`

No generar una cara nova ni substituir-la per stock.

## 5. Continuació aprovada de Home

Després del hero:
1. Franja “He col·laborat amb”
2. **Projectes destacats**
3. **Articles destacats**
4. **FeminismeZ / vídeos destacats**
5. **Instagram / A la xarxa**
6. **Sobre mi**
7. **Parlem? / Contacte**
8. Footer

La composició ha de mantenir la mateixa retícula editorial, aire, línies fines, Newsreader + Inter i paleta definida.

## 6. Arquitectura multipàgina

La web no serà una landing única.

- `/` — Home
- `/sobre-mi`
- `/projectes`
- `/articles`
- `/contacte`

Premsa/reconeixements es poden integrar a Sobre mi o Home en la primera versió.

## 7. Contingut extern

### Instagram
Mostrar una selecció curada de 3–6 posts/reels.
No convertir la Home en un feed infinit.

### FeminismeZ / YouTube
Incrustar 2–3 vídeos destacats a Home.
A Projectes, donar-li més espai.
Prioritzar privacitat: youtube-nocookie o lazy/consent embed.

### La Directa
No copiar ni incrustar articles complets.
Mostrar targetes editorials pròpies amb:
- titular,
- categoria,
- data,
- extracte curt,
- imatge quan sigui legal/adequat,
- CTA “Llegir a La Directa”.

## 8. Projectes i trajectòria

Prioritat de representació:
1. FeminismeZ
2. La Directa
3. RAC1 — Ens ho prenem amb Filosofia
4. Teatre Barcelona
5. Seny i Ràbia
6. Pantube
7. Onada Feminista
8. Presentació / moderació / entrevistes
9. Instagram / TikTok

Reconeixement:
**2024 — Premi AMIC-Tresdeu a millor creadora de contingut de conscienciació social.**

## 9. Contingut i to

Idioma principal de la web: **català**, tret que més endavant es decideixi afegir idiomes.

To:
- clar,
- intel·ligent,
- directe,
- humà,
- editorial,
- no acadèmic,
- no grandiloqüent,
- sense copy de màrqueting buit.

No inventar:
- biografia,
- càrrecs,
- dates,
- clients,
- premis,
- xifres,
- cites textuals,
- URLs de posts,
- articles o vídeos.

Quan falti material real, usar placeholders identificats com a tals.

## 10. Implementació

El stack encara NO està decidit.

Abans de crear dependències o framework:
1. revisar la documentació de `docs/`,
2. proposar l’stack,
3. mantenir la web lleugera i fàcil d’allotjar,
4. prioritzar accessibilitat, SEO, rendiment i responsive.

No sacrificar la composició editorial per comoditat del framework.

## 11. Qualitat

La implementació final ha de tenir:
- responsive real,
- navegació per teclat,
- focus visible,
- contrast correcte,
- semàntica HTML,
- lazy loading d’imatges/embeds,
- imatges optimitzades,
- metadata SEO,
- Open Graph,
- dades estructurades quan pertoqui,
- gestió de cookies només si realment hi ha serveis que les requereixen.

Consulta també:
- `docs/HOME.md`
- `docs/DESIGN-SYSTEM.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT.md`
- `docs/INTEGRATIONS.md`
