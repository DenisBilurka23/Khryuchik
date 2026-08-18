import { PRINTIFY_WEBHOOK_TOPICS } from "@/constants/printify";
import { PrintifyApiError, printifyRequest } from "@/server/printify/client";
import type { PrintifyWebhook } from "@/server/printify/types";

const WEBHOOK_PATH = "/api/printify/webhook";

type ScriptOptions = {
  apply: boolean;
  recreate: boolean;
  shopId?: string;
  url?: string;
  simulate?: string;
};

const parseArgs = (argv: string[]): ScriptOptions => {
  const options: ScriptOptions = { apply: false, recreate: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const [flag, inlineValue] = arg.split("=", 2);
    const readValue = () => inlineValue ?? argv[++index];

    switch (flag) {
      case "--apply":
        options.apply = true;
        break;
      case "--recreate":
        options.recreate = true;
        break;
      case "--shop":
        options.shopId = readValue()?.trim();
        break;
      case "--url":
        options.url = readValue()?.trim();
        break;
      case "--simulate":
        options.simulate = readValue()?.trim();
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

const resolveShopId = (options: ScriptOptions) => {
  const shopId = options.shopId ?? process.env.PRINTIFY_SHOP_ID?.trim();

  if (!shopId) {
    fail(
      "Shop id is required. Set PRINTIFY_SHOP_ID in .env.local or pass --shop=<id>. " +
        "Run `npm run printify:publish` with no shop id to list the shops this token can see.",
    );
  }

  return shopId;
};

const resolveUrl = (options: ScriptOptions) => {
  if (options.url) {
    return options.url;
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!origin) {
    fail(
      "Webhook URL is required. Set NEXT_PUBLIC_APP_URL in .env.local or pass " +
        `--url=https://your-domain.com${WEBHOOK_PATH}`,
    );
  }

  return `${origin.replace(/\/+$/, "")}${WEBHOOK_PATH}`;
};

const listWebhooks = (shopId: string) =>
  printifyRequest<PrintifyWebhook[]>(`/shops/${shopId}/webhooks.json`);

const createWebhook = (
  shopId: string,
  topic: string,
  url: string,
  secret: string | undefined,
) =>
  printifyRequest<PrintifyWebhook>(`/shops/${shopId}/webhooks.json`, {
    method: "POST",
    body: { topic, url, ...(secret ? { secret } : {}) },
  });

const updateWebhook = (
  shopId: string,
  webhookId: string,
  url: string,
  secret: string | undefined,
) =>
  printifyRequest<PrintifyWebhook>(
    `/shops/${shopId}/webhooks/${webhookId}.json`,
    { method: "PUT", body: { url, ...(secret ? { secret } : {}) } },
  );

const deleteWebhook = (shopId: string, webhookId: string) =>
  printifyRequest(`/shops/${shopId}/webhooks/${webhookId}.json`, {
    method: "DELETE",
  });

// The spec writes this endpoint without the `.json` suffix every other Printify
// path carries, and it has never been exercised — so try both spellings.
const simulateWebhook = async (shopId: string, webhookId: string) => {
  try {
    await printifyRequest(
      `/shops/${shopId}/webhooks/${webhookId}/simulate.json`,
      { method: "POST" },
    );
  } catch (error) {
    if (!(error instanceof PrintifyApiError) || error.status !== 404) {
      throw error;
    }

    await printifyRequest(`/shops/${shopId}/webhooks/${webhookId}/simulate`, {
      method: "POST",
    });
  }
};

const describe = (webhook: PrintifyWebhook) =>
  `  ${webhook.id}\t${webhook.topic}\t${webhook.url}`;

const main = async () => {
  const options = parseArgs(process.argv.slice(2));

  if (!process.env.PRINTIFY_API_TOKEN) {
    fail(
      "PRINTIFY_API_TOKEN is not set. Create a personal access token in Printify → " +
        "My profile → Connections → Personal access tokens, then add it to .env.local.",
    );
  }

  const shopId = resolveShopId(options);
  const url = resolveUrl(options);
  const secret = process.env.PRINTIFY_WEBHOOK_SECRET?.trim() || undefined;
  const existing = await listWebhooks(shopId);

  console.log(`\nShop ${shopId} — ${existing.length} webhook(s) registered.\n`);

  for (const webhook of existing) {
    console.log(describe(webhook));
  }

  if (options.simulate) {
    if (!options.apply) {
      console.log(
        "\nDry run — nothing was sent. Re-run with --apply to fire the simulated delivery.\n",
      );
      return;
    }

    await simulateWebhook(shopId, options.simulate);
    console.log(
      `\n✓ Simulated delivery requested for webhook ${options.simulate}. Read the endpoint logs.\n`,
    );
    return;
  }

  const planned = PRINTIFY_WEBHOOK_TOPICS.map((topic) => {
    const match = existing.find((webhook) => webhook.topic === topic);

    if (!match) {
      return { topic, action: "create" as const };
    }

    if (options.recreate) {
      return { topic, action: "recreate" as const, webhook: match };
    }

    if (match.url !== url) {
      return { topic, action: "update" as const, webhook: match };
    }

    return { topic, action: "keep" as const, webhook: match };
  });

  const changes = planned.filter((entry) => entry.action !== "keep");

  console.log(`\nTarget URL: ${url}`);
  console.log(
    secret
      ? "Signing secret: PRINTIFY_WEBHOOK_SECRET will be sent with each subscription."
      : "Signing secret: none set — the endpoint will accept unsigned deliveries and log their headers.",
  );
  console.log("");

  for (const entry of planned) {
    console.log(`  ${entry.action.padEnd(8)} ${entry.topic}`);
  }

  if (changes.length === 0) {
    console.log("\nEverything is already registered.\n");
    return;
  }

  if (!options.apply) {
    console.log(
      "\nDry run — nothing was changed. Re-run with --apply to register these webhooks.\n",
    );
    return;
  }

  console.log("");

  for (const entry of changes) {
    try {
      if (entry.action === "update") {
        const updated = await updateWebhook(
          shopId,
          entry.webhook.id,
          url,
          secret,
        );
        console.log(`  ✓ updated  ${entry.topic}\t${updated.id}`);
        continue;
      }

      if (entry.action === "recreate") {
        await deleteWebhook(shopId, entry.webhook.id);
      }

      const created = await createWebhook(shopId, entry.topic, url, secret);
      console.log(`  ✓ created  ${entry.topic}\t${created.id}`);
    } catch (error) {
      console.error(`  ✖ failed   ${entry.topic} — ${String(error)}`);
      process.exitCode = 1;
    }
  }

  console.log("");
};

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
