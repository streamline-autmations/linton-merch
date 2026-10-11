# Start here in Claude

Open the `linton-merch-demo` folder or extract the source archive, then start a Claude Code session in it. Paste this:

```text
Read CLAUDE.md, AGENTS.md, docs/MASTER_BUILD_PROMPT.md and docs/QA_REPORT.md.
You are the primary implementation agent. Continue the supplied Linton Merch demo;
do not start over. Run it locally and assess the existing customer journey.
Use our existing Codex MCP for bounded read-only review if available, following
docs/CODEX_REVIEW_PROMPTS.md. Keep the scope to Home, Catalogue and Request a quote.
Use safe placeholders until I supply approved client assets and a confirmed
WhatsApp number. Do not modify or deploy over the live company website.
Begin with the smallest useful refinement and show me the working result.
```

The detailed prompt is already in the project, so there is no need to paste every file into Claude. The task plan and QA report explain what is complete and what still needs real client facts or external account access.
