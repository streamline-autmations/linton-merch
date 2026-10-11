# Design system

The visual thesis (v2, 9 Oct 2026): the client's white-on-ink logo sets a dark ink frame; products and photography are treated as a single duotone (ink to paper); one drawer motion (the quote drawer) is the only signature movement; the manifesto line is the client's own: "Service is our actual business."

## Canonical tokens

`src/index.css` is the source of truth; `design-tokens.json` is a snapshot to refresh.

| Role          | Value     | Use                                                                       |
| ------------- | --------- | ------------------------------------------------------------------------- |
| Ink           | `#0E161D` | Header, footer, hero, primary buttons, text                               |
| Ink soft      | `#1B2833` | Demo notice bar                                                           |
| Paper         | `#F1F3F2` | Main background                                                           |
| Secondary     | `#E2E7E6` | Quiet sections, hover rows                                                |
| Muted text    | `#4F5D65` | Supporting copy                                                           |
| Border        | `#CBD3D4` | Dividers and fields                                                       |
| Signal        | `#2EC4B6` | Linton teal (from the logo, brightened for ink). Quote count, primary hero CTA, focus on dark. Rationed |
| Brand blue    | `#004298` | Logo blue. Reserved for brand moments |
| Brand teal    | `#029B97` | Logo teal (exact) |
| Product plate | `#C3CDCC` | Product artwork wells                                                     |

Typography: Host Grotesk Variable (display, uppercase only on hero/poster lines) and Satoshi (body, UI; Fontshare Free Font License, files in `src/fonts/`). Radii are small (2-8px); no pill shapes.

Photography (v3, 11 Oct 2026): real product photos sit in full colour on white plates (colour is the product). A card crossfades to a worn / in-use / open-box photo on hover. Lifestyle photos are used full-bleed in the hero and category rows.

Signature motion (v3): **the stitch**. In "Put your name on it" the visitor's company name stitches itself onto a golf shirt or cap (dashed SVG stroke drawing in), burns into a bottle, or presses onto a tote. Hover swaps and the quote drawer are the only other movement.

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
| Signature | "Put your name on it" stitches the placeholder when it scrolls into view, and on every edit | `BrandPreview.tsx` |
| Page change | Content eases in (opacity + 10px) on navigation only, never on first load | `.page-enter` |

Rules: no fade-up-on-everything; product cards and grids hold still. Reduced motion disables Lenis, the thread, intro, parallax, word splitting and seam drawing (content renders final state).
