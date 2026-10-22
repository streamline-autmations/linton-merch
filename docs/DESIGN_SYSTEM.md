# Design system

The visual thesis (v2, 9 Oct 2026): the client's white-on-ink logo sets a dark ink frame; products and photography are treated as a single duotone (ink to paper); one drawer motion (the quote drawer) is the only signature movement; the manifesto line is the client's own: "Service is our actual business."

## Canonical tokens

**Colour, type and logo rules live in [BRAND_GUIDELINES.md](BRAND_GUIDELINES.md)** (palette reduced 21 Oct 2026). `src/index.css` holds the values and `src/brand.test.ts` fails on any colour outside the palette.

| Role | Name | Value | Token |
| --- | --- | --- | --- |
| Main | Navy | `#0B2A5B` | `ink` |
| Main | White | `#FFFFFF` | `background` |
| Accent | Linton Blue | `#004298` | `brand-blue`, `primary` |
| Secondary accent (thread only) | Linton Teal | `#029B97` | `brand-teal` |
| Neutral | Cloud / Line / Slate | `#F3F5F8` / `#D3DAE3` / `#4A5873` | `cloud` `secondary` `muted` / `border` / `muted-foreground` |

Retired 21 Oct 2026: signal aqua `#2EC4B6`, near-black ink `#0E161D`, ink soft `#1B2833`, paper `#F1F3F2`, grey-green `#E2E7E6`. Older sections below that mention them are history.

Typography: Host Grotesk Variable (display, uppercase only on hero/poster lines) and Satoshi (body, UI; Fontshare Free Font License, files in `src/fonts/`). Radii are small (2-8px); no pill shapes.

Photography (v3, 11 Oct 2026): real product photos sit in full colour on white plates (colour is the product). A card crossfades to a worn / in-use / open-box photo on hover. Lifestyle photos are used full-bleed in the hero and category rows.

Signature motion (v3): **the stitch**. In "Put your logo on it" the visitor's company name stitches itself onto a golf shirt (dashed SVG stroke drawing in), burns into a bottle, or presses onto a tote; an uploaded logo presses in. The artwork can be dragged and resized, and downloaded as a PNG. Hover swaps and the quote drawer are the only other movement.

Legacy duotone: `filter: url(#duotone)` (SVG defined in `index.html`) maps luminance to ink and paper. Product artwork is greyscale on a tonal plate.

Motion: the quote drawer slides in from the right edge and opens once per visit on the first product added. Everything else holds still; reduced motion is respected.

Focus: 2px ink outline on paper; signal outline inside `.on-ink` regions.

## Assets and brand

The `linton merch` text mark and favicon are temporary design treatments. `public/merch-concept.png` is AI-generated generic concept photography. Catalogue vectors are original illustrative placeholders. Do not treat these as genuine stock or company branding. Replace them with approved assets when supplied.


## Motion layer (v4, 11 Oct 2026)

Libraries: GSAP 3.15 (ScrollTrigger, SplitText, `@gsap/react` `useGSAP`) and Lenis 1.3. Shared setup in `src/lib/motion.ts`; global behaviour in `src/components/SmoothScroll.tsx`.

| Element | Behaviour | Where |
| --- | --- | --- |
| Smooth scroll | Lenis on GSAP's ticker, synced to ScrollTrigger. Paused while Radix locks scroll (dialogs, drawer); native inside dialogs and rails; touch stays native | `SmoothScroll.tsx` |
| Scroll thread | 3px dashed teal line along the top edge, scaleX scrubbed to page progress | `.scroll-thread` |
| Stitched seams | `.stitch` dashed rules sew in left-to-right once on entering view (eyebrow dashes and section seams) | `.stitch`, `SmoothScroll.tsx` |
| Header | Sticky; hides on scroll down past 240px, returns on scroll up; exposes `--header-offset` for sticky catalogue filters | `Layout.tsx` |
| Hero intro | Headline lines rise from a mask, photos unroll top-to-bottom (clip-path) while settling from 1.25 scale, copy fades in. Once per load | `useHeroMotion` in `Home.tsx` |
| Hero parallax | Photos drift ±9% (desktop) / ±5% (mobile), scrubbed | `useHeroMotion` |
| Reading reveal | Words brighten 14% → 100% as they are read: manifesto and lead testimonial | `ScrubWords.tsx` |
| Signature | "Put your logo on it" stitches the placeholder when it scrolls into view, and on every edit | `BrandPreview.tsx`, `MockupArtwork.tsx` |
| Page change | Content eases in (opacity + 10px) on navigation only, never on first load | `.page-enter` |

Rules: no fade-up-on-everything; product cards and grids hold still. Reduced motion disables Lenis, the thread, intro, parallax, word splitting and seam drawing (content renders final state).

## Put your logo on it (21 Oct 2026)

