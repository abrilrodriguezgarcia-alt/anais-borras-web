# Integracions

## Principi general

**Primer la marca Anaïs Borràs; després les plataformes externes.**

Els serveis externs aporten contingut i credibilitat, però no han de controlar la composició visual ni el rendiment de la web.

---

# Instagram

## Recomanació

No incrustar un feed infinit.

Mostrar una selecció curada de:
**3–6 posts o reels**.

Opcions:

### A. Galeria pròpia — preferida
- thumbnail pròpia o autoritzada,
- tipus de peça,
- breu descripció,
- enllaç al post/reel.

Pros:
- millor control visual,
- millor rendiment,
- menys dependència,
- millor coherència.

### B. Embed oficial puntual
Útil si es vol veure el post natiu.

Usar només en peces concretes, no com a grid complet si afecta el disseny.

## Privacitat
Revisar cookies/requests de Meta abans de decidir l’embed final.

---

# YouTube / FeminismeZ

## Home

Mostrar:
**2–3 vídeos destacats**.

No carregar tres iframes pesats d’entrada si no és necessari.

Implementació recomanada:
- thumbnail,
- play,
- carregar iframe en clic,
- domini `youtube-nocookie.com` quan sigui possible.

## Projectes

Es pot mostrar una selecció més àmplia de FeminismeZ.

## Consentiment

Si una implementació concreta activa cookies o identificadors abans del clic/consentiment, integrar-la amb la gestió de consentiment corresponent.

---

# La Directa

## Decisió

No incrustar/copiar articles complets.

Mostrar la peça dins el disseny propi:

- imatge,
- mitjà,
- categoria,
- data,
- titular,
- extracte breu,
- CTA al lloc original.

CTA:
**Llegir a La Directa →**

## Copyright

No copiar textos complets.
Els excerpts han de ser propis o molt breus.
Les imatges només s’han de reutilitzar si tenim dret o permís.

Si no, usar:
- fotografia pròpia,
- composició tipogràfica,
- o targeta sense imatge.

---

# RAC1

Quan es defineixin les peces:
- enllaç extern,
- possible player només si RAC1 ofereix embed oficial fiable,
- si no, targeta pròpia.

---

# Formulari de contacte

Encara pendent d’stack/hosting.

Criteris:
- anti-spam,
- validació accessible,
- missatge d’èxit/error clar,
- no exposar claus al frontend,
- mínima recollida de dades.

Camps inicials possibles:
- nom,
- email,
- missatge.

---

# Analytics

No incorporar analítica per defecte durant la maqueta.

Quan es decideixi:
1. definir objectiu,
2. escollir eina,
3. revisar cookies/consentiment,
4. documentar-la.

---

# Rendiment

Per embeds:
- lazy load,
- thumbnails,
- dimensions reservades per evitar CLS,
- no carregar SDKs de tercers a totes les pàgines si només es necessiten en una secció.
