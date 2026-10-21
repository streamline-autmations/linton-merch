# Prompt: homepage mobile pass (for Opus, high effort)

Paste everything below the line into a fresh Opus session opened in `linton-merch-demo/`.

---

You are continuing work on the Linton Merch homepage (`src/pages/Home.tsx`). The owner has reviewed it on a phone and wants a redesign pass on eight sections. Most changes are mobile-led, and anything that touches desktop must not regress it.

## Read first
`CLAUDE.md`, `AGENTS.md`, `docs/DESIGN_SYSTEM.md`, `docs/IMAGE_PROVENANCE.md`, and the theme tokens at the top of `src/index.css`. Load the `frontend-design` and `ui-ux-pro-max` skills before writing UI code. If `design-director` is available, run it first.

## What good looks like
A phone visitor should know within one screen what Linton does and how to get a quote. They should be able to scroll the page without being trapped by any single section. Each section should look different from the last, in colour and in shape, while still reading as one brand. Right now it reads as a long run of text blocks with the same spacing, and the owner scrolls past most of it without stopping.

Your standard is a distinctive, professional South African B2B supplier site. It is not a Shopify template and not generic generated UI. Keep the stitch motif as the single signature motion; everything else stays restrained.

## The changes, in page order

1. **Top demo banner.** Remove the "Concept demo / Range to be confirmed / No enquiries sent" bar from `Layout.tsx`. Leave the footer notice alone, because the owner only asked about the top bar. Check that nothing depends on the banner's height (sticky header offset, scroll anchors, e2e tests, `scripts/check-presentation.mjs`).

2. **Hero.** It is too busy and does not feel like a confident first screen. On a phone it currently stacks an eyebrow, a headline, a paragraph, two buttons, a big photo, two more photos and a promises list. Rework it so the first screen says what we do and how we help, with one primary action. Starting hypothesis, to override if you find better: a plain-language headline and one sentence (supplied and branded in-house, delivered nationwide), one strong image, a single primary "Request a quote" button with the catalogue as a quiet text link, and the four promises as one compact line. Before building, write 2–3 genuinely different hero concepts in a few lines each, pick one, say why, then build it. Do not wait for approval. Use only claims that already exist in `src/data/business.ts`.

3. **"Put your logo on it" (`BrandPreview.tsx`).** It is too big and hard to scroll past. Make it a compact teaser that only opens when tapped, as an inline disclosure, a sheet or a dialog (`components/ui` has both). Pick what works best on mobile, and handle focus, Escape, `aria-expanded` and reduced motion properly. The heavy parts (mockup stage, upload) should not load or run until it is opened. Keep the existing privacy rule: the visitor's logo is read in the browser only and never stored or sent. Other tools have edited the mockup files while the owner works. Check mtimes before editing, and keep your edits inside `BrandPreview.tsx` unless you must go further. Do not rewrite `MockupStage.tsx`, `MockupArtwork.tsx` or the `mockup*.ts` files.

4. **Shop by occasion.** It is text-heavy and the owner does not like how it looks. Give it imagery or a different structure. If you use images, take them from the existing real product and gift photos in `public/products` and `public/gifts` (one chosen per occasion, stored on the `occasions` data in `products.ts`). Do not generate or invent imagery. Make sure new image paths go through the `ResponsiveImage` pipeline (`pnpm images:prepare`, `image-manifest.json`). Text over a photo needs real contrast.

5. **Section colours and product rails (Gift sets, Popular picks).** The pale blue-grey `bg-secondary` background is ugly and is used on several sections, including the gift sets and the "One request" steps. Replace it with a deliberate palette drawn from the existing tokens (`ink`, `brand-blue #004298`, `brand-teal #029b97`, `signal #2ec4b6`, plus the off-white), so the page alternates light, dark and one or two saturated bands. Keep the idea of colour-blocked sections; fix the colours. Product photos have white backgrounds, so cards stay white on coloured bands. Check contrast. Also remove the prev/next arrow buttons from `ProductRail.tsx` on mobile. Replace them with something better, such as a visible peek of the next card with a progress indicator. Apply this to both rails.

6. **Ways to brand.** It is a plain list. Make it feel designed and give each of the six methods an identity. Choose between drawn pictograms in the stitch/line language, tiny swatches, or real product examples. Avoid generic icon-in-a-circle tiles. Keep the existing method names and "best for" copy, which comes from lintonent.co.za.

7. **Trust section ("In their words").** This needs the biggest upgrade. Today it is a huge scrubbed quote followed by a wall of smaller quotes. Make it short and quick to take in: one headline social-proof element, one short pull-quote, the rest as compact cards, and "Read more" on anything longer than about two lines. Break it up with colour and imagery (there is a founders photo in `public/story`). Do not use client logos or invented avatars; initials are fine. **Stars:** the owner wants star ratings, but the only sourced figure is "92% recommend us on Facebook" (`business.facebookRating`). Do not invent per-review star counts, since `AGENTS.md` forbids fake ratings. Show the real recommend figure in a strong visual treatment. If you add an optional `stars` field to the testimonial data, leave it unrendered until a value is sourced, and flag it in your handoff. The "How we work" milestone strip just above can be folded into this band if that shortens the page.

## Out of scope
- The brand-logo wall (`BrandWall.tsx`). The owner is supplying real Barron, Pro-Active and Rolando logos separately. This is tracked in TaskHub.
- Catalogue, product, quote and About pages.
- Fake prices, certifications, logos, testimonials or delivery promises. Colours and fonts come from the existing system; do not introduce a new font family.

## Working method
- Work through the eight items as small slices in the order above. After each slice, screenshot the real rendered result at 390×844 and 360×800. Check 768 and 1440 for anything that touches desktop. Look at the screenshots and fix what is wrong before moving on.
- Use Playwright with Chromium. Node 22 and pnpm are in `~/.local/node22/bin`. A dev server may already be running on port 5173, so reuse it rather than starting a second one. Another tool may be editing the same working tree, so if something fails, check mtimes and group typecheck errors by file before assuming it is your change.
- Keep accessibility intact: keyboard use, visible focus, tap targets of at least 44px, and `prefers-reduced-motion`.
- Do not stop to ask me things you can decide. Make the call, and list your decisions at the end.

## Done means
`pnpm typecheck`, `pnpm test` and `pnpm check:presentation` pass. `pnpm test:e2e` also passes (update any test that asserted the banner). Re-run the full suite as the last step. Update `docs/TASK_PLAN.md` and `docs/QA_REPORT.md` with what you actually ran. Then give a short handoff: what changed per section, the design decisions you made, anything you could not verify, and the open stars question. Request a read-only Codex review of the diff if Codex is connected; do not claim one happened if it did not.