Modelled on the African Nomad brand mock-up builder. Upload a logo (PNG, JPG, WebP, SVG up to 10 MB; read in the browser, never sent or stored) or type a company name, then place it on as many positions as you like. The golf shirt uses the African Nomad shirt photos: three colours (white, black, royal blue), three views (front, left side, back) and six positions (left and right chest, full front, left sleeve, below the collar, full back), with sizes in millimetres on a size L shirt. Bottle and tote use one photo each and relative sizes (the cap was removed from the preview on 21 Oct at the owner's request; caps stay in the catalogue). Kept simple (21 Oct): one artwork for every position, either the uploaded logo or the typed name (Enter starts a new line, up to 3, shown on the product and in the PNG). Positions are toggle chips. Each position takes its usual method automatically (embroidery on the chest, sleeve and collar; screen print on full front and back; engraving on the bottle) and only asks for a colour and a size; drag to move. **Download PNG** puts every branded view side by side with a caption strip; **Add to my quote** writes the positions into the quote line's preferences.

| Part | File |
| --- | --- |
| Products, views, colours, positions, geometry, quote note | `src/lib/mockup.ts` |
| Logo reading, trim, background cut-out, text measuring | `src/lib/logo-upload.ts` |
| The SVG artwork layer and method filters (shared by screen and download) | `src/components/MockupArtwork.tsx` |
| Photo, + areas, drag/resize/keyboard, zoom, swipe between views | `src/components/MockupStage.tsx` |
| Section, controls, per-product state | `src/components/BrandPreview.tsx` |
| PNG export (lazy-loaded; adds `react-dom/server`) | `src/lib/mockup-export.tsx` |

Next products: add photos per colour and view under `public/mockups/<product>/` and give the product `views`, `colours`, `mmPerUnit` and its positions in `mockupProducts`. On phones the picture is pinned (`.preview-pin`) while the controls scroll; it shrinks and zooms while a wording field is focused.

## Simplify pass (21 Oct 2026)

- **Copy rule:** a section reads in three seconds; at most one short line under a heading. Labels over sentences.
- **Rails:** `ProductRail` (heading row with link and arrows; swipe on phones). `rail-grid` turns a rail into a four-up grid at `lg`.
- **Brands we supply:** `BrandWall`, logos in ink (`grayscale(1) brightness(0)`, 72 %), colour on hover; equal visual area sizing with per-logo optical scale. Marquee from 768 px (48 s, pauses on hover/focus), swipe row below, still under reduced motion.
- **Product page:** gallery left, facts right (sticky on desktop); fact rows not chips; demo note uses the signal left-rule style.
- **Tap targets:** Button default 44 px, `lg` 48 px, icon 44 px; Input 44 px.
- **Drawer:** right sheet on ≥640 px, bottom sheet below.


## Visual finishing pass — 21 October 2026 (Codex)

The ink/paper/signal palette, Host Grotesk and Satoshi, original company facts and testimonials remain the authority. Existing product pages and the expanded live logo builder were preserved.

- Hero: shorter type/photo settling, desktop-only 2% drift on the main workwear image; supporting images hold still so faces and gift contents stay in frame. Mobile copy/actions precede the main photograph. The desktop triptych has one consistent 560px height.
- Catalogue: GSAP Flip reflows the currently visible cards on desktop filter/sort actions; newly mounted cards receive a brief entrance. Phones receive only a short opacity/6px response. All runs are scoped and reverted with `gsap.matchMedia`; no layout-property tweening.
- Cards: a small desktop lift/zoom and an on-demand alternate photo; keyboard focus and the product gallery provide equivalent access. Quick-add becomes a solid ink confirmation with a brief check-mark settle. Equal-height card bodies align actions.
- About: a single transform-based shutter and slight photo settle; the full founders composition remains visible.
- Builder: four stitched edges draw around the existing preview, and zoom now animates a single transform. Source photo/placement coordinates and PNG export stay unchanged. Redundant speculative image warming is removed.
- Dialogs/drawer: short eased entrance, quicker exit, staggered drawer content, 44px close buttons, native internal scrolling, safe-area bottom padding and phone bottom sheets. Desktop centering utilities only apply from `sm` upward.
- Reading reveal: initial word opacity is 0.68 instead of 0.14, keeping contrast legible through the whole animation. Reduced motion returns all content to its final state and removes decorative motion.
- Delivery: source-bounded AVIF/WebP srcsets, explicit dimensions, lazy secondary content, early hero discovery and critical-font preloads.

No new motion library was added. Sharp is dev-only image tooling.

## Homepage mobile pass — 21 October 2026 (Claude)

Concept: Linton puts marks on garments, so the page borrows the garment's own language. The promises are a woven label sewn onto the hero photo; the "Put your logo on it" band shows a patch stitching onto a shirt chest. The stitch stays the only signature motion; nothing new animates on scroll except existing `.stitch` reveals (the teaser patch reuses them).

Section rhythm on Home (light / dark / saturated, no `bg-secondary` bands):

| Section | Background | Notes |
| --- | --- | --- |
| Hero | ink | One photo, `.hero-label` (paper, teal dashed seams at both ends) |
| What we supply | paper | unchanged |
| Brands we supply | white | unchanged (`BrandWall`) |
| Put your logo on it | **brand blue** `#004298` | white text 9.4:1; builder opens in `.builder-dialog` |
| Shop by occasion | paper | photo tiles, `.occasion-fade` ink gradient behind labels |
| Gift sets | ink | `ProductRail tone="dark"`: cards become white panels |
| Popular picks | paper | rail on phones, grid on desktop |
| Ways to brand | **brand teal** `#029B97` | ink text 5.3:1 (white would fail at 3.4:1) |
| Trust | white | blue 92% block with `.trust-meter`, founders photo |
| Closing (steps + contact) | ink | then footer |

- Rails: arrows from 768px only; `RailProgress` (dashed track, solid thumb; signal on dark) under each row.
- Known quirk: the global `* { border-color }` rule is unlayered, so Tailwind `border-*/opacity` colour utilities lose to it. Set rule colours in CSS (see `.methods-grid`, `.request-step`) when they matter.
- `Ink soft` is no longer used for the demo bar (removed); it remains the hero photo placeholder colour.
