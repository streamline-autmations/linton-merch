# Publish a separate demo on Netlify

The client website and domain must remain untouched. This project is a static demo and needs no backend or secret keys.

## Build

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm preview
```

## Fast manual demo

Use Netlify's manual deployment interface and upload the **contents of `dist`** or the generated `linton-merch-demo-netlify.zip`. Do not upload the whole source project or `node_modules`. The archive root must contain `index.html`, `assets`, `_redirects`, `_headers` and the public imagery. Ask Netlify to create a separate demo site; leave existing company sites and domains alone.

## Git-based demo

Push this project folder as the repository root, or set Netlify's base directory to `linton-merch-demo` if it lives in a larger repository. Netlify reads `netlify.toml`: Node 22, pnpm 11.25.0, build command `pnpm run build`, publish directory `dist`. Retain the lockfile. No Netlify Functions or Forms are used.

## Contact configuration

Leave `VITE_WHATSAPP_NUMBER` blank to preserve safe contact preview mode. When the owner confirms a South African mobile recipient, add it as a Netlify build environment variable using international digits beginning `27`, then rebuild. It is public configuration, not a secret. `.env.example` documents the local equivalent.

## After deploying

- Open `/`, `/catalogue` and `/quote` directly; refresh both nested routes.
- Search, filter, add two products, change quantities, refresh, complete a request with invented details and download it.
- Confirm the completion text says nothing was sent.
- Check mobile navigation, drawer/modal dismissal and contact preview.
- Confirm noindex metadata/header remains present. This discourages indexing; it does not make the demo private. Use host access controls if privacy is required.

SPA fallback is in `netlify.toml` and `public/_redirects`; header equivalents are in `netlify.toml` and `public/_headers`. Keep these paired definitions in sync so both Git-based and manual uploads behave correctly. [Netlify file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/) documents the SPA rewrite. [Vite static deployment](https://vite.dev/guide/static-deploy.html) documents the build output.

No public deployment was performed in the initial setup session. A real Netlify URL requires deployment through the owner's account.
