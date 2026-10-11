# Linton Merch demo — agent contract

## Ownership and purpose

Claude is the primary implementation agent. Codex MCP is a read-only reviewer and bounded technical support agent. The initial scaffold was created in Codex because a runnable Claude agent was not available in the setup session. Do not claim Claude implemented or reviewed work unless it actually did.

This is a fast, polished sales demonstration for a potential South African client. Help the owner show a simpler customer journey, not a finished commerce system. Work inside this project folder. Parent `sources/` and all synced reference files are read-only. Never change the live website, production DNS, existing hosting or existing contact channels.

## Read first

1. `CLAUDE.md`
2. `docs/MASTER_BUILD_PROMPT.md`
3. `docs/TASK_PLAN.md`
4. `docs/DESIGN_SYSTEM.md`
5. `docs/CONTENT_AND_ASSETS.md`

## Scope

- React, Vite, strict TypeScript, Tailwind v4, locally owned shadcn/ui primitives.
- Four routes: `/`, `/catalogue`, `/quote` and `/about` (About & contact, added at the owner's request). Unknown routes show a simple recovery state.
- 12–18 illustrative catalogue products; current seed has 16, grouped like the current Linton Enterprises site. Search, categories, details and add-to-quote.
- Persistent product basket: IDs, quantities and product preferences only. Never persist RFQ contact details or artwork in localStorage.
- Structured brief, contact, review, and honest local demo completion. Copy/download a summary.
- WhatsApp preview when unconfigured; only a confirmed number enables a `wa.me` link. Never invent a recipient.
- Static Netlify deploy. No backend, payment, login, chatbot, CMS, analytics or genuine uploads.

## Implementation rules

- Preserve existing working flows; improve in small, reviewable slices.
- Reuse `src/components/ui`; they are sourced from the official shadcn registry. Prefer Radix for modal focus and dismissal.
- Product data belongs in `src/data/products.ts`; quote rules in `src/lib/quote.ts`; design variables in `src/index.css`.
- Use the pnpm lockfile; do not introduce a competing lockfile or change package managers without need.
- The CSS theme is the canonical design-token source. Keep the documentation snapshot in sync.
- No fake prices, certifications, client logos, testimonials, delivery promises or inventory claims.
- Business facts (address, phone, email, hours, history) live only in `src/data/business.ts`, sourced from lintonent.co.za and the owner. Do not use the live site's photos of other companies' work or name those clients without the client's permission.
- Label sample catalogue entries and generated/illustrative artwork. Customer-supplied garment branding remains an unanswered business question.
- Do not call a local mock request "sent", "received" or "submitted to Linton".
- Respect reduced motion; support keyboard navigation, visible focus, descriptive labels and mobile layouts.
- Contact fields live in memory. Files are filename previews only and are never read/uploaded.
- Environment variables beginning `VITE_` are public. Do not place secrets in them.

## Validation and review

Run `pnpm typecheck`, `pnpm test`, `pnpm build`, and relevant browser checks after meaningful flow changes. `pnpm test:e2e` covers desktop and mobile RFQ journeys. Inspect the design at approximately 390px and 1440px; check 320px and enlarged text for clipping. Avoid tests that just mirror styling or component structure.

Ask Codex MCP for a read-only review at the catalogue/basket milestone, RFQ milestone and final readiness milestone using `docs/CODEX_REVIEW_PROMPTS.md`. Inspect its actual advertised tool schema before calling; do not assume a tool name or unsupported setting. Have it report concrete reproducible defects with severity and file/line references. Claude decides and implements fixes, then reruns the affected checks. If MCP is unavailable, record that fact and continue with local verification.

Do not deploy to a live company domain. A separate Netlify demo URL can be used when the owner requests publication and account access exists. Complete the preview and build before requesting any missing deployment access.
