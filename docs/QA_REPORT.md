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
