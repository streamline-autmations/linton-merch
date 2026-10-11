# Master build prompt — paste into Claude

You are my primary implementation agent. Continue the Linton Merch MVP demo in this folder. Codex MCP is your reviewer/support agent; use it for bounded read-only architecture, interaction, accessibility and deploy-readiness reviews. Read `CLAUDE.md`, `AGENTS.md`, the task plan, design system, asset checklist and QA report first. Inspect the current implementation before making changes. This project already has an initial working demo; do not rebuild it unnecessarily.

## Outcome

Create a polished, modern minimalist, three-page demo that I can show a potential client as evidence of what I could do for her business. The business context is Linton Merch / Linton Enterprises, South Africa: corporate clothing, workwear, promotional merchandise and corporate gifts. Her existing site feels bloated and hard to navigate. She likes a modern minimal feel. The demo should feel considered, useful and commercially credible within a small time budget. Do not modify, scrape-and-republish or deploy over the live website.

## Stack and maintenance

Use React + Vite + TypeScript, Tailwind CSS and shadcn/ui. Keep the frontend static and Netlify deployable. Use the existing pnpm lockfile. Prefer a small local data module and React context over a state library or backend. Use real route navigation with a Netlify SPA fallback. Do not add a chatbot, payments, accounts, production backend, complicated CMS, working file uploads or analytics.

## Visual direction

Understated corporate merchandise editorial: charcoal ink, clean white/cool light surfaces, a restrained acid-yellow accent, generous spacing and large carefully spaced type. The collection should feel curated rather than like an endless supplier directory. Avoid card clutter, gratuitous motion, generic gradients, decorative feature grids, stock trust badges and fake testimonials. Use the existing generated concept photo, visibly labelled, until I supply approved real imagery. The text-based logo is a placeholder and must not be represented as an approved brand identity.

## Page 1: Home (`/`)

- Clear logo/wordmark, only Home, Catalogue, Request a quote in navigation; quote count visible.
- Elegant editorial hero that immediately explains the offering and leads to catalogue or quote.
- Four collection entry points: corporate clothing, workwear, promotional merchandise, corporate gifts.
- Four illustrative featured products with functional add-to-quote.
- A compact explanation of select → brief → review.
- WhatsApp entry point and simple footer. Avoid adding separate About, Services, FAQ and category pages.
- Use short, honest copy; no unverified capability promises, turnaround times or invented brand proof.

## Page 2: Catalogue (`/catalogue`)

- Seed 12–18 example items (currently 16, four per category), clearly marked as samples.
- Search by name, category, ID and colour; category filtering and a simple name/curated sort.
- Clear results count and a helpful empty state with filter reset.
- Cards show name, category, sample artwork and add-to-quote. No invented prices or "in stock" badges.
- A small accessible product-detail modal can show illustrative sizes, colours and possible branding with a confirmation caveat; it is not a fourth page.
- URL state should preserve search/category links and make homepage category links meaningful.

## Quote basket

- Support multiple different products. Adding one twice must not silently create duplicates.
- Show selected products in an accessible drawer with quantity controls and remove/clear actions.
- Default 25 units is a sample starting point, not a stated minimum order.
- Validate finite integer quantities from 1 to 10,000; recover from corrupted, stale or blocked browser storage.
- Persist only product selection and product preferences in localStorage. Contact details and files stay out of it.
- Preserve the basket across routes and refresh. Make the empty state useful.

## Page 3: Request a quote (`/quote`)

- Empty basket encourages catalogue selection and allows a conversation entry point.
- Structured steps: project brief, contact details, review.
- Selected products remain visible and editable: quantities plus free-text colours/size breakdown/preferences for each item.
- Brief: preferred branding method or "please advise", optional target date, notes, and optional artwork filename preview.
- Files must not be read/uploaded/stored. Explain that only the filename is shown and not attached.
- Contact: required name, company, email, delivery city/province; optional phone. Use proper input labels and native email/required validation. Encourage invented details for testing.
- Review shows contact and brief accurately, offers edit actions and requires acknowledgment of demo status.
- "Create demo request" produces an honest local completion state: nothing was sent to Linton.
- Let the user copy or download a plain-text summary covering every selected product, quantity, preferences, brief and contact field.
- No network submission or Netlify Forms detection. Copy failures have a manual/selectable fallback.
- Do not imply delivery dates, branding suitability or orders are confirmed.

## WhatsApp

All entry points use a common preview component. With no confirmed number, show a safe contact preview with copyable text and no external destination. With a confirmed South African number in `VITE_WHATSAPP_NUMBER`, generate a properly encoded `wa.me` link. Preview the text before continuing; the person presses Send in WhatsApp. The RFQ summary can be offered after local completion. Never invent a contact number or auto-send anything.

## Content truth

The four business categories come from my brief. Sample product identities and specs are inventions, not audited inventory. Branding customer-supplied clothing has not been confirmed; do not promise it. Do not invent certifications, B-BBEE status, supplier agreements, customer logos, reviews, response times, stock, prices or minimum orders. Mark demo and concept imagery consistently. Keep the demo out of indexing via metadata, robots and Netlify headers; these are not access controls.

## Quality and delivery

- Mobile-first responsive views at 390px, desktop at 1440px; spot-check 320px and 200% text zoom.
- Keyboard-operable navigation, focus-visible controls, labelled inputs, accessible Radix dialogs, focus restoration and step announcements, readable contrast and reduced motion support.
- No horizontal scrolling, misleading buttons, broken images or console errors.
- `pnpm typecheck`, `pnpm test`, `pnpm build`; run the Playwright desktop/mobile journeys after flow changes.
- Keep documentation accurate: README, task plan, design system, asset checklist, QA report and Netlify instructions.
- Request Codex MCP reviews after catalogue/basket, RFQ and final readiness; provide concrete files and behaviour. Fix reproducible issues, avoid rewriting everything based on subjective suggestions.
- If a connected reviewer is unavailable, state that and use local checks. Do not configure unsupported commands or claim tools ran when they did not.
- Prepare a fresh `dist/` and a deployable archive for a separate Netlify demo. Do not publish over the client domain or claim a public URL exists before deployment.

## Start now

Assess the current implementation, identify the smallest meaningful improvement, and begin. Use safe placeholders for missing assets. If a business fact is uncertain, document it and avoid making the claim. At handoff give me the preview, what works, what was tested and only the essential client inputs I still need to supply.
