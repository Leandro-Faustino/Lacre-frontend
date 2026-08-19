# Lacre — Interface Design System

## Intent

**Who:** Finance or operations clerk at a Brazilian transport company. Morning, desk, anxiety about which invoices are at risk today before billing runs.

**What they must do:** Identify canhotos at risk → send driver reminders → confirm/seal proofs → track financial exposure. Fast triage, then action.

**Feel:** Document-serious. A well-run freight office: official, stamped, trustworthy — not cold. The physical canhoto receipt (stub + perforation + note body) is the governing metaphor.

---

## Palette

Primitives from the product's world — carbonless receipt paper and Brazilian fiscal document ink:

```css
/* Brand / structural */
--indigo-950: #100e3d   /* deepest header, modal backdrop tint */
--indigo-900: #14124a
--indigo-800: #1b1859
--indigo-700: #221f6b   /* primary actions, active states, accent */
--indigo-600: #3b37a8   /* hover actions, eyebrow text */
--indigo-500: #5752be
--indigo-400: #7a76d6   /* focus rings */
--indigo-100: #e6e5f7   /* light tints, icon backgrounds, badges */
--indigo-50:  #f3f2fb   /* hover surfaces, active nav backgrounds */

/* Paper / document */
--paper: #f5f1e8        /* document preview background — parchment */

/* Neutrals */
--graphite-950: #111318
--graphite-900: #16181c  /* primary text */
--graphite-700: #333840  /* secondary text */
--graphite-600: #4f5661  /* body / supporting text */
--graphite-500: #69717e  /* metadata, captions */
--graphite-400: #9299a3  /* muted / disabled */
--line:         #dfe3e8  /* borders */
--surface:      #f4f5f7  /* app background */
--white:        #fff

/* Semantic */
--green:        #237a57  /* sealed / verified — notary stamp green */
--green-bg:     #e7f4ed
--amber:        #a25c16  /* pending / urgency — road warning amber */
--amber-bg:     #fff2df
--red:          #a13a38  /* atenção / risk */
--red-bg:       #fce9e8
```

**Why indigo:** The deep blue of official Brazilian fiscal documents and stamps. Not a generic SaaS blue — it reads as authoritative, government-adjacent, which fits a legal document workflow.

**Why parchment:** The physical canhoto is printed on cream carbonless paper. The paper preview must feel like the real object.

---

## Typography

```
Font stack: Aptos, "Segoe UI", Inter, Arial, sans-serif  (system — operational density)
Document headings: Georgia, serif  (signals "this is a document", not an app)
Monospace: "Courier New", monospace  (protocol codes, hash, field labels on paper)
```

**Levels:**
- Page title (h1): Georgia, `clamp(25px, 2.1vw, 34px)`, weight 500, tracking `-.025em`
- Section title (h2): Georgia, `18px`, weight 500
- Paper document title (h3): Georgia, `20px`, weight 500
- Body: `14px` (base)
- Labels / table cells: `10–11px`, weight 650
- Eyebrows / section labels: `8–9px`, weight 700–800, tracking `0.11–0.13em`, uppercase
- Captions / metadata: `6–9px`

**Why Georgia for headings:** The canhoto is a legal document. Georgia signals "this is a record", not a dashboard widget.

---

## Depth Strategy: Borders + Subtle Shadow

Single approach, no mixing:

- Standard border: `1px solid var(--line)` — `#dfe3e8`
- Soft separation (table rows): `1px solid #edf0f2`
- Document context (paper details): `1px solid #d8d2c7` and `1px solid #ded8ce`
- Card shadow: `0 3px 10px rgba(20, 18, 74, .035)` — barely visible, just lifts cards off surface
- Emphasis (paper stack): `0 3px 12px rgba(30, 31, 38, .15)`
- Modal: `0 24px 70px rgba(16, 14, 61, .28)`
- Header: `box-shadow: 0 2px 5px rgba(18, 21, 25, .04)` on ribbon

**Elevation scale:**
- L0 `--surface: #f4f5f7` — app background
- L1 `white` — sidebar, tab bar, ribbon, cards, modal
- L2 `var(--indigo-50)` `#f3f2fb` — hover/active states on white surfaces
- L3 `var(--paper)` `#f5f1e8` — paper document (distinct world, not elevation)
- Preview bg `#eceef1` — document viewer surround (slightly darker than surface)

