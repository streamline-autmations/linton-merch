# Image provenance

## Range audit against lintonent.co.za (11 October 2026, later the same day)

The owner confirmed Linton resells Amrod / Altitude, Barron and the other ranges shown on its site, and that only products Linton already supplies (or variations) may appear. All 40 product-type pages on lintonent.co.za were crawled (612 images, 400×334, too small to reuse) to build the allow-list. Removed: lanyard, smartwatch set, speaker/earbuds set, wireless-charging set, 21-piece tool kit, travel-charging set, lunch box set. Added 26 types the site lists: trousers, skirts, dress, denim, chef's wear, kids' range, bucket/bush hats, flash drives, ruler, pocket knife, multi-tool, folder, card holder, laptop bag, sports bag, toiletry bag, travel mug, serving board, executive gift box. New images: Amrod CDN (ALT-CHI, ALT-MFJ, ALT-BBK, BAS-4757, ALT-AVL, HS-UB-70-C, ALT-WIL, USB-7465, USB-7406, RULER-2, TOOL-9920, TOOL-9663, FOLD-2302, GIFT-9451, GF-AV-991-B, BG-AL-451-B, BG-SC-361-B, SLAZ-2205, MUG-6505, HL-OK-159-B) and Barron ranges via The Promo Group's image CDN (`tpg-*` files: ladies trousers, two skirts, shirt dress, two chef jackets).

Facebook (facebook.com/lintonenterprisessa, owner logged in): slogan, four promises, 92% recommend (5 reviews) and the branding-method list came from the page and its flyers. Its photos are low-resolution flyers, so none are used.

## Real photography pass (11 October 2026)

All images are optimised WebP served from `public/` (about 3.7 MB in total, no CDN needed yet).

