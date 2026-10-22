# QA report — 9 October 2026

## Redesign pass (later on 9 Oct 2026, Claude, WSL, Node 22.23)

Actually run: `pnpm typecheck` (pass), `pnpm test` (4 pass, includes the confirmed-number WhatsApp link), `pnpm build` (pass), `pnpm test:e2e` (6 pass, desktop and mobile), `pnpm check:presentation` (no overflow at 320/390/768/1440 on `/`, `/catalogue`, `/quote`, `/about`; axe WCAG 2 A/AA clean at 390 and 1440; 200% text at 390 clean). Visual inspection at 1440 and 390 of Home, Catalogue, About and Quote. Not run: Safari/iOS, a deployed Netlify host, an independent Codex review. The Vite dev server does not see edits on `/mnt/c`, so check results are only valid after a server restart.

Previous report (initial Codex-built version) follows.

## Verified

| Check                                | Result                          | Scope                                                                                                                         |
| ------------------------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Strict TypeScript / production build | Passed                          | `pnpm build` includes `tsc --noEmit` then Vite production output                                                              |
| Quote unit tests                     | 4 passed                        | Unknown/corrupt basket entries, duplicates, quantity bounds, all-product summaries, WhatsApp destination/encoding             |
| Browser journeys                     | 6 passed                        | Three journeys, each at desktop and mobile sizes, using local Chrome via Playwright                                           |
| Responsive width checks              | Passed                          | All three routes at 320, 390, 768 and 1440px, including a populated quote                                                     |
| Enlarged text                        | Passed                          | Catalogue at 390px with root text size set to 200%; no horizontal overflow                                                    |
| Automated accessibility scan         | No violations in checked states | axe WCAG 2 A/AA and 2.1 AA tags on Home, Catalogue and populated Quote at 390 and 1440px                                      |
| Visual inspection                    | Completed                       | Final desktop homepage/quote and mobile catalogue; previous full-page home/mobile quote inspection plus refreshed screenshots |

## Browser behaviours exercised

- Catalogue category selection, search, no-results/reset state and product details.
- Adding two products, refreshing and retaining the selection.
- Updating quantities, product colour/size preferences, branding and notes.
- Selecting a sample artwork filename without reading or uploading it.
- Required contact validation, review acknowledgment and local demo completion.
- Summary contains every product, quantity, preference, contact field and the no-submission notice.
- Download returns `linton-demo-quote.txt`; contact email is absent from localStorage.
- Unconfigured WhatsApp offers a preview with no real recipient link.
- Corrupted storage recovers to an empty basket; removal reaches the correct empty drawer state.
- Browser storage blocked: selection still works for the session and an honest persistence notice appears.
- Keyboard product-dialog/drawer opening and Escape dismissal; focus returns to their trigger controls.
- Desktop navigation and mobile menu close correctly while preserving the basket.
- All routes and the unknown-route recovery page render; main RFQ journey produces no page errors.

## Corrections made during verification

Narrow quote rows were reorganised so quantity controls fit at 320px. The header and catalogue reflow when text is enlarged. Product SVG filter IDs are unique. Browser test locators were scoped to the quote sidebar to avoid the drawer's exit-animation interval. A font-subset experiment used an unsupported import and was reverted to the working locally bundled font before final checks.

## Limits and outstanding external work

- No independent Claude/Codex MCP review ran in this session. Claude was not available as a runnable agent; the available Codex CLI did not advertise MCP-server mode. The handoff and inactive configuration example document this accurately.
- No public Netlify deployment or domain change occurred. Netlify route/header files are prepared, and the packaged static output contains the SPA fallback. Host-level behaviour needs a smoke check once deployed.
- The confirmed recipient branch of WhatsApp is unit-tested for URL construction; no real contact was opened or message sent.
- Clipboard success depends on browser permissions. Copy actions have selectable text/download alternatives. The downloaded summary was exercised in the browser journey.
- The accessibility scan covers the stated page states, not every possible state or assistive technology. It is not a conformance certification. No Safari/iOS browser run occurred.
- Products, specifications, image, identity treatment and contact setup remain demo placeholders. No business availability, garment-branding policy, lead time or certification has been verified.

