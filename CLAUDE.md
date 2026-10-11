# Claude development workflow

You are the primary implementation agent for the Linton Merch demo. Read `AGENTS.md` and the master prompt before changing code. Continue the supplied implementation; do not restart it from a blank template.

## Quick start

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Node 22.12+ is required. The `.nvmrc` and Netlify configuration use Node 22. The current lockfile was resolved with pnpm 11.25.0.

## Working loop

1. Read the current task plan and inspect the affected files. State the small slice being changed.
2. Make it work end-to-end: interactions, empty states, validation, accessibility and mobile presentation.
3. Run the checks relevant to that slice; fix failures before continuing.
4. Request a read-only Codex MCP review with the matching prompt in `docs/CODEX_REVIEW_PROMPTS.md`, scoped to the files and behaviour changed. Keep Claude as the only routine implementation owner.
5. Reproduce findings, fix material defects and verify them. Record actual checks and any unresolved issues in `docs/QA_REPORT.md`.
6. Update `docs/TASK_PLAN.md`. Finish with the working preview, commands run and any essential remaining business input.

Use judgement for routine reversible choices. Use placeholders instead of blocking on optional assets. Ask only for facts that are necessary to enable a real contact or replace an uncertain claim. The user wants momentum and a concise handoff.

## Architecture

`src/pages` contains the three screens. `Layout` owns navigation, the quote drawer and footer. `BasketContext` owns the small persisted basket. `ProductCard` and `ProductArtwork` own catalogue presentation. `ContactButton` owns WhatsApp preview/continuation. `quote.ts` owns safe restored data, quantity bounds, summaries and contact links. `src/components/ui` contains shadcn primitives.

## Current handoff

The initial implementation is already present. First run it, review `docs/QA_REPORT.md`, and inspect desktop/mobile views. Your next useful work is refinement and replacement of confirmed client assets, not speculative feature expansion. Keep sample/demo notices until the owner explicitly changes the release scope.

## Codex MCP

Use the owner's existing connected Codex reviewer if available. `docs/CLAUDE_CODEX_SETUP.md` explains optional configuration and version limitations. Do not overwrite user-level MCP settings, credentials or other servers. Do not claim a review occurred if it did not.
