# Linton Merch brand guidelines

This file is the rulebook for colour, type and logo on the Linton Merch site. If a design choice is not covered here, keep it inside these rules rather than adding something new. `src/index.css` holds the values; `src/brand.test.ts` fails the build if a colour outside this palette is written into the code.

Agreed 21 October 2026: fewer colours. Navy and white carry the site, one blue accent does the work, teal appears only as thread.

## Colour

### The palette

| Role | Name | Hex | Code token | Job |
| --- | --- | --- | --- | --- |
| Main | **Navy** | `#0B2A5B` | `ink` (`bg-ink`, `text-ink`) | Header, footer, hero and dark bands; all body text and headings |
| Main | **White** | `#FFFFFF` | `white`, `background` | Page background, cards, text on navy |
| Accent | **Linton Blue** | `#004298` | `brand-blue`, `primary` | Things you press: main buttons, active states, note rules, one feature band (Put your logo on it) |
| Secondary accent (rare) | **Linton Teal** | `#029B97` | `brand-teal` | Thread only: dashed stitch lines, the scroll thread, the hero label seams, the logo patch outline |

Blue and teal are taken directly from the logo (`#004098` and `#00A098` measured). Navy is the logo blue darkened, so the whole site sits in one family.

### Neutrals (not brand colours)

These are tints of navy. They separate content; they never carry meaning.

| Name | Hex | Token | Job |
| --- | --- | --- | --- |
| Cloud | `#F3F5F8` | `cloud`, `secondary`, `muted` | Quiet sections, review cards, hover rows, info strips |
| Line | `#D3DAE3` | `line`, `border` | Rules, dividers, field borders |
| Slate | `#4A5873` | `slate`, `muted-foreground` | Supporting text, captions, labels |

Error red `#A32828` is a system state for form errors only.

### Proportion

Roughly **60 white, 30 navy, under 10 blue, about 1 teal**. If a page looks colourful, something is wrong.

### Rules

- **Blue is for action.** If it's blue, you can press it (or it marks the one feature band). Don't use blue for decoration, headings or icons.
- **Never put blue on navy.** They are only 1.5:1 apart. On navy and on the blue band, buttons are **white with navy text**.
- **Teal is thread, never fill.** Teal appears only in dashed lines and stitches. No teal backgrounds, buttons, text or icons.
- **No new colours.** No aqua or light blue, no gradients between brand colours, no tinted greys outside the neutrals above. Photos keep their own colours; that's the product.
- **Dark overlays use navy**, e.g. the fade behind occasion labels: `rgb(11 42 91 / x)`.
- **Focus rings:** navy on light surfaces, white on navy and blue.

### Section rhythm (Home)

Navy hero, white, white (brands), **blue** (Put your logo on it), white (occasions), navy (gift sets), white (popular picks), cloud (ways to brand), white (trust), navy (closing and footer). Never place two blue or two cloud bands next to each other.

### Contrast (WCAG)

| Pair | Ratio | Use |
| --- | --- | --- |
| Navy on white | 14.0 | Body text |
| Navy on cloud | 12.9 | Text in quiet sections |
| White on Linton Blue | 9.4 | Button text, blue band |
| Slate on white | 7.2 | Supporting text |
| Slate on cloud | 6.6 | Supporting text in quiet sections |
| White on navy | 14.0 | Text on dark bands |
| Teal on white | 3.4 | Lines only, never text |

## Typography

Two typefaces, no others.

| Face | Role | Weights | Source |
| --- | --- | --- | --- |
| **Host Grotesk** (variable) | Display: hero, page, section and card titles, large figures | 700 | `@fontsource-variable/host-grotesk` |
| **Satoshi** | Body, UI, buttons, labels, forms | 400, 500, 700 | `src/fonts/` (Fontshare Free Font License) |

Scale (in `src/index.css`):

| Style | Class | Size | Notes |
| --- | --- | --- | --- |
| Hero | `.hero-title` | up to 4.6rem | Uppercase, the only uppercase headline |
| Page title | `.page-title` | 2.5 to 4.75rem | Sentence case |
| Section title | `.section-title` | 2 to 3.4rem | Sentence case, tight tracking (-0.04em) |
| Body | default | 16px, line height 1.5 to 1.75 | Never below 16px for paragraphs on phones |
| Label | `.eyebrow` | 12px, 600, uppercase, 0.14em tracking | Short labels above a section title only |

Headings are navy (white on dark bands). No coloured words inside headlines and no italics for emphasis.

## Logo

| File | Use |
| --- | --- |
| `public/brand/linton-logo-white.png` | All-white logo: on navy (header, footer) and on the blue band |
| `public/brand/linton-merch-logo-colour.webp` | Full-colour logo (blue and teal mark, grey tagline): on white or cloud only |

- **Clear space:** keep at least the height of the "L" mark's stroke (about a quarter of the logo height) clear on every side.
- **Minimum size:** 36px tall on screen (the header uses 36 to 48px); the tagline must stay legible.
- **Don't** recolour, stretch, outline, add shadows, put the colour logo on navy or blue, or put either logo on a photo without a solid navy panel behind it.
- The tagline "Corporate Clothing, Gifts & Uniforms" is part of the logo; don't retype it beside the logo.

## Updating this guide

Change the palette here first, then in `:root` in `src/index.css` and in the allowed list in `src/brand.test.ts`. Keep `docs/design-tokens.json` in step.
