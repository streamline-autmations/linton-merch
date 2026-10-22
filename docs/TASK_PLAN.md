# MVP task plan

## Completed foundation

- [x] Isolated project folder; preserve parent synced reference material.
- [x] React/Vite/TypeScript/Tailwind setup and lockfile.
- [x] Official shadcn source primitives, Radix dialogs and quote drawer.
- [x] Design tokens, local font and restrained responsive design.
- [x] Agent contracts, master prompt and Claude/Codex handoff instructions.

## Implemented customer journey

- [x] Home with category navigation, featured samples and contact entry point.
- [x] Catalogue: 16 labelled examples, URL search/category state, sort, details, empty/reset states.
- [x] Multi-product basket with quantities, remove/clear and browser persistence.
- [x] RFQ brief/contact/review with product preferences and native validation.
- [x] Local completion, copy/download summary and artwork filename preview.
- [x] Safe WhatsApp preview and confirmed-number configuration hook.
- [x] Netlify config, SPA routes and demo noindex files.

## Validation

- [x] TypeScript check and production build.
- [x] Unit tests for restored data, quantity bounds, summary and contact links.
- [x] Complete desktop/mobile browser journeys and visual inspection. See QA report for actual final results.
- [ ] Independent Codex MCP review from Claude (not available in the initial setup session).

## Redesign pass (9 Oct 2026)

- [x] Node 22 + pnpm in WSL; dependencies reinstalled.
- [x] Client logo, ink/paper/signal tokens, Host Grotesk + Satoshi, duotone treatment.
- [x] Home rebuilt; categories follow the live site; products renamed to match.
- [x] About & contact page with real details and a local-only demo message form.
- [x] Drawer signature motion; mobile review bar; sticky scrolling category chips.
- [x] Optimise hero image (local AVIF/WebP srcsets, completed 21 Oct 2026).
- [ ] Quote page polish: styled artwork picker, sticky mobile summary.
- [x] Replace placeholder favicon with a logo-derived one.
- [ ] Codex review (read-only) of the redesign.

## Real content pass (11 Oct 2026)

- [x] 56 real products with supplier photography (clothing, workwear, promo, marketing items) and 25 gift sets.
- [x] Fifth category: Gift sets. Shop-by-occasion filter (`?occasion=`), searchable colours and branding methods.
- [x] Product details: photo gallery, colour range, sizes, usual branding method.
- [x] Home rebuilt: real-photo hero triptych, milestones strip, category rows with photo peek, "Put your name on it" live branding preview, occasions grid, gift-set rail, ways to brand, verbatim testimonials from lintonent.co.za.
- [x] About: founders photo, mission, Google Maps link, Facebook/Instagram.
- [x] Accent moved from lime to Linton logo teal.
- [x] Vite polling watch under WSL so hot reload works on /mnt/c.
- [x] Phase 2: motion layer — Lenis smooth scroll, stitched scroll thread and seams, hide-on-scroll header, hero intro + parallax, reading reveal, gift-rail arrows, page transitions (see DESIGN_SYSTEM.md).
- [x] Carry the "Put your name on it" company name into the quote brief (sessionStorage, prefills Company).
- [x] Logo-derived favicon (32/48 px), apple-touch icon and 512 px icon from the UE monogram.
- [x] "Put your logo on it" (21 Oct 2026): logo upload with background cut-out, drag/resize, thread/ink colours, positions, and PNG download for golf shirt, cap, bottle and tote.
- [x] Golf shirt brought up to the African Nomad builder: 3 colours × 3 views, 6 positions at once, mm sizes, branding method per position, positions carried into the quote line.
- [ ] Same treatment for cap, bottle and tote (needs per-colour/per-view photos).
- [ ] Vector logo (needs a source file from the client).
- [x] Deployed to Vercel: https://linton-merch.vercel.app (auto-deploy from main).

## Simplify pass (21 Oct 2026)

- [x] Copy cut on every page, mobile first (see QA report for before/after).
- [x] "Brands we supply" logo wall: 7 real logos, 3 wordmarks pending files.
- [x] Product page per product: `/product/:slug`, gallery, facts, quantity + add, related rail, meta, back restores catalogue view; e2e coverage.
- [x] Quote flow 3 → 2 steps; optional extras folded away.
- [x] Mobile: 44 px targets, bottom-sheet drawer, sticky add bar, safe areas, 320 px header.
- [ ] Codex read-only review of this pass (blocked by Codex usage limit on 21 Oct; rerun).
- [ ] Logo files for Barron, Pro-Active, Rolando; sharper Altitude and Elevate.
- [ ] "Put your logo on it" mobile length and tap targets (owned by the mockup work in progress).

## Client refinement — intentionally deferred

- [ ] Replace text wordmark with approved logo, if supplied.
- [ ] Confirm exact public name and real contact recipient.
- [ ] Replace samples with approved product names, supplier facts and licensed images.
- [ ] Confirm whether branding customer-supplied garments is offered.
- [ ] Publish a separate Netlify demo when requested and account access is available.

## Suggested Claude slices

1. Run and review the existing demo; resolve any recorded defects.
2. Integrate approved logo/contact/category facts. Product pages are now in scope; avoid other new pages.
3. Review catalogue/basket and RFQ with Codex MCP; make bounded fixes.
4. Refresh the Netlify build and walk the client through the selection-to-brief story.

Keep production capabilities out of this MVP. A real enquiry receiver, privacy wording, spam protection and file upload need a separately agreed production scope.

## Production visual finishing — 21 October 2026 (Codex)

