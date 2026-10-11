# Claude primary / Codex reviewer setup

## Start Claude

Open **this project folder**, `linton-merch-demo`, in your existing Claude development environment. Start a local Claude Code session (or open the folder in its IDE integration) and paste `docs/MASTER_BUILD_PROMPT.md`. `CLAUDE.md` supplies ongoing context. You can also paste: "Read CLAUDE.md and docs/MASTER_BUILD_PROMPT.md, then continue the existing demo."

Claude was not installed as a runnable command in the initial Codex session, so the starter was implemented here. No Claude authentication or global settings were changed.

## Use your existing Codex MCP

If your Claude environment already has Codex MCP support, keep it. Check `/mcp`, inspect its available tool schema and perform a small read-only review with this project's absolute path. Use the prompts in `CODEX_REVIEW_PROMPTS.md`. A documentation-only MCP is not a Codex code reviewer.

OpenAI documents Codex CLI's MCP-server mode in its [official orchestration example](https://developers.openai.com/cookbook/examples/codex/codex_mcp_agents_sdk/building_consistent_workflows_codex_cli_agents_sdk). Claude documents [local stdio servers and configuration scopes](https://code.claude.com/docs/en/mcp).

**Compatibility finding:** the Codex executable available during setup did not advertise `mcp-server`; asking for its help returned the general CLI help. Do not activate the example below against that binary. Keep an existing working reviewer connection, or install/select a Codex CLI that explicitly supports MCP-server mode separately. This is not required to preview or deploy the website.

## Optional example — only for a compatible CLI

Confirm `codex --help` lists `mcp-server`, and that the selected CLI is authenticated. Then, from this folder, a typical project-scoped local connection is:

```sh
claude mcp add --transport stdio --scope project codex-review -- codex mcp-server
```

The included `.mcp.json.example` is an **inactive template**, not a verified installed connection. Do not overwrite an existing `.mcp.json`; merge a compatible entry only if needed. On Windows, select the actual compatible executable path if `codex` is not on PATH. Never store credentials in the file.

In Claude, check `/mcp`. Discover the actual request schema and request read-only sandboxing for reviews when supported. Provide the absolute project working directory in the tool's documented working-directory field. The server's presence is not evidence a review happened; record actual review outcomes in the QA report.

If MCP is unavailable, keep building with local tests and send a bounded review request in your existing Codex chat manually. Do not expand the MVP just to solve orchestration.
