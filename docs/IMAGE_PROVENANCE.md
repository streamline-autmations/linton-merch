# Image provenance

## Range audit against lintonent.co.za (11 October 2026, later the same day)

The owner confirmed Linton resells Amrod / Altitude, Barron and the other ranges shown on its site, and that only products Linton already supplies (or variations) may appear. All 40 product-type pages on lintonent.co.za were crawled (612 images, 400×334, too small to reuse) to build the allow-list. Removed: lanyard, smartwatch set, speaker/earbuds set, wireless-charging set, 21-piece tool kit, travel-charging set, lunch box set. Added 26 types the site lists: trousers, skirts, dress, denim, chef's wear, kids' range, bucket/bush hats, flash drives, ruler, pocket knife, multi-tool, folder, card holder, laptop bag, sports bag, toiletry bag, travel mug, serving board, executive gift box. New images: Amrod CDN (ALT-CHI, ALT-MFJ, ALT-BBK, BAS-4757, ALT-AVL, HS-UB-70-C, ALT-WIL, USB-7465, USB-7406, RULER-2, TOOL-9920, TOOL-9663, FOLD-2302, GIFT-9451, GF-AV-991-B, BG-AL-451-B, BG-SC-361-B, SLAZ-2205, MUG-6505, HL-OK-159-B) and Barron ranges via The Promo Group's image CDN (`tpg-*` files: ladies trousers, two skirts, shirt dress, two chef jackets).

Facebook (facebook.com/lintonenterprisessa, owner logged in): slogan, four promises, 92% recommend (5 reviews) and the branding-method list came from the page and its flyers. Its photos are low-resolution flyers, so none are used.

## Real photography pass (11 October 2026)

All images are optimised WebP served from `public/` (about 3.7 MB in total, no CDN needed yet).