## Reproduce

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
pnpm dev
pnpm check:presentation
pnpm screenshots
```

The last two scripts expect the preview at `http://127.0.0.1:5173`. For an existing browser, set `E2E_BROWSER_PATH` to its Chrome/Edge executable instead of downloading Chromium. Screenshots are under `docs/preview/`.

## Real content pass — 11 October 2026 (Claude)

- `pnpm typecheck`, `pnpm test` (4/4), `pnpm test:e2e` (6/6, desktop + 390px mobile incl. 320px narrow checks), `pnpm build`: all pass.
- Every image path referenced in `products.ts`, `business.ts`, `Home.tsx`, `BrandPreview.tsx` and `About.tsx` checked to exist in `public/`.
- Visual inspection with Playwright at 1440, 390 and 320px: home, catalogue (incl. `?occasion=`), product dialog, About, all four "Put your name on it" canvases.
- Codex read-only review (`codex exec -s read-only`) found two issues, both fixed and re-verified at 320px: BrandPreview button overflow at 320px (medium) and long names spilling past the chest area (low; now capped with SVG `textLength`).

## Motion layer — 11 October 2026 (Claude)

- `pnpm typecheck`, `pnpm test` (4/4), `pnpm test:e2e` (6/6 desktop + mobile), `pnpm build`: pass. JS bundle 189 kB gzip (GSAP + Lenis added).
- Browser checks (Playwright, 1440 and 390px): Lenis drives scroll; header hides on scroll down and returns on scroll up; progress thread fills; manifesto words brighten while scrolling; catalogue filter chips dock under the visible header; product dialog pauses Lenis and scrolling resumes after closing; hero photos cover their frames throughout parallax; no console errors.
- Reduced motion: on load, no Lenis, word split, clip or thread. Switching it on live reverts every GSAP animation and destroys Lenis.
- Codex read-only review found 6 issues, all fixed and re-verified: Lenis `autoToggle` could leave scroll locked after dialogs (high; removed, Radix observer drives stop/start); stale stitch observers across routes; wheel inertia fighting keyboard/focus scrolling (now cancelled); parallax exposing frame edges (1.2× overscan on a wrapper); motion not reverting on live reduced-motion change (now `gsap.matchMedia`); gift-rail arrows smooth under reduced motion.

## Put your logo on it — 21 October 2026 (Claude)

- `pnpm typecheck`, `pnpm test` (9/9, incl. new `mockup.test.ts`), `pnpm test:e2e` (6/6 desktop + mobile), `pnpm build`: pass. The PNG export (and `react-dom/server`, ~200 kB) is a separate lazy chunk loaded on click.
- Browser checks (Playwright, Chromium, 1440 and 390px): uploaded a WebP and a JPG-on-white logo (background cut-out works); typed a name; moved and resized the artwork with the mouse, including the bottle's -90° area (direction and clamping correct); downloaded PNGs for the shirt and bottle and inspected them (artwork, texture, caption strip and fonts match the screen); no horizontal overflow and the pinned picture works at 390px; no console errors.
- Not verified: Safari/iOS and Firefox (SVG filters inside the PNG export, file picker, touch dragging); real touch dragging on a phone; screen-reader pass.
- Codex read-only review could not run (the Codex usage limit was reached until 2:14 PM). Self-review fixed the mobile keyboard overlap (picture now shrinks while typing).

## Golf shirt builder like African Nomad's — 21 October 2026 (Claude)

