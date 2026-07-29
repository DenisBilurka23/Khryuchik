// Links Printify products to their pages on our storefront and clears the
// "Publishing error" status that Custom API stores get stuck in.
//
// Printify never publishes for an API-connected store — the Publish button in
// its UI does nothing - so the shop stays in an error state until we report the
// result ourselves via `publishing_succeeded`.
//
// Usage:
//   npm run printify:publish                    # dry run, changes nothing
//   npm run printify:publish -- --apply
//   npm run printify:publish -- --apply --shop=123456
//   npm run printify:publish -- --apply --handle-base=https://khryuchik.com
//   npm run printify:publish -- --apply --relink   # also re-link linked products

import {
  fetchAllPrintifyProducts,
  fetchPrintifyShops,
  isIntegratedSalesChannel,
  markPrintifyProductPublished,
} from "@/server/printify/products";
import type { PrintifyProduct } from "@/server/printify/types";

type ScriptOptions = {
  apply: boolean;
  force: boolean;
  relink: boolean;
  shopId?: string;
  handleBase?: string;
};

const parseArgs = (argv: string[]): ScriptOptions => {
  const options: ScriptOptions = {
    apply: false,
    force: false,
    relink: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const [flag, inlineValue] = arg.split("=", 2);
    const readValue = () => inlineValue ?? argv[++index];

    switch (flag) {
      case "--apply":
        options.apply = true;
        break;
      case "--force":
        options.force = true;
        break;
      case "--relink":
        options.relink = true;
        break;
      case "--shop":
        options.shopId = readValue()?.trim();
        break;
      case "--handle-base":
        options.handleBase = readValue()?.trim();
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        process.exit(1);
    }
  }

  return options;
};

// Annotated on the declaration, not just the arrow: TypeScript only narrows
// away the code after a never-returning call when the callee has an explicit
// type annotation.
const fail: (message: string) => never = (message) => {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
};

type PrintifyShopSummary = Awaited<
  ReturnType<typeof fetchPrintifyShops>
>[number];

const printShops = (shops: PrintifyShopSummary[]) => {
  console.error("\nShops available for this token:\n");

  for (const shop of shops) {
    const marker = isIntegratedSalesChannel(shop.sales_channel)
      ? "(integrated — do not use)"
      : "(custom API store)";

    console.error(
      `  ${shop.id}\t${shop.title}\t${shop.sales_channel} ${marker}`,
    );
  }

  console.error("");
};

const resolveShop = async (options: ScriptOptions) => {
  const shopId = options.shopId ?? process.env.PRINTIFY_SHOP_ID?.trim();
  const shops = await fetchPrintifyShops();

  if (!shopId) {
    printShops(shops);
    fail(
      "Shop id is required. Set PRINTIFY_SHOP_ID in .env.local (pick the custom API store above) or pass --shop=<id>.",
    );
  }

  const shop = shops.find((item) => String(item.id) === shopId);

  if (!shop) {
    printShops(shops);
    fail(`Shop ${shopId} is not available for this API token.`);
  }

  if (isIntegratedSalesChannel(shop.sales_channel) && !options.force) {
    fail(
      `Shop ${shop.id} ("${shop.title}") is a ${shop.sales_channel} store that Printify publishes to on its own. ` +
        "Marking its products as published would point them at a storefront we do not control. " +
        "Re-run with --force only if you are certain.",
    );
  }

  return shop;
};

const resolveHandleBase = (options: ScriptOptions) => {
  const handleBase =
    options.handleBase ?? process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!handleBase) {
    fail(
      "Storefront URL is required — it becomes the product link shown in Printify. " +
        "Set NEXT_PUBLIC_APP_URL in .env.local or pass --handle-base=https://your-domain.com",
    );
  }

  return handleBase.replace(/\/+$/, "");
};

const isLinked = (product: PrintifyProduct) =>
  Boolean(product.external?.id && product.external.handle);

const describe = (product: PrintifyProduct) => {
  const variants = product.variants.filter((variant) => variant.is_enabled);
  const link = product.external?.handle ?? "—";

  return `  ${product.id}  ${product.title}\n      variants: ${variants.length}  linked: ${link}`;
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));

  if (!process.env.PRINTIFY_API_TOKEN) {
    fail(
      "PRINTIFY_API_TOKEN is not set. Create a personal access token in Printify → " +
        "My profile → Connections → Personal access tokens, then add it to .env.local.",
    );
  }

  const shop = await resolveShop(options);
  const handleBase = resolveHandleBase(options);
  const products = await fetchAllPrintifyProducts(String(shop.id));

  const candidates = options.relink
    ? products
    : products.filter((product) => !isLinked(product));

  console.log(
    `\nShop ${shop.id} "${shop.title}" (${shop.sales_channel}) — ${products.length} product(s), ${candidates.length} to link.\n`,
  );

  if (candidates.length === 0) {
    console.log(
      "Nothing to do. Pass --relink to refresh already linked products.\n",
    );
    return;
  }

  for (const product of candidates) {
    console.log(describe(product));
  }

  if (!options.apply) {
    console.log(
      "\nDry run — nothing was changed. Re-run with --apply to link these products.\n",
    );
    return;
  }

  // The storefront pages do not exist yet, so every product is linked to the
  // shop index for now. Phase 1 replaces the handle with the real product slug
  // when the product is imported into our catalog.
  const failures: Array<{ product: PrintifyProduct; error: unknown }> = [];

  console.log("");

  for (const product of candidates) {
    try {
      const { requiredPublishRestart } = await markPrintifyProductPublished(
        String(shop.id),
        product.id,
        { id: product.id, handle: `${handleBase}/shop` },
      );

      console.log(
        `  ✓ ${product.id}  ${product.title}${requiredPublishRestart ? " (publish restarted)" : ""}`,
      );
    } catch (error) {
      failures.push({ product, error });
      console.error(`  ✖ ${product.id}  ${product.title} — ${String(error)}`);
    }
  }

  console.log(
    `\nLinked ${candidates.length - failures.length}/${candidates.length} product(s).\n`,
  );

  if (failures.length > 0) {
    process.exit(1);
  }
};

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