| Folder | Source | Notes |
| --- | --- | --- |
| `public/products/` | Supplier product photography from Amrod's public CDN (`amrcdn.amrod.co.za/.../ProductImages/{CODE}/`), selected from the supplier register in the owner's African Nomad master catalogue. | "NO-LOGO" versions used wherever they exist. Two images that showed real third-party brands (a FINTEQ beanie, a gin pull-up banner) were swapped for no-logo versions. Lifestyle shots were trimmed of their white letterbox. **Reseller use of supplier images must be confirmed with Linton (are they an Amrod reseller?).** Supplier codes are kept here, not on the site: BAS-7756, BAS-7759, ALT-PAM, JC-AV-118-A, BAS-8000, ALT-ANM, ALT-1101, ALT-11012, ALT-1202, ALT-1402, ALT-1904, BAS-2106, BD-UT-26-A, ALT-BBM, ALT-BBL, BAS-3432, TS-AL-59-A, CAP-1008, HS-UB-66-C, CAP-1030, GP-AL-68-B, IDEA-0935, BG-AL-550-B, IDEA-1142, COOL-5505, NB-9335, IDEA-0224, UM-UB-27-B, LAN-100, DISPLAY-4000, KH-7707. |
| `public/gifts/` | `Desktop/Africannomad/Africannomad catalogue/Product Images/01 Gift Sets & Hampers` (owner's own project). | "YOUR BRAND" mock-up imagery of gift sets AN-GFT-001 to 046. Same owner; confirm it may be reused for Linton. |
| `public/story/linda-and-tony.webp` | lintonent.co.za (`wp-content/uploads/2022/03/Linda-and-Tony-3.jpeg`) | Linton's own founders photo from their live site. |
| `public/brand/linton-merch-logo-colour.webp` | `assets-inbox/logo/Linton Merch Corporate Logo.png` | Supplied colour logo (not yet used on the ink header; the white logo is). Brand colours sampled from it: blue `#004298`, teal `#029B97`. |

Photos of work Linton did for named clients (lintonent.co.za project gallery) are still **not** used.

## Earlier concept image (retired from the homepage)

`public/merch-concept.png` was generated with the built-in image generation tool on 9 October 2026. It is generic concept photography, not an actual Linton product, location, logo or inventory record. It is labelled "CONCEPT IMAGE" in the homepage.

Final prompt:

> Use case: product-mockup. Asset type: premium website hero concept photo for South African corporate merchandise demo. Create a photorealistic editorial studio still life, landscape 3:2. A neatly folded ivory cotton polo shirt, matte black insulated metal water bottle, graphite cotton baseball cap, closed black notebook and a small subtle mustard yellow fabric pouch arranged thoughtfully on stacked cool grey concrete plinths. Strong tactile materials, soft directional daylight from upper left with honest rich shadows, minimal contemporary luxury merchandising aesthetic, clean pale cool grey studio background. Objects fill the right and center composition with a little air around them. No people, no readable text, no branding, no logos, no watermarks. This is generic concept merchandise, not actual company inventory.

Product catalogue art is original vector placeholder code in `ProductArtwork.tsx`. It is visibly described as illustrative artwork. Replace concept assets with approved real photography when supplied.

shadcn components were retrieved from the official `https://ui.shadcn.com/r/styles/new-york/{component}.json` registry for button, input, textarea, dialog and sheet. The CLI initially failed to resolve an `ajv` dependency; the official source was installed manually instead. [Manual Vite setup](https://ui.shadcn.com/docs/installation/vite) describes the configuration. Locally owned component source remains easy to maintain.

## Image audit and delivery — 21 October 2026 (Codex)

Inspected all 105 raster files in `public/products`, `public/gifts`, `public/story` and `public/brand` in labelled contact sheets, plus their rendered Home/Catalogue/dialog/About use. Baseline captures: `/tmp/linton-audit/before-{home,catalogue,dialog,about,quote}-{1440,1024,390,320}.png`. The retired concept image is not used by the current site. Actual catalogue data is authoritative; the handover's item count is historical.

### File → problem → correction

- `products/tpg-chef-exec.webp`: oversized empty canvas made the jacket much smaller than adjacent garments. Re-fetched the same executive jacket from [The Promo Group](https://thepromogroup.co.za/product/executive-long-sleeve-chef-jacket), trimmed transparent margins, flattened on white and centred on a square plate. Source: `https://images.thepromogroup.co.za/products/2026/05/3008-co_1779528797_9aeea3122c22674389917a5eac3567ba.png` (1000×1200). The supplier page currently labels this Brands, not Barron; no supplier brand is asserted in the demo.
- `products/hs-ub-70-c-02-no-logo.webp`: model portrait among isolated hat shots. Kept as the second photo; new primary `hs-ub-70-c-no-logo.webp` is the exact no-logo hat from `https://amrcdn.amrod.co.za/amrodprod-blob/ProductImages/HS-UB-70-C/HS-UB-70-C-NO-LOGO_1024X1024.jpg`.
- `products/bg-al-550-b-no-logo.webp`: three-view collage made the backpack undersized. Kept in the gallery; new single-view primary `bg-al-550-b-01-no-logo.webp` from `https://amrcdn.amrod.co.za/amrodprod-blob/ProductImages/BG-AL-550-B/BG-AL-550-B-01-NO-LOGO_1024X1024.jpg`.
- `products/slaz-2205-no-logo-no-logo.webp`: four-colour collage rather than one product. New navy primary `slaz-2205-n-no-logo.webp` from `https://amrcdn.amrod.co.za/amrodprod-blob/ProductImages/SLAZ-2205/SLAZ-2205-N-NO-LOGO_1024X1024.jpg`; existing red lifestyle shot retained as a colour variation.
- `products/{alt-bbm-dg1-mofr-027-no-logo,alt-bbl-dg1-mofr-018-no-logo,alt-chi-n-mofr-033-no-logo,alt-mfj-bu-mofr-7-no-logo,bas-3432-01-no-logo,bas-4757-02-no-logo,ts-al-59-a-02-no-logo}.webp`: contact-sheet padding initially resembled embedded white sidebars. Full-resolution inspection confirmed the studio backgrounds already fill the files; originals retained unchanged. The actual framing defect was the hero’s oversized rendered crop.
- `products/alt-1101-r-lifestyle03.webp` and the hero golf-shirt portrait: original files are sound; excessive rendered zoom clipped the model. Corrected presentation rather than retouching the subject.
- `gifts/*.webp`: 900×1125 portrait compositions were being centre-cropped into square cards and 4:3 galleries. Show the complete composition with contain sizing. Existing “YOUR BRAND” mock-ups remain illustrative, not proof of a specific supplied SKU. No new gift photos generated.
- `products/alt-avl-bl-lifestyle01.webp`: kitchen scene used as a skull-cap alternate did not clearly show the cap. Removed that association; retained for the chef jacket.
- `story/linda-and-tony.webp`: the 900px version was visibly soft. Replaced with a restrained WebP encoding of the 1188×863 [original founders photograph](https://lintonent.co.za/wp-content/uploads/2022/03/Linda-and-Tony-3.jpeg). Preserve the full composition; no synthetic sharpening or face reconstruction. Source softness remains.
- `brand/linton-logo-white.png`: 2000×600, 4,812,655 bytes (about 4.7 MiB), vastly oversized for the header. Retain the supplied source, serve small responsive derivatives instead.

No watermarks requiring removal were found. Manufacturer labels and existing mock-up marks are not removed. Files whose supplier names include `lifestyle-ai` were already present; their supplier provenance is retained and no claim of documentary photography is made here.

### Responsive delivery

`pnpm images:prepare` uses dev-only Sharp to generate AVIF and WebP candidates at 160, 320, 640, 960 and source-bounded maximum widths (never upscale; maximum 1280px). Outputs live in `public/media`; `src/data/image-manifest.json` records dimensions and srcsets. `ResponsiveImage` supplies explicit dimensions, responsive `sizes`, async decoding and lazy loading by default. Hero primary is eager/high priority; all originals remain available for reprocessing. Brand-preview source coordinates are unchanged.

### Needs generation / owner assets

- **No generation required for the audited fixes.** Real supplier sources or presentation corrections were available.
- **Owner-supplied replacement recommended:** a sharper original portrait of Linda and Tony together. Do not generate a replacement likeness of the founders.
- Existing gift-set mock-ups still need owner approval as illustrative demo assets, as recorded above. This pass does not certify image licences or exact supplier inventory.

## Brand mock-up shirt photos (21 Oct 2026)

`public/mockups/golf-shirt/{white,black,blue}-{front,side,back}.webp`: copied from the African Nomad catalogue project (`public/mockups/golf-shirt/`), which converted the owner's own "Images 4 branding" shirt photos (supplied by Christiaan, 11 Oct 2026). Plain, unbranded shirts used only as the canvas for the logo preview.


## Brand logos — 21 October 2026 (Claude)

"Brands we supply" on Home (`src/components/BrandWall.tsx`) shows the ten ranges lintonent.co.za lists. Files live in `public/brands/`. Logos are trademarks of their owners and are shown only to name ranges Linton supplies; confirm with Linton before public release. None were drawn, traced or recreated.

| Brand | File | Source | Processing |
| --- | --- | --- | --- |
| Altitude | `altitude.png` (87×19) | Amrod brand strip: `https://amrcdn.amrod.co.za/amrodprod-blob/_default_upload_bucket/Altitude.png` | Trimmed, white knocked out to transparency. **Low resolution, owner to supply a sharper file.** |
| Barron | none, styled wordmark | barron.co.za did not respond (timeout); no official file found on The Promo Group or Amrod | Plain text in the display face. **Needs a logo file.** |
| Pro-Active | none, styled wordmark | No official source found | Plain text. **Needs a logo file.** |
| Rolando | none, styled wordmark | No official source found | Plain text. **Needs a logo file.** |
| Slazenger | `slazenger.svg` | Wikimedia Commons `File:Slazenger_wordmark_2024.svg` (public domain, from slazenger.com) | Unmodified SVG. |
| Cutter & Buck | `cutter-buck.png` (563×160) | cutterbuck.com site logo: `https://cdn11.bigcommerce.com/s-d18iepu0cs/images/stencil/original/iconic-cutter_buck_1_1788551035__55284.original.png` | Trimmed, knocked out, downscaled. |
| Elevate | `elevate.png` (209×59) | Linton's own brand page: `https://www.lintonent.co.za/wp-content/uploads/2018/06/elevate-logo.jpg` (the mark Linton shows; Amrod uses a different Elevate logo) | Trimmed, knocked out. Low resolution. |
| Ogio | `ogio.png` (245×60) | `https://www.lintonent.co.za/wp-content/uploads/2018/06/ogio-logo.jpg` (ogio.com rate-limited) | Trimmed, knocked out. |
| Polo | `polo.png` (177×240) | polo.co.za: `https://www.polo.co.za/media/logo/stores/1/Polo_Logo_2020.png` | Trimmed, downscaled. |
| Billboard | `billboard.svg` | Wikimedia Commons `File:Billboard_Logo_2013.svg` (public domain; matches the mark on lintonent.co.za/brandnames) | Unmodified SVG. |

Knock-out method (raster files only): alpha = darkness of each pixel against white, normalised so the darkest stroke is fully opaque, colour un-premultiplied from white. The site renders every logo in ink (CSS `grayscale(1) brightness(0)`, 72% opacity) with original colour on hover; colour carries no meaning.
