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
