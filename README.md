# Linton Merch — concept demo

A modern website pitch: **Home → Catalogue → Request a quote**, plus **About & contact**. Built with React, Vite, TypeScript, Tailwind CSS v4 and shadcn/ui. Static; the demo is live at https://linton-merch.vercel.app (Vercel, auto-deploys from `main`; `vercel.json` holds the SPA rewrite and noindex headers). `netlify.toml` and `docs/NETLIFY_DEPLOY.md` remain as an alternative host.

All 16 catalogue items, sizes, colours and branding options are illustrative. The hero is labelled AI concept photography. The logo, contact details and company story come from the public Linton Enterprises website (to be confirmed by the client). There are no prices, stock promises, payments, backend, real uploads or automatic enquiry submissions.

## Run

Node 22.12+ and pnpm are required. On this WSL machine: `export PATH=$HOME/.local/node22/bin:$PATH`. The Vite dev server does not see file edits on `/mnt/c`; restart it before visual checks.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed in the terminal. Build with `pnpm build`; preview the static output with `pnpm preview`.

## What works

- Focused homepage and four category entry points.
- Searchable/filterable catalogue, product detail dialogs and curated/name sorting.
- Multi-product quote drawer; quantity editing; remove/clear; selection survives refresh.
- Structured brief, contact and review; per-product sizes/colour notes; filename-only artwork preview.
- Honest local completion with copy/download summary.
- WhatsApp contact preview; a confirmed `VITE_WHATSAPP_NUMBER` enables a real prefilled link.
- Responsive navigation, keyboard-friendly dialogs, reduced motion and noindex demo configuration.

Only product selection/preferences are stored locally. Contact details stay in memory. Clipboard/download actions include the details entered, so use invented data during testing.

## Claude handoff

Open this folder in Claude and give it [the master build prompt](docs/MASTER_BUILD_PROMPT.md). [CLAUDE.md](CLAUDE.md) defines its development loop; [AGENTS.md](AGENTS.md) defines scope. The starter was implemented in Codex because Claude was not available as a runnable agent here. [Codex review prompts](docs/CODEX_REVIEW_PROMPTS.md) and [MCP setup notes](docs/CLAUDE_CODEX_SETUP.md) keep Claude primary and Codex review/support.

## Verify

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

For an existing local Chrome/Edge instead of a browser download, set `E2E_BROWSER_PATH` to its executable before running the browser tests. See [the QA report](docs/QA_REPORT.md) for actual results and limitations.

With `pnpm dev` running at port 5173, `pnpm check:presentation` checks responsive widths and the stated accessibility page states; `pnpm screenshots` refreshes the preview images. `pnpm format` keeps source and docs consistently formatted.

## Maintain

| Change                 | File                             |
| ---------------------- | -------------------------------- |
| Product examples       | `src/data/products.ts`           |
| Theme/tokens           | `src/index.css`                  |
| Homepage content       | `src/pages/Home.tsx`             |
| Address, phone, story  | `src/data/business.ts`           |
| About & contact page   | `src/pages/About.tsx`            |
| Client assets inbox    | `assets-inbox/` (not deployed)   |
| Logo/navigation/footer | `src/components/Layout.tsx`      |
| Quote rules / summary  | `src/lib/quote.ts`               |
| WhatsApp recipient     | `.env` or the host's build variable (Vercel/Netlify) |

[Client assets and unanswered facts](docs/CONTENT_AND_ASSETS.md) explain what to supply. [Netlify instructions](docs/NETLIFY_DEPLOY.md) cover manual and Git-based deployment. [Task plan](docs/TASK_PLAN.md) records the next Claude slices. The live company website was not modified.
