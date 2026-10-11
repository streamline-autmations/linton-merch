# Inputs and placeholder register

No client assets are required to run this demo. All missing assets have safe, visible placeholders.

## The essential client inputs

1. **Logo and public name:** the current white-on-transparent logo was taken from the live website (`public/brand/linton-logo-white.png`, original in `assets-inbox/logo/`). A vector or coloured version would be better. Confirm Linton Merch versus Linton Enterprises.
2. **WhatsApp:** 082 550 5251 supplied by the project owner, set via `VITE_WHATSAPP_NUMBER` in the git-ignored `.env`. It must also be set as a Netlify build variable. Confirm it is the number the client wants public.
3. **A small real product shortlist:** 12–18 names or catalogue links plus approved images and known colour/size/branding facts. Confirm image-use permission. If unavailable, keep the sample set for the pitch.

The first two are only necessary to personalise the presentation and enable real WhatsApp contact. The product shortlist is only necessary to make catalogue content factual. Nothing here blocks testing the concept.

## Business questions to resolve before factual client copy

- Is customer-supplied clothing accepted for branding? Under what restrictions?
- Which branding methods are offered and for which materials?
- Are there real minimum orders, service areas or typical lead times? Do not assert them until confirmed.
- Are corporate clothing, workwear, promotional merchandise and corporate gifts the right category names for this business?

## Current placeholders

| Element     | Current treatment                                      | Where to change                        |
| ----------- | ------------------------------------------------------ | -------------------------------------- |
| Identity    | Live-site logo (white PNG); favicon still placeholder  | `Layout.tsx`, `public/brand/`          |
| Hero        | AI-generated generic product concept, visibly labelled | `public/merch-concept.png`, `Home.tsx` |
| Catalogue   | 16 invented examples; no prices or stock claims        | `src/data/products.ts`                 |
| Product art | Original vector illustrations; marked illustrative     | `ProductArtwork.tsx`                   |
| Contact     | No recipient; preview and copy only                    | `VITE_WHATSAPP_NUMBER`                 |
| RFQ         | Local summary, explicitly not sent                     | `Quote.tsx`, `src/lib/quote.ts`        |
| Artwork     | Filename preview only                                  | `Quote.tsx`                            |

No client logos, testimonials, certifications, supplier relationships or pricing have been invented. The referenced live website is background context; it has not been modified. Its available page content was not used as proof for uncertain service claims.

## Facts taken from the live website (confirm with the client)

Address, phone 083 225 9886, email, opening hours, the company story and the milestones (1999 golf shirts, 2001 CC, 2018 Pty Ltd; 1999 confirmed by the owner) are in `src/data/business.ts`. The site's "respond within 24 hours", "competitive prices" and export-referral claims are intentionally **not** used. Photos of work for other companies are not used.