- `pnpm typecheck`, `pnpm test` (15/15), `pnpm build`, `pnpm test:e2e` (8/8 desktop + mobile; a first run failed while another session was editing `tests/demo.spec.ts`, the rerun passed).
- Browser checks (Playwright, Chromium, 1440 and 390px): six positions with + areas, view tabs with branding dots, three shirt colours, JPG logo with background cut-out on every position, full back in white ink on black, mm size label, zoom, downloaded PNG with front and back side by side; no horizontal overflow at 390px (fixed a 20px overflow from the pinned picture); no console errors.
- Not verified: Safari/iOS and Firefox, real touch dragging and swiping, screen reader.


## Simplify pass — 21 October 2026 (Claude)

Owner brief: premium, short, compact, easy to use; logos instead of a brand sentence; a page per product; app-like mobile.

**Copy and length (main content, 390px, measured in the browser):** Home 1,095 → 744 words and 13,433 → 9,937 px tall; Catalogue 1,016 → 729 words, 15,306 → 13,633 px; About 267 → 199 words; Quote 160 → 111 words. Examples: hero paragraph "…sourced from South African suppliers and branded in-house. Pick what you need and send one clear request." → "Golf shirts to gift boxes, branded in-house."; catalogue intro + notice box (52 words) → "A starting selection. Ask for anything you don't see."; drawer note "25 is a starting quantity, not a minimum order. This demo does not show prices or place orders." → "25 is a starting point, not a minimum." Testimonials and company facts unchanged.

**Structure:** occasions are a 2-column tile grid on phones; gift sets, popular picks and the four secondary testimonials are swipe rails on phones (popular picks settle into a grid on desktop); ways-to-brand is method + "best for" only; the About story shows its first paragraph with "Read the full story". Quote: 3 steps → 2 (Details → Review); optional date/notes/artwork sit in one closed disclosure that reopens if it holds anything.

**Product pages:** `/product/:slug` (slug derived from the product name, unit-tested for uniqueness and round-trip). Swipe gallery with dots on phones, thumbnails on wider screens, tap-to-enlarge dialog with focus return; name, one line, fact rows, quantity + Add to quote (sticky bar on phones), "More like this" rail. Per-page title, description, canonical and OG tags; noindex unchanged. Unknown slug → "We can't find that one." with a catalogue link. Back restores the exact catalogue filters and scroll position (Lenis is resized before the restore so it isn't clamped to the previous page's height). Cards link to the page and keep quick-add; the product dialog is gone.

**Logo wall:** 7 of 10 real logos (sources in IMAGE_PROVENANCE.md); Barron, Pro-Active and Rolando are plain wordmarks pending files. Ink by default, colour on hover, swipe row on phones, 48 s marquee on wider screens that pauses on hover/focus, one still centred row under reduced motion.

**Mobile:** Button, input and quantity controls raised to ≥44 px; sheet close button 44 px; footer and standalone links 44 px tall; basket drawer is a bottom sheet under 640 px; safe-area padding on the bottom bars; header and demo notice fit one line at 320 px; search uses `type="search"` and `enterkeyhint`; delivery city uses `autocomplete="address-level2"`.

**Checks actually run:** `pnpm typecheck` pass; `pnpm test` 15/15 (3 files, incl. new slug tests); `pnpm build` pass; `pnpm test:e2e` 8/8 (desktop + 390 mobile, incl. new product-route test: direct load, title/canonical/noindex, quantity 40 persisted, related product navigation, Back restores `?category=Gift+sets` and scroll). Overflow audit at 320×640, 360×740, 390×844, 768×1024 and 844×390 landscape on Home, Catalogue, two product pages, Quote and About: no horizontal overflow. `pnpm check:presentation` (now includes `/product/corporate-shirt`, and waits 1.5 s for the hero intro): no overflow at 320/390/768/1440 or at 200 % text; axe clean on Catalogue, Quote, About and Product. Home still reports colour-contrast on (a) the manifesto's scroll-reveal words, which start at 14 % opacity until scrolled (existing motion design; the scan does not scroll), and (b) teal "+ Add" labels in the new "Put your logo on it" branding-positions list. Fixed one real failure: hero category numbers at 40 % white raised to 60 %. Visual inspection with screenshots at 1440, 1024, 390 and 320. No console errors on my routes.

