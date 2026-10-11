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