**Why borders-first with minimal shadow:** Finance tools need clean structure. Heavy shadows read as decorative. These are legal records — the interface should feel precise.

---

## Spacing

Base unit: `4px`. Scale: 4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 22 / 24 / 30 / 42.

Common patterns:
- Component padding (cards, ribbon buttons): `17px` vertical, `14–18px` horizontal
- Section gap: `22–30px`
- Inline gap (icon + label): `6–10px`
- Table row padding: `10px 14px` (comfortable), `6px 14px` (compact mode)

---

## Border Radius Scale

- Inputs, buttons: `5px`
- Badges, status chips: `4–6px` (pills at `11px`)
- Cards, panels: `8px`
- Modals: `10px`
- Avatars, icon containers: `6–7px` (square), `50%` (round)
- Paper preview: `3px` (minimal — documents have sharp corners)

---

## Navigation Architecture: Word Ribbon Pattern

Three-tier header system unique to this product:

1. **Word bar** (48px) — brand lockup, document name, global search, user actions. Dark indigo gradient `linear-gradient(90deg, var(--indigo-950), var(--indigo-700))`.
2. **Tab bar** (36px) — module tabs (Arquivo, Início, Canhotos, Cobrança, etc.). White, border-bottom, active tab gets indigo underline.
3. **Ribbon** (88px) — contextual command groups (CRIAR / LOCALIZAR / AGIR / EXIBIR). White, grouped by function with `<small>` group labels.

**Sidebar:** Same white background as main content — separated by `1px solid var(--line)` only. No sidebar-world vs content-world split.

---

## Signature Elements

### 1. LacreMark
The product logotype — a minimal canhoto glyph:
```
[stub][····][     note body     ]
```
Stub (7px wide, rounded left), perforation dots (5 circles), note body (bordered rectangle). Appears in header and on paper document. Can only exist for Lacre.

### 2. Paper Document Preview
The right panel simulates a physical canhoto on `--paper` parchment with `Georgia` typography, `"Courier New"` field labels, dashed proof-photo area, SHA-256 hash footer. Not a detail panel — it IS the document.

### 3. Priority Line
A full-width amber call-to-action row that floats between summary cards and the proof list — surfaces the highest-risk items before the user can scroll past them.

---

## Status Badges

```
.status.lacrada  → green-bg / green  (sealed, verified)
.status.pendente → amber-bg / amber  (waiting)
.status.atencao  → red-bg / red      (deadline exceeded)
```

Pill shape (`border-radius: 11px`), `8px` text, inline icon for "lacrada" (checkmark).

---

## Key Component Patterns

### Metric Cards
Three-up grid. Primary card (Exposição) gets `border-top: 3px solid var(--indigo-600)` accent — signals "this is the number that matters". Icon containers: 28×28px, `border-radius: 6px`, colored bg.

### Proof Table
Two-row text inside each cell (strong + small). Column grid: `minmax(180px, 1.6fr) minmax(130px, 1.05fr) 80px 100px 85px 24px`. Selected row: `background: var(--indigo-50)` + `box-shadow: inset 3px 0 var(--indigo-600)` left accent.

### Modal
White, `border-radius: 10px`, enter animation `translateY(10px) scale(.98)` → rest in `0.18s`. Backdrop: indigo-tinted `rgba(16, 14, 61, .48)` + `blur(3px)`.

### Toast
Bottom-right, white card, green check icon circle, border `#c8dfd3`, enter from bottom `0.22s`.

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| ≤1280px | Narrow sidebar (210px), narrow preview (300px) |
| ≤1080px | Icon-only sidebar (74px), labels hidden |
| ≤820px | Mobile: drawer sidebar, preview stacks below content |
| ≤620px | Single-column summary, compact ribbon, stacked modal actions |

---

## Avoid in This Project

- Sidebar with different background color from main content
- More than one accent color (indigo is the only brand color)
- Shadows heavier than `0 3px 10px rgba(20, 18, 74, .035)` on cards
- Spring/bounce animations
- Rounding > 10px on any component (documents have sharp corners)
- Gradients used decoratively (only the header gradient is intentional)
- Random hex values — every color must trace to a primitive above