**Not run:** the read-only Codex review was attempted (`codex exec -s read-only`) and refused: Codex usage limit reached until 14:14. Claude did a manual review of scroll restoration, back fallback, basket quantity updates, focus return and quote validation instead. No Safari/iOS run.

**Concurrent work:** while this pass ran, another tool was rewriting the "Put your logo on it" feature (`BrandPreview.tsx`, `MockupStage.tsx`, `MockupArtwork.tsx`, `lib/mockup*.ts`). Its intermediate state briefly broke Home and typecheck; both were green again before the final checks. Its section is now much longer on phones and has sub-44 px targets (view tabs 40 px, position hotspots ~24×14 px, swatches 40 px); left for that work's owner.

## Simpler builder and multi-line names — 21 October 2026 (Claude)

- `pnpm typecheck`, `pnpm test` (16/16, incl. line-break handling), `pnpm build`, `pnpm test:e2e` (8/8): pass.
- Browser (Chromium, 1440 and 390px): two-line name on chest and full back, centred and sized to its area; PNG keeps the line breaks; position chips add, select and remove; the pinned picture sits under the header on phones; no horizontal overflow; no console errors.


## Agency polish and image delivery — 21 October 2026 (Codex)

Continued against the current project after the later simplify/product-page/logo-builder work was present. Preserved those routes and flows, existing company facts/testimonials, demo notices, noindex and contact behaviour. No commit, push, deployment or `.env` edit was performed by this pass. Existing unrelated working changes in `lib/mockup.ts` and `lib/mockup.test.ts` were preserved.

### Images and visual finish

- Audited all 105 initial product/gift/story/brand images in contact sheets and checked rendered crops at 1440/1024/390/320 before bulk changes. File-by-file findings, supplier URLs, corrections and the initial contact-sheet-padding false alarm are recorded in `IMAGE_PROVENANCE.md`.
- Matching no-logo supplier replacements: bucket hat, backpack and sports bag; trimmed the executive chef jacket's empty canvas; larger original founders image; complete gift-set compositions rather than square cropping. Product counts/categories unchanged.
- Responsive AVIF/WebP delivery now covers 122 sources including the newer shirt mockups and raster brand marks. All srcset paths exist; no upscaling. Default lazy loading, explicit dimensions, eager/high-priority primary hero, critical-font preloads and homepage-only early image discovery. Header logo: 4,812,655-byte original → 5,439-byte 320px AVIF (larger candidates selected for dense screens).
- Hero columns align to 560px on desktop. Only the main photo drifts, by 2%; supporting portraits and gifts stay still. Mobile copy/actions precede the main photograph. About preserves the full founders composition and no longer jumps to its form on initial mount.
- Catalogue filter/sort reflows visible desktop cards with GSAP Flip, including newly mounted cards; phone feedback uses a short opacity/6px transition. Equal-height cards align quick-add actions, with tactile desktop lift/zoom, alternate image on interest, keyboard access through the name/gallery and an ink/check confirmation after adding.
- Four stitch edges frame the existing live builder. Zoom animates one transform, retaining placement coordinates. Removed speculative warming that fetched WebP before the displayed AVIF. View/colour/remove controls are 44px, with expanded branding hit areas.
- About gets one shutter/soft-scale photo reveal. Reading-reveal words start at 0.68 opacity rather than 0.14, keeping contrast readable during the effect. No new motion dependency.
- Drawer and dialogs get eased entrance, quicker exit, drawer content stagger and clear 44px close controls. Fixed an overlapping title that intercepted the drawer close button. Phone dialogs are bottom sheets with safe-area padding. A production-only translation defect was fixed with `sm:` centering utilities: a CSS reset alone was removed by the minifier.
- Existing logo-derived icon set retained. New `public/og-linton.jpg` (1200×630) uses the existing logo, fonts and imagery; static OG/Twitter metadata is available without running React. Titles remain route-specific. The existing 404 recovery now offers Home and Catalogue.

