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
- [ ] Replace placeholder favicon with a logo-derived one.
- [ ] Codex review (read-only) of the redesign.

## Real content pass (11 Oct 2026)

- [x] 56 real products with supplier photography (clothing, workwear, promo, marketing items) and 25 gift sets.
- [x] Fifth category: Gift sets. Shop-by-occasion filter (`?occasion=`), searchable colours and branding methods.
- [x] Product details: photo gallery, colour range, sizes, usual branding method.
- [x] Home rebuilt: real-photo hero triptych, milestones strip, category rows with photo peek, "Put your name on it" live branding preview, occasions grid, gift-set rail, ways to brand, verbatim testimonials from lintonent.co.za.
- [x] About: founders photo, mission, Google Maps link, Facebook/Instagram.
- [x] Accent moved from lime to Linton logo teal.
- [x] Vite polling watch under WSL so hot reload works on /mnt/c.
- [ ] Phase 2: smooth scroll animations / premium motion (owner request, next session).
- [ ] Carry the "Put your name on it" company name into the quote brief.
- [ ] Logo-derived favicon; vector logo.

## Client refinement — intentionally deferred

- [ ] Replace text wordmark with approved logo, if supplied.
- [ ] Confirm exact public name and real contact recipient.
- [ ] Replace samples with approved product names, supplier facts and licensed images.
- [ ] Confirm whether branding customer-supplied garments is offered.
- [ ] Publish a separate Netlify demo when requested and account access is available.

## Suggested Claude slices

1. Run and review the existing demo; resolve any recorded defects.
2. Integrate approved logo/contact/category facts without adding pages.
3. Review catalogue/basket and RFQ with Codex MCP; make bounded fixes.
4. Refresh the Netlify build and walk the client through the selection-to-brief story.

Keep production capabilities out of this MVP. A real enquiry receiver, privacy wording, spam protection and file upload need a separately agreed production scope.
