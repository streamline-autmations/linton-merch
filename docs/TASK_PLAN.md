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
- [ ] Optimise hero image (WebP/AVIF) or move imagery to Cloudinary (owner plans this).
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