### Checks actually run

- `pnpm install --frozen-lockfile`: pass at the start. Added only dev-only Sharp for requested image processing; lockfile updated.
- After implementation slices: `pnpm typecheck && pnpm test`: pass. Final unit suite: **16/16**, 3 files.
- `pnpm build`: pass. Existing main bundle is about **218 kB gzip**; Vite reports the >500 kB uncompressed chunk advisory. PNG export stays a lazy chunk. No framework/library migration or route restructuring was introduced for this pass.
- Final `pnpm test:e2e`: **8/8**, desktop and 390px touch Chromium. Covers catalogue/search, basket persistence/storage failure, keyboard/focus dismissal, local RFQ creation/download, existing product pages and catalogue Back restoration.
- Production-preview screenshots and assertions: `POLISH_BASE_URL=http://127.0.0.1:4174 node scripts/verify-polish.mjs`. Widths/heights: **1440×1000, 1024×900, 768×1024, 390×844, 360×740, 320×640, 844×390 landscape**. Home, Catalogue, About, populated Quote, Product, image-enlargement dialog and populated basket. Images are scrolled into view before full captures at 1440/390. Results and screenshots: `docs/preview/polish/chromium/`. **53 checks passed, 0 failures, 0 page errors**, recorded in its `results.json`; includes explicit dialog bounds and focus return, image alternatives, missing/broken eager images, overflow, browser errors and axe WCAG A/AA scans at 1440/390.
- Enlarged-text follow-up: fixed 16px catalogue overflow at 200% text by allowing the search/sort row to wrap. Rechecked 390px root at 200%: document width is exactly 390px. `pnpm check:presentation` passes all 31 checks, including the enlarged-text case and axe scans; report saved as `docs/preview/polish/chromium/presentation-results.json`.
- Additional Playwright CLI checks at 320/390/1024/1440: category → All → A–Z, company name over two lines, shirt colour change and zoom, live reduced-motion toggle. No horizontal overflow; reduced motion removes Lenis, hides the thread and leaves **0 running browser animations**. Keyboard focus brings the hidden header back into view. Final zoom-label/handle compensation was inspected at all four widths: dimension labels remain about 18.3px high on screen at 2.6× image zoom; no builder overflow, and all dialog bounds stay inside the viewport.
- Local mobile Lighthouse, production preview: **92 performance / 100 accessibility / 100 best practices**. FCP **2.0s**, LCP **3.1s**, total blocking **110ms**, CLS **0**. Initial run was 87 performance; early image/font discovery and smaller delivered assets improved it. This is one local lab run, not deployed field data. Raw report: `docs/preview/polish/performance/lighthouse-home.json`.
- Actual Playwright CDP throttling at 390×844, **4× CPU**, **1.6 Mbps down / 750 Kbps up / 150ms latency**: Home LCP **2.704s**, CLS **0**, ~**461 kB** resource transfer; Catalogue LCP **2.480s**, CLS **0**, ~**396 kB**. Both had no visible broken images, overflow or page errors. Reports/captures: `docs/preview/polish/performance/`.
- Read-only second-agent review requested by the repo reviewer workflow found four concrete issues: individual dialog translation, doubled desktop dialog translation, incoming Flip targets, duplicate-format prefetch. All fixed; reviewer confirmed the source fixes. The runtime dialog-bounds assertion caught the minifier issue afterward and the responsive utility fix was rendered again.
- `git diff --check`: pass. 21st deterministic review's remaining focus warning is the intentional non-interactive `<main tabindex="-1">` navigation focus target; interactive controls retain visible focus. Token-colour warnings refer to product/ink swatches and canonical token definitions, not added brand colours.

### Limits / owner assets

