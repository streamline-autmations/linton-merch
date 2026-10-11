# Codex MCP review prompts

Claude stays the implementation owner. Use the existing Codex MCP connection, inspect the tool schema, and give the reviewer this project's actual absolute path. Set read-only sandboxing if the connected tool supports it. Do not assume a model name, tool alias or session field. Reuse a review session only through a continuation tool it actually exposes.

## Catalogue and basket review

Review this project read-only. Read AGENTS.md, CLAUDE.md and the master prompt. Focus on src/data/products.ts, Catalogue.tsx, ProductCard.tsx, BasketContext.tsx, BasketItems.tsx and quote.ts. Look for wrong search/category state, duplicate products, inconsistent quantities, unsafe restored storage, broken refresh/navigation, inaccessible product details or drawers, and mobile clipping. Verify sample product claims stay clearly illustrative. Report only actionable defects with severity, file/line, reproduction and smallest fix. Do not edit files, add features, access sources outside the project or touch the live website. Mention which behaviours you could not verify.

## RFQ review

Review read-only. Focus on Quote.tsx, BasketItems.tsx, ContactButton.tsx, quote.ts and the browser tests. Walk from multiple selected products through quantities/preferences, brief, native contact validation, review, edit/back actions and local completion. Check the summary includes each product accurately, no enquiry is falsely reported sent, file inputs are filename-only, contact details never enter persistent storage, optional date constraints are sound, and WhatsApp never targets an invented number. Examine empty/removal states, clipboard failure, keyboard focus and mobile usability. Report concrete defects with severity and reproduction; suggest minimal changes. Do not edit or submit any real enquiry.

## Final readiness review

Review read-only for this separate Netlify demo, not production. Inspect config, lockfile, build output assumptions, redirect/header files, accessibility, responsive views and demo copy. Check direct navigation to /catalogue and /quote on a static host, noindex behaviour, no secrets in public variables, missing assets, console errors and unknown-route recovery. Compare the implementation to docs/MASTER_BUILD_PROMPT.md and the QA report. Distinguish blockers from optional polish. Do not deploy, change DNS or modify files. Return findings ordered by severity, and identify tests or checks you actually ran.

## Targeted support prompt

Investigate this specific reproducible issue read-only: [symptom, steps, expected/actual result]. The affected files are [paths]. Return the most likely cause and a minimal patch suggestion. Do not change code or broaden scope. Claude will apply and verify the fix.
