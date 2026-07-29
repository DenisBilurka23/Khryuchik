import { delay } from "@/utils";

export type PrintifyConfig = {
  token: string;
  shopId?: string;
};

const PRINTIFY_API_BASE = "https://api.printify.com/v1";
const PRINTIFY_USER_AGENT = "Khryuchik Store";
const RATE_LIMIT_RETRY_ATTEMPTS = 3;
const RATE_LIMIT_FALLBACK_DELAY_MS = 5_000;

export class PrintifyApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "PrintifyApiError";
  }
}

export class PrintifyConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PrintifyConfigError";
  }
}

export const getPrintifyConfig = (): PrintifyConfig | null => {
  const token = process.env.PRINTIFY_API_TOKEN;

  if (!token) {
    return null;
  }

  return {
    token,
    shopId: process.env.PRINTIFY_SHOP_ID || undefined,
  };
};

// Printify error bodies are not always JSON, so an unparsable response falls
// back to the raw text — it still carries the reason we surface in the error
// message. That contract is specific to this client; do not generalise it.
const parsePrintifyBody = (raw: string): unknown => {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const getRetryDelayMs = (response: Response, attempt: number) => {
  const retryAfter = Number(response.headers.get("retry-after"));

  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return retryAfter * 1000;
  }

  return RATE_LIMIT_FALLBACK_DELAY_MS * (attempt + 1);
};

const buildErrorMessage = (
  method: string,
  path: string,
  status: number,
  body: unknown,
) => {
  const detail =
    typeof body === "string"
      ? body
      : body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : "";

  return `Printify ${method} ${path} failed with ${status}${detail ? `: ${detail}` : ""}`;
};

export type PrintifyRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
};

export const printifyRequest = async <TResponse>(
  path: string,
  options: PrintifyRequestOptions = {},
): Promise<TResponse> => {
  const token = options.token ?? getPrintifyConfig()?.token;

  if (!token) {
    throw new PrintifyConfigError("PRINTIFY_API_TOKEN is not set");
  }

  const { method = "GET", body } = options;

  for (let attempt = 0; ; attempt += 1) {
    const response = await fetch(`${PRINTIFY_API_BASE}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": PRINTIFY_USER_AGENT,
        Accept: "application/json",
        ...(body === undefined
          ? {}
          : { "Content-Type": "application/json;charset=utf-8" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });

    if (response.status === 429 && attempt < RATE_LIMIT_RETRY_ATTEMPTS) {
      await delay(getRetryDelayMs(response, attempt));
      continue;
    }

    const parsedBody = parsePrintifyBody(await response.text());

    if (!response.ok) {
      throw new PrintifyApiError(
        buildErrorMessage(method, path, response.status, parsedBody),
        response.status,
        parsedBody,
      );
    }

    return parsedBody as TResponse;
  }
};