| Folder | Source | Notes |
| --- | --- | --- |
| `public/products/` | Supplier product photography from Amrod's public CDN (`amrcdn.amrod.co.za/.../ProductImages/{CODE}/`), selected from the supplier register in the owner's African Nomad master catalogue. | "NO-LOGO" versions used wherever they exist. Two images that showed real third-party brands (a FINTEQ beanie, a gin pull-up banner) were swapped for no-logo versions. Lifestyle shots were trimmed of their white letterbox. **Reseller use of supplier images must be confirmed with Linton (are they an Amrod reseller?).** Supplier codes are kept here, not on the site: BAS-7756, BAS-7759, ALT-PAM, JC-AV-118-A, BAS-8000, ALT-ANM, ALT-1101, ALT-11012, ALT-1202, ALT-1402, ALT-1904, BAS-2106, BD-UT-26-A, ALT-BBM, ALT-BBL, BAS-3432, TS-AL-59-A, CAP-1008, HS-UB-66-C, CAP-1030, GP-AL-68-B, IDEA-0935, BG-AL-550-B, IDEA-1142, COOL-5505, NB-9335, IDEA-0224, UM-UB-27-B, LAN-100, DISPLAY-4000, KH-7707. Second (hover) photos added 22 Oct 2026, same CDN, same colour as the main photo: back views (GHBK) of BAS-7756, BAS-7759, ALT-PAM, JC-AV-118-A, BAS-8000, ALT-ANM, ALT-11012, BD-UT-26-A, ALT-BBK; model shots ALT-1202 (MOBK8), ALT-1904 (MOFR10); NO-LOGO alternates of CAP-1008, CAP-1030, ALT-WIL, BG-AL-550-B, USB-7406, BG-SC-361-B, BG-AL-451-B; NB-9335 open; USB-7465 box. |
| `public/gifts/` | `Desktop/Africannomad/Africannomad catalogue/Product Images/01 Gift Sets & Hampers` (owner's own project). | "YOUR BRAND" mock-up imagery of gift sets AN-GFT-001 to 046. Same owner; confirm it may be reused for Linton. AN-GFT-001 (notebook, pen & bottle set) switched to the white-background versions on 22 Oct 2026 (source files `*-white.png`; the source names for 03 and 04 are swapped, mapped by picture). |
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

### Follow-through on the current project state — 21 October 2026

The later product-page and logo-builder work was already present when this pass resumed. Preserved it. Expanded responsive delivery to the nine existing `public/mockups/golf-shirt` photographs and the raster `public/brands` logos: 122 total source records, with every generated path checked to exist. SVG logos keep their original vector source. No additional product category or invented product photograph was introduced.

The 320px white-logo AVIF is 5,439 bytes versus the 4,812,655-byte source PNG; the browser selects larger candidates for higher pixel density. The supplied logo-derived favicon/touch-icon set remains in use. `public/og-linton.jpg` is a 1200×630 composition of the existing logo, Host Grotesk/Satoshi type and the real workwear photo plus existing illustrative gift-set image (134,809 bytes), generated by `scripts/create-social-image.mjs`. It is not a newly generated product photograph. Static OG/Twitter metadata makes the common branded share image available to crawlers that do not execute React.

The low-resolution Altitude and Elevate marks in the newer logo wall still need sharper official source files; Barron, Pro-Active and Rolando remain plain wordmarks pending approved logo files. These are asset requests, not generation requests.

## Hero photography refresh — 21 October 2026 (Codex)

The previous red conti-suit lead, green golf-shirt portrait and illustrative gift-box image were individually usable but had unrelated lighting, colours and framing. Replaced their **homepage placements** with a coordinated corporate-clothing lead, fabric detail and executive gift still life. The previous files remain available in the catalogue; no product records or categories changed.

| Local source | Real supplier source | Processing |
| --- | --- | --- |
| `public/hero/team-golf-shirts.webp` | [Amrod ALT-APM-02-NO-LOGO_DEFAULT.jpg](https://amrcdn.amrod.co.za/amrodprod-blob/ProductImages/ALT-APM/ALT-APM-02-NO-LOGO_DEFAULT.jpg), 2362×2362 | Downsampled to 1600×1600, WebP quality 91. The coordinated charcoal/cyan shirts are photographed together; no compositing or invented branding. Top-aligned display crop preserves both faces. |
| `public/hero/uniform-detail.webp` | [Amrod BAS-7756-N_DEFAULT.jpg](https://amrcdn.amrod.co.za/amrodprod-blob/ProductImages/BAS-7756/BAS-7756-N_DEFAULT.jpg), 2421×2421 | Real navy corporate shirt. Crop at x650/y50, 1450×1300, then resized to 1400px wide, WebP quality 91. Detail concentrates on the collar, buttons and stitched pocket. Supplier label retained. |
| `public/hero/executive-gifting.webp` | [Amrod GF-AV-991-B_LIFESTYLE-NO-LOGO_DEFAULT.jpg](https://amrcdn.amrod.co.za/amrodprod-blob/ProductImages/GF-AV-991-B/GF-AV-991-B_LIFESTYLE-NO-LOGO_DEFAULT.jpg), 2362×2362 | Downsampled to 1400×1400, WebP quality 91. Preserve the complete bottle, notebook and pen with contain sizing. Supplier/manufacturer marks remain. No customer logo was added. |

`pnpm images:prepare` now includes `public/hero`, bringing the manifest to 125 sources. Each new photo has source-bounded 160/320/640/960/1280px AVIF and WebP variants and intrinsic dimensions. Homepage preload and `ResponsiveImage` use the same team-photo srcset and sizes, with eager/high priority only on the lead. Supporting photos remain lazy. No artificial sharpening, upscaling, AI imagery or new generation request was needed. The existing OG composition is unchanged by this hero-only refresh.

## 22 Oct 2026: more product photos and the share image

- **Extra angles from Amrod's CDN** (`public/products/`, 42 files). Same CDN and rules as above: no-logo or logo-free garment shots only, taken from each supplier page's own image list (`amrod.co.za/product/{code}` → `amrcdn.amrod.co.za/amrodprod-blob/ProductImages/{CODE}/{NAME}_1024X1024.jpg`), converted to WebP q82. Added as gallery photos (ghost back/side views, model shots, detail shots) to LM-001–011, 013–018, 020, 023, 026, 027, 030, 043, 044, 052, 053 and 016. Codes: BAS-7756, BAS-7759, ALT-PAM, JC-AV-118-A, BAS-8000, ALT-ANM, ALT-1101, ALT-11012, ALT-1202, ALT-1402, ALT-1904, BD-UT-26-A, ALT-BBM, ALT-BBL, BAS-3432, TS-AL-59-A, HS-UB-66-C, HS-UB-70-C, ALT-WIL, GP-AL-68-B, BG-AL-550-B, NB-9335, IDEA-0224, DISPLAY-4000, BG-SC-361-B, SLAZ-2205.
- **Left out on purpose:** shots showing a third party's logo (Osman Shipping, Karaca, Elevance Health, Hydrate Man, Natural, BSG, Redfuel) and shots that pull in other brands' products (Shield / The Body Shop on the toiletry bag).
- **Supplier reference photos** (`Africannomad catalogue/Supplier_References/`): `um-ub-27-b-colours.webp` and `um-ub-27-b-open.webp` (SP-0330 ref00/ref01) and `idea-0224-colours.webp` (SP-0286 ref00), resized to 1024px. All blank, no third-party marks.
- **Gift set LM-112:** `public/gifts/an-gft-018-01-hero.webp` refreshed from the newer `AN-GFT-018-01-hero-v2.png` (13 Oct) in the owner's African Nomad catalogue.
- **Not used:** the other `Product_Images/Promotional` mockups (coasters, mirrors, lip balm, sunglasses, wristbands, stress toys, tote and drawstring bags, tape measures, headlamp) because Linton does not list those product types on lintonent.co.za. Gift sets 009, 010, 013, 014, 016, 017, 019, 020, 029, 030, 045 and 046 exist in the source folder but are not yet products.
- **Share image:** `public/og-linton-logo.jpg` (1200×630, white background) is the owner-supplied Linton Enterprises "LSE" logo (800×800 PNG), trimmed and centred. It replaces `og-linton.jpg` in `index.html` and `src/lib/meta.ts`. A new filename is used so WhatsApp and Facebook fetch it fresh instead of showing the cached old preview.
