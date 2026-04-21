## Khryuchik Store

Next.js storefront for Khryuchik books and merch with:

- App Router and SEO-safe locale routes
- Material UI storefront UI
- shared cart state in localStorage
- MongoDB Atlas as the runtime source of truth for dictionaries and product data

## Environment

Create `.env.local` from `.env.example` and fill in your runtime values.

```bash
cp .env.example .env.local
```

Required variables:

- `MONGODB_URI`
- `MONGODB_DB`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

Optional but recommended:

- `ADMIN_EMAILS`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `R2_ACCOUNT_ID`
- `R2_S3_API_URL`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_PUBLIC`
- `R2_BUCKET_PRIVATE`
- `R2_PUBLIC_BASE_URL`

The app does not use a local runtime fallback for dictionaries or product details. MongoDB must be configured before `npm run dev` or `npm run build`.

## Admin access

Admin access is now primarily stored in MongoDB via the user field `isAdmin`.

- By default, `/admin` opens only for users with `isAdmin=true` in MongoDB.
- `ADMIN_EMAILS` remains available as a bootstrap/emergency override.
- If `ADMIN_EMAILS` is empty, `/admin` stays closed.
- For local development only, you can explicitly opt into unsafe open access with `ADMIN_ALLOW_UNSAFE_DEV_ACCESS=true`.

Examples:

```bash
ADMIN_EMAILS=owner@example.com,manager@example.com
```

Unsafe local-only override:

```bash
ADMIN_ALLOW_UNSAFE_DEV_ACCESS=true
```

`development` here is based on `NODE_ENV`, not on whether the request comes from `localhost`.

How to create the first admin account:

1. Register a normal account through `/register` or sign in with Google.
2. Run `npm run admin:grant -- you@example.com`.
3. Sign in with that account and open `/admin`.

If you need an env-based emergency override instead of a DB role:

1. Add the email to `ADMIN_EMAILS`.
2. Restart the app.
3. Sign in with that account and open `/admin`.

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
npm run check:admin-flow
npm run admin:grant -- you@example.com
```
