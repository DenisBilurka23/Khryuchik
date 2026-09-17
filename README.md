# Khryuchik Store

**Live at [khryuchik.com](https://khryuchik.com)**

A storefront for the Khryuchik books, merch and cartoons, with its own admin panel. Next.js 16 App Router, MUI, MongoDB Atlas, Cloudflare R2.

The shop sells three different kinds of thing, and most of the architecture follows from that:

- **printed books and merch** — produced on demand, priced per variant, shipped through three carrier integrations depending on where the buyer is;
- **e-books** — delivered as tokenised links that expire on their own;
- **cartoons** — streamed from our own HLS ladders on R2, with several audio tracks and subtitles.

## Contents

- [Architecture](#architecture)
- [Routing and localisation](#routing-and-localisation)
- [Catalog and pricing](#catalog-and-pricing)
- [Shipping](#shipping)
- [Payments and orders](#payments-and-orders)
- [Cartoons](#cartoons)
- [Admin](#admin)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Scheduled jobs](#scheduled-jobs)
- [Quality checks](#quality-checks)

## Architecture

```
src/app          route entries, layouts, metadata, page-level orchestration
src/components   reusable UI and *-page-view composition
src/server       server-only business logic, auth, request context, database
src/client-api   typed client-side API wrappers
src/hooks        reusable React hooks
src/utils        pure helpers
src/constants    app-wide static values
src/types        shared domain and view-model types
src/i18n         locale configuration, dictionaries and their regional overrides
src/proxy.ts     request routing, see below
```

MongoDB holds products, product details, categories, orders, customers, reviews, promo codes, cartoons, and the locale and region lists that drive routing and pricing. There is no local fallback: the database must be reachable before `npm run dev` or `npm run build`. UI copy is the exception — it ships with the code.

Styling is `sx` plus MUI `styled()`. Colours live once in `src/theme/colors.ts`; radii, shadows, spacing and fonts come from the custom properties in `src/app/globals.css`. Shared primitives are in `src/components/primitives`.

## Routing and localisation

Two UI locales have shipped dictionaries so far: `en` (default) and `ru`. The default locale has **no URL prefix**.

```
/shop        English    served by src/app/[lang]/shop with lang = "en"
/ru/shop     Russian    served by src/app/[lang]/shop with lang = "ru"
/en/shop     308 -> /shop
```

There is a single route tree, `src/app/[lang]`. Unprefixed URLs reach it through a rewrite in [`src/proxy.ts`](src/proxy.ts), which also:

- redirects an explicit `/en/...` prefix to its unprefixed form, so each page has one address;
- resolves the visitor's country from cookie, then geo headers, then the default region;
- passes locale and country on as request headers, which `resolveLocale` and `getRequestCountry` read.

**Dictionaries are JSON in the repository, not in the database.** A base file per locale in `src/i18n/messages` is layered at request time with per-country overrides from `src/i18n/overrides/<COUNTRY>/<locale>.json`. The base carries region-neutral copy and a country overrides only the lines that differ, so most regions need no file at all.

Which locales are _active_ does live in MongoDB and is managed from the admin. The two halves are independent, which has consequences worth knowing: activating a locale without shipping a dictionary leaves the UI in English, and the URL prefixes the proxy recognises come from the built-in list in `src/i18n/config.ts`, so a new locale serves content but gets no prefixed route until it is added there too.

Page metadata — title, description, canonical, `hreflang` alternates, Open Graph — is built by `createStorefrontMetadata` in [`src/server/i18n/metadata.ts`](src/server/i18n/metadata.ts), so the canonical rule lives in one place instead of in every page.

Time zones follow the visitor's region, mapped in `src/constants/country-timezone.ts`. The admin is different: there is no single shop time zone, so each admin's own zone is detected in the browser, kept in a cookie and re-checked on every load — a move to another country corrects itself.

Admin routes sit outside all of this under `src/app/(admin)/admin` and keep their own locale in a cookie.

## Catalog and pricing

A product is assembled from the catalog in MongoDB, per-locale copy from the dictionaries, and — for print-on-demand items — live data from the fulfilment provider.

**Options and variants.** A product can offer four option groups: languages, formats, sizes and colours. Each option may carry a price delta per currency, so a hardcover in French can cost more than a paperback in English without duplicating the product.

Sizes and colours differ from the other two: they form a **variant matrix** built from the provider's enabled variants in `src/utils/variant-matrix.ts`. The matrix is not a cross product — some combinations are never produced, others are out of stock — so the UI works out which values are still selectable given a partial selection and greys out the rest, instead of letting the customer reach a dead end.

**Regional pricing.** The fulfilment provider quotes in USD only, so USD is the base every price derives from. Each region declares its own currency, and a price ends up in one of three states: `native` when the region already uses the base currency, `converted` with the applied rate attached, or `unavailable` when no rate could be fetched. The storefront shows that third state honestly rather than inventing a number.

**Print-on-demand.** `src/server/printify` holds the API client, catalog sync, order submission, shipping quotes, variant mapping and the webhook handler. Images and blueprint data are pulled in on sync; orders are forwarded after payment.

## Shipping

Three carrier integrations, grouped into two dispatch hubs — one for Europe, one for North America. A shipment is routed by destination hub rather than by cheapest quote, because the parcel physically leaves from one place or the other.

Each provider behind [`registry.ts`](src/server/shipping/providers/registry.ts) implements quoting, and optionally label purchase and pickup-point lookup, so a hub can hold several providers with different capabilities. A basket is split into parcels by `packing.ts` before quoting, so a mixed order can produce several shipments with their own rates and tracking.

Digital-only orders skip shipping entirely.

## Payments and orders

Stripe Checkout is the card path; which methods a country gets comes from `getCountryPaymentMethods`, and cash on delivery and bank transfer exist for some regions.

The order lifecycle is driven by the Stripe webhook (`/api/checkout/stripe/webhook`), with a fallback on the success page for when the webhook is late. Confirmation, shipping and delivery e-mails go out over SMTP from `src/server/email`.

E-book links are not signed URLs to the file. Each purchase gets a token row with a 90-day expiry and a MongoDB TTL index, so the link dies on its own and the file itself is never publicly addressable.

To receive webhooks locally, run `npm run dev:stripe` in a second terminal. It prints a fresh `whsec_...` on each start — copy it into `STRIPE_WEBHOOK_SECRET` and restart the dev server.

## Cartoons

Cartoons are hosted as our own HLS ladders on R2 and played with Media Chrome, rather than embedded from a video platform. That keeps the player inside the site's design and the files under our control.

The pipeline keeps the heavy work out of the app:

1. an admin uploads a master, which lands in the private bucket;
2. the app fires a `repository_dispatch` at a GitHub Actions workflow;
3. the workflow pulls the queue back from the app, runs ffmpeg to build the renditions and playlists, and calls Whisper for subtitles when asked;
4. the results land in the public bucket, and the item walks `uploading → processing → ready`, or `failed`.

A cartoon can carry several audio tracks, each with its own status, and subtitles that are either uploaded by hand or generated. Views are counted per cartoon and shown in the admin and to admins on the page.

## Admin

Admin access is a flag on the user document in MongoDB.

1. Register through `/register` or sign in with Google.
2. Run `npm run admin:grant -- you@example.com`.
3. Sign in with that account and open `/admin`.

The panel manages products, categories, orders, customers, reviews, promo codes, cartoons, shipping, and the locale and region lists that drive pricing and translations.

## Getting started

Create `.env.local` with at least these:

```
MONGODB_URI=
MONGODB_DB=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_APP_URL=
```

Then:

```bash
npm install
npm run seed:mongodb   # first run only
npm run dev
```

Open `http://localhost:3000`.

That is everything needed to boot. Each integration above — payments, storage, print-on-demand, the carriers, e-mail, notifications — reads its own variables and stays switched off until they are set; the module that needs one names it at the point of use.

One deployment note: `NEXT_PUBLIC_APP_URL` must be set in production. It is the base for canonical URLs, `hreflang` and e-mail links, and it falls back to `http://localhost:3000`.

### Seeding

`npm run seed:mongodb` fills the `products`, `productDetails`, `categories`, `locales` and `regions` collections from the seed data under `src/server`. `npm run seed:entertainment` does the same for cartoons.

## Scripts

| Command                                              | What it does                                |
| ---------------------------------------------------- | ------------------------------------------- |
| `npm run dev`                                        | Development server                          |
| `npm run dev:stripe`                                 | Forward Stripe webhooks to the local server |
| `npm run build` / `npm run start`                    | Production build and server                 |
| `npm run lint` / `npm run format`                    | ESLint, Prettier                            |
| `npm run seed:mongodb`                               | Seed catalog, locales and regions           |
| `npm run seed:entertainment`                         | Seed cartoons                               |
| `npm run admin:grant -- <email>`                     | Grant admin rights                          |
| `npm run books:physical`                             | Mark books as physical products             |
| `npm run printify:publish`                           | Publish products to the fulfilment provider |
| `npm run printify:webhooks`                          | Register fulfilment webhooks                |
| `npm run chitchats:quote` / `npm run easyship:quote` | Probe carrier rates from the command line   |
| `npm run email:logo`                                 | Rebuild the inline logo used in e-mails     |

## Scheduled jobs

Routes under `/api/cron`, all behind `CRON_SECRET`. The check fails closed: with no secret set, nothing is authorised.

| Route                     | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| `printify-sync`           | Refresh the print-on-demand catalog      |
| `parcel-progress`         | Poll carriers for tracking updates       |
| `entertainment-transcode` | Hand the transcode queue to the workflow |
| `chitchats-cleanup`       | Tidy carrier quote shipments             |
| `storage-cleanup`         | Sweep orphaned R2 objects                |

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