- **WebKit/iOS unverified.** Downloaded Playwright WebKit 2370; launch failed because WSL lacks GTK4, Graphene, ICU78 and media libraries. No system packages were installed. `node scripts/verify-polish.mjs --webkit` is available once the browser's host dependencies are installed. Chromium device emulation is not a Safari result.
- No image generation is needed for the audited fixes. A sharper **real** founders portrait is still recommended; the larger original remains soft. Higher-resolution official Altitude/Elevate marks and approved Barron/Pro-Active/Rolando logos remain owner asset requests. Existing gift mockups need the previously recorded reuse approval.
- Touch/keyboard interaction was exercised in emulation, not on a physical phone. No real message was sent, artwork submitted, payment added or inventory/price claim introduced.

## Hero photography refresh — 21 October 2026 (Codex)

Owner requested better hero images. Replaced the industrial red-workwear lead and mixed supporting imagery with real Amrod photographs: a charcoal/cyan golf-shirt team portrait, a navy shirt collar/pocket detail and a black/gold bottle-notebook-pen still life. Original files and catalogue records remain intact. Exact supplier URLs, dimensions and cropping are in `IMAGE_PROVENANCE.md`. No AI product imagery or generation request was needed.

- Main portrait stays top-aligned; removed its overscan/parallax and image zoom to preserve both faces. Existing reduced-motion-aware headline/frame intro remains, with route cleanup. No added dependency.
- Supporting frames use unequal desktop proportions, giving the gift still life enough room. Gift uses contain sizing to retain the complete bottle and pen, including at 1024px. Phone supporting frames are near-square after captions; shorter captions fit at 320px. Existing mobile actions stay above the photos.
- Generated AVIF/WebP widths 160/320/640/960/1280 for all three sources, explicit dimensions, lazy supporting images and eager/high-priority lead. Updated the homepage-only preload to match the displayed srcset. Team photo: **16,855 bytes at 640px AVIF; 34,468 bytes at 960px AVIF**.
- Restarted Vite before visual checks. Captured baseline and revised hero images in `docs/preview/hero-refresh/`; inspected 1440/1024/390/320px and captured 768/360/844px landscape too. Final captures use the production preview. Normal-motion phone captures at 320/390 supplement reduced-motion captures.
- Production checks: **7 viewport sizes**, 3/3 images loaded at each, no document overflow, no browser errors and no axe WCAG A/AA violations in the hero. Exactly one lead-image request at every width: preload and rendered picture do not download competing formats. Results: `docs/preview/hero-refresh/checks.json`.
- `pnpm typecheck`, `pnpm test` (**16/16**), `pnpm build`, `pnpm test:e2e` (**8/8**, desktop and touch mobile): pass. `git diff --check`: pass. Build retains the previously documented large-chunk advisory.
- New local production measurement, touch Chromium **390×844 / DPR2, 4× CPU, 1.6 Mbps down, 150ms latency**: **LCP 2.424s, CLS 0**, one 960px AVIF lead request (~34kB payload), no visible broken images, overflow or browser errors. Report: `docs/preview/hero-refresh/performance.json`. This is a local lab measurement, not a deployed Lighthouse or Safari result.
- WebKit/iOS remains unverified for the host-library reason recorded above. No new Safari claim. Existing noindex/demo behaviour and OG share composition are unchanged. Changes remain uncommitted; nothing was pushed or deployed.

## Homepage mobile pass — 21 October 2026 (Claude)

Brief: `docs/PROMPT_HOMEPAGE_MOBILE_PASS.md`. Baseline commit `9ce142a`, clean tree at start; mockup files' mtimes checked before editing `BrandPreview.tsx` (unchanged since that commit). No commit, push or deploy.

### What changed

Top demo bar removed (footer notice kept). New hero (one photo, one primary action, promises on a sewn label). `BrandTeaser.tsx` replaces the inline builder with a blue band; the builder lazy-loads into a Radix dialog. Occasion photo tiles. New section palette (no `bg-secondary` bands). Rail arrows hidden below 768px with a stitched progress thread. `BrandingMethods.tsx` pictograms. `TrustBand.tsx` (manifesto + 92% Facebook meter + founders + pull-quote + clamped cards); steps merged into the closing contact band. Screens before/after: `docs/preview/homepage-mobile-pass/`.