- [x] Audit initial product/gift/hero/About imagery before bulk changes; record file issues and source corrections in `IMAGE_PROVENANCE.md`.
- [x] Replace three collage/model primaries with matching no-logo pack shots; normalise chef-jacket framing; restore larger founders original; preserve complete gift compositions.
- [x] Generate and verify AVIF/WebP srcsets and intrinsic dimensions for 122 source assets; optimise logo and hero delivery; retain originals/provenance.
- [x] Align desktop hero and move mobile actions above imagery; refine cards, galleries, empty/search states, focus, target sizes and drawer/dialog motion.
- [x] Add restrained catalogue reflow, stitched builder frame and About photo reveal; use transform zoom; verify reduced-motion cleanup.
- [x] Add static branded OG/Twitter share image; retain logo-derived icons, noindex, page titles and 404 recovery.
- [x] Typecheck, 16 unit tests, build and 8 desktop/mobile e2e journeys pass; production screenshot/a11y/overflow checks and throttled mobile/Lighthouse measurements recorded in QA report.
- [ ] Safari/iOS rendering: WebKit downloaded, host dependencies unavailable in WSL. No Safari result claimed.
- [ ] Owner assets: sharper real founders portrait; higher-resolution Altitude/Elevate and approved Barron/Pro-Active/Rolando logos. No generated substitute required.

The current pass adds no routes and preserves the product pages and expanded builder that were already present on resumption. Changes from this pass are left for owner review; no commit or push was run.

## Hero photography refinement — 21 October 2026 (Codex)

- [x] Find sharper real supplier originals and record source/crop details.
- [x] Replace the homepage image trio with coordinated corporate clothing, shirt detail and executive gifting; preserve existing catalogue assets.
- [x] Adjust desktop/mobile frames and remove face-clipping photo drift/zoom; retain the existing frame/type intro and reduced-motion handling.
- [x] Deliver responsive AVIF/WebP, intrinsic dimensions and a matching high-priority preload; supporting images stay lazy.
- [x] Inspect revised hero at 1440/1024/390/320px; capture tablet, 360px and landscape too; verify no overflow, broken images, accessibility violations or duplicate lead requests.
- [x] Typecheck, 16 unit tests, production build and 8 e2e tests pass; new throttled mobile measurement records LCP 2.424s and CLS 0.

Review captures and reports: `docs/preview/hero-refresh/`. No generated product photographs, new categories, commits, pushes or deployments.

## Homepage mobile pass — 21 October 2026 (Claude)

Owner reviewed Home on a phone. Brief: `docs/PROMPT_HOMEPAGE_MOBILE_PASS.md`.

- [x] Top demo banner removed from `Layout.tsx` (footer notice kept). Nothing depended on its height; e2e now asserts it is gone and the footer notice remains.
- [x] Hero: plain headline, one sentence, one primary action (Request a quote) with the catalogue as a text link, one photo; the four promises sit on a sewn "woven label" on the photo edge. Fits one 390×844 / 360×800 screen.
- [x] "Put your logo on it" → `BrandTeaser.tsx`: compact blue band with a shirt sketch; the builder opens in a Radix dialog (bottom sheet on phones), lazy-loaded (separate 32 kB chunk), unmounts on close so any logo is released. `BrandPreview.tsx` only gained an `embedded` layout prop.
- [x] Shop by occasion: one real catalogue photo per occasion (`occasions[].image/focus` in `products.ts`, all already in `image-manifest.json`; unit test enforces it), label on an ink fade.
- [x] Section palette: ink / paper / white / brand-blue / paper / ink (gift sets, white cards) / paper / brand-teal (ways to brand) / white (trust) / ink (closing). `bg-secondary` no longer used as a section background on Home.
- [x] Rails: prev/next arrows hidden below 768px; next card peeks; stitched progress thread (`RailProgress`) under both rails and the review row.
- [x] Ways to brand → `BrandingMethods.tsx`: six drawn line pictograms, method names and "best for" copy unchanged.
- [x] Trust → `TrustBand.tsx`: "Service is our actual business." (manifesto folded in), 92% Facebook figure as a stitched meter, founders photo, milestones, one pull-quote, four compact cards with "Read more" when longer than two lines. "One request" steps merged into the ink closing band with contact.
- [ ] **Stars (open):** `Testimonial.stars` exists but is unrendered. Needs a sourced per-review rating (e.g. from the reviewers' Facebook reviews) before it can be shown.
- [ ] WebKit/iOS check of the builder dialog (sticky pin inside a scrolling dialog, drawer stacking) — not possible in this WSL host.

## Brand guidelines and palette reduction (21 Oct 2026, Claude)

- [x] `docs/BRAND_GUIDELINES.md`: colour, type and logo rules (owner: "too many colours").
- [x] Palette cut to navy `#0B2A5B` + white (main), Linton Blue `#004298` (accent, actions only), Linton Teal `#029B97` (thread only), plus cloud/line/slate neutrals. Retired the aqua signal, near-black ink, paper and grey-green.
- [x] Buttons on navy and on the blue band are white; main buttons elsewhere are Linton Blue. Ways to brand moved from a teal band to cloud.
- [x] `src/brand.test.ts` fails on any hex, rgb tint or Tailwind palette class outside the guide.
- [ ] Owner to confirm the navy and the blue band before the next pass on the remaining issues.

## Photos, footer and spacing (22 Oct 2026, Claude)

- [x] Notebook, pen & bottle set uses the white-background photos.
- [x] 20 more products get a second (hover) photo from the supplier; 35 still have none (no suitable same-colour photo, or single-photo gift sets).
- [x] Phones: the second photo shows on its own after a moment in view, then returns.
- [x] Footer split into ruled bands; Facebook and Instagram icons added beside WhatsApp.
- [x] "Put your logo on it" (and all section titles) get looser word spacing on phones.
