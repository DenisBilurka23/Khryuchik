## Khryuchik Store

Next.js storefront for Khryuchik books and merch with:

- App Router and SEO-safe locale routes
- Material UI storefront UI
- shared cart state in localStorage
- MongoDB Atlas as the runtime source of truth for dictionaries and product data

## Environment

Create `.env.local` from `.env.example` and fill in your Atlas values.

```bash
cp .env.example .env.local
```

Required variables:

- `MONGODB_URI`
- `MONGODB_DB`

The app does not use a local runtime fallback for dictionaries or product details. MongoDB must be configured before `npm run dev` or `npm run build`.

## Seed MongoDB

Current hardcoded locale dictionaries and product details can be migrated into MongoDB with:

```bash
npm run seed:mongodb
```

This command upserts:

- `dictionaries`
- `productDetails`

It also enriches storefront dictionary items with price, catalog title, and preview background color so client components no longer depend on local product-detail lookups.

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
npm run lint
npm run build
```