Page height, home: **390px 9,748 → 8,088**; **1440px 9,432 → 7,636**. Builder section on a phone: **1,953px → 422px** teaser.

### Checks actually run (final run is the last step)

- Per slice: Playwright Chromium screenshots at 390×844 and 360×800; 768 and 1440 for anything touching desktop. Each inspected and fixed before moving on (hero photo aspect at 768; teaser desktop spacing; occasion tile height; methods rule colours; trust desktop photo height).
- Horizontal overflow scan at 320/360/390/768/1024/1440: found and fixed a 564px phone layout caused by `sr-only` text inside a review card escaping the scroll row (cards are now `relative`). Final: no overflow at any width.
- Builder dialog (390, 360, 768, 1440): no builder module requested before opening; `aria-expanded` false → true → false; focus moves to Close on open, returns to the trigger after Escape; photo stays pinned under the dialog's title bar while controls scroll. "Add to my quote" inside the dialog opens the quote drawer over it on the first add (existing once-per-visit behaviour); Escape closes one layer at a time and the scroll lock clears. Production build: builder is its own **32 kB** chunk (11.4 kB gzip).
- Reduced motion (390): hero lines, label and teaser patch render in their final state immediately.
- Enlarged text: hero label at 200% root size wraps inside the photo width (fixed after review, see below).
- Final: `pnpm typecheck` pass; `pnpm test` **17/17** (new: every occasion image is in `image-manifest.json`); `pnpm build` pass (existing >500 kB chunk advisory unchanged); `pnpm check:presentation` **31 checks, 0 overflow, 0 axe WCAG A/AA violations** at 390 and 1440 on all routes; `pnpm test:e2e` **10/10** desktop + mobile (new test: banner gone, builder loads only on open, Escape/focus return, add to quote, no overflow); `git diff --check` pass.

### Codex review

Read-only `codex exec -s read-only` review of the uncommitted diff (a first `codex exec review --uncommitted` attempt failed on a CLI flag conflict and reviewed nothing). Two medium findings, both reproduced in reasoning and fixed:

1. `BrandPreview.tsx`: a logo still being read when the dialog closed was never released (blob URLs kept). Now released if the component has unmounted by the time reading finishes.
2. `index.css` `.hero-label`: non-wrapping two-column label clipped at 200% text. Now shrinks to the photo width and wraps.

### Not verified

- WebKit/iOS Safari (host libraries unavailable in WSL, as before): sticky pin inside a scrolling dialog and stacked drawer-over-dialog are Chromium-only results.
- Physical phone touch; emulation only.
- `MockupArtwork.tsx` fails `prettier --check` (not touched in this pass).

### Open: star ratings

Owner asked for stars. The only sourced figure is "92% recommend us on Facebook" (`business.facebookRating`), shown as a large figure with a stitched meter. `Testimonial.stars` (optional, 1–5) was added to `business.ts` but is **not rendered**; AGENTS.md forbids invented ratings. To show stars, the owner needs to supply each reviewer's actual rating (e.g. from their Facebook review).

## Brand palette pass — 21 October 2026 (Claude)

- Checked: `pnpm typecheck` OK; `pnpm test` 21/21 (adds 4 brand palette tests; a planted `#2ec4b6`, `rgb(14 22 29)` and `bg-signal`/`text-sky-400` were each caught, then removed); `pnpm check:presentation` 0 axe violations on every route, no overflow incl. 200% text; `pnpm test:e2e` 10/10 desktop and mobile.
- Visual: Home, Catalogue, Product, About, Quote and the logo builder inspected at 390 and 1440 px.
- Contrast: navy on white 14.0, white on Linton Blue 9.4, slate on white 7.2, slate on cloud 6.6. Blue on navy is 1.5, so blue is never placed on navy.
- Not checked: WebKit / a physical phone (unchanged limit).
