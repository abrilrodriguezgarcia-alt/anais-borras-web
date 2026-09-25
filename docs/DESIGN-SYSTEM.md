# Design System

## Direcció

**Editorial digital contemporània**

Punt de trobada entre:
- revista cultural,
- portfolio periodístic,
- identitat personal digital.

La gràfica ha de tenir aire i criteri. No omplir espais per defecte.

---

## Tipografia

### Newsreader
Font display principal.

Usos:
- H1
- H2
- H3 editorials
- titulars d’articles
- cites
- entradetes
- frases de gran format

Pesos orientatius:
- Medium
- SemiBold
- Italic

### Inter
Font funcional.

Usos:
- body
- menú
- botons
- labels
- categories
- dates
- metadades
- UI

Pesos orientatius:
- Regular
- Medium
- SemiBold

### Escala desktop orientativa

| Ús | Font | Mida | Interlineat |
|---|---|---:|---:|
| Hero / H1 | Newsreader | 72–96 px | .90–.98 |
| H2 | Newsreader | 48–64 px | 1 |
| H3 | Newsreader | 30–38 px | 1.1 |
| Body gran | Inter | 20 px | 1.5 |
| Body | Inter | 17–18 px | 1.6 |
| Small | Inter | 14 px | 1.5 |
| Label | Inter Medium | 12–13 px | 1.2 |

Labels:
- uppercase,
- tracking aprox. `0.08em`.

Variables suggerides:

```css
--font-display: "Newsreader", serif;
--font-sans: "Inter", sans-serif;
```

---

## Paleta

| Token | HEX | Funció |
|---|---|---|
| Ink | `#111111` | text, titulars, blocs foscos |
| Paper | `#F4F1EB` | fons principal |
| Lavender | `#A79CEF` | identitat, superfícies, highlights |
| Violet | `#7255FF` | links, hover, interaccions |
| Pink | `#F31372` | accent puntual |
| Muted | `#6B6966` | metadata i text secundari |

Variables:

```css
:root {
  --ink: #111111;
  --paper: #F4F1EB;
  --lavender: #A79CEF;
  --violet: #7255FF;
  --pink: #F31372;
  --muted: #6B6966;
}
```

### Proporció orientativa
- 70% cru
- 20% negre
- 7% lavanda
- 2% violeta
- 1% fúcsia

Aquesta proporció és una guia, no una regla matemàtica.

---

## Recursos visuals

- retícula editorial,
- línies fines,
- numeració de seccions,
- molt espai negatiu,
- imatge gran i protagonista,
- categories petites en Inter,
- composicions asimètriques controlades,
- cites en Newsreader Italic,
- microinteraccions violetes,
- accents fúcsia mínims,
- possible llenguatge de marques manuscrites/anotacions si es manté subtil.

Etiquetes possibles:
`FILOSOFIA` · `ACTUALITAT` · `FEMINISMEZ` · `RAC1` · `ARTICLE` · `VÍDEO` · `PÒDCAST`

---

## Fotografia

Direcció:
- retrat editorial,
- fons lavanda o neutre,
- mirada humana i directa,
- plans en context professional,
- micròfon, lectura, treball, ciutat,
- combinació d’estudi i context documental.

Evitar:
- stock,
- “influencer amb portàtil”,
- fotografia corporativa genèrica,
- retoc excessiu,
- substituir les fotos reals d’Anaïs per generacions IA.

---

## Moviment

Si s’introdueix motion:
- lent,
- editorial,
- funcional,
- sense scroll-jacking,
- sense animacions decoratives constants.

Bones opcions:
- reveal de línies,
- hover tipogràfic,
- canvis subtils de color,
- parallax molt lleuger en fotografia,
- marquee només si aporta informació.

Respectar `prefers-reduced-motion`.

---

## Accessibilitat

- contrast WCAG AA com a mínim,
- no usar només color per comunicar estat,
- focus visible,
- mides llegibles,
- alt text real,
- jerarquia semàntica coherent,
- no usar textos manuscrits com a informació imprescindible.
