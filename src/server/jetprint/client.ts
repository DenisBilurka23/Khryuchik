import { JETPRINT_SUCCESS_CODE } from "@/constants/jetprint";
import { isJetprintDuplicateOrderMessage } from "@/utils/jetprint";

export type JetprintConfig = {
  baseUrl: string;
  id: string;
  secret: string;
};

const DEFAULT_TIMEOUT_MS = 15_000;

export class JetprintApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: number,
    readonly detail?: string,
  ) {
    super(message);
    this.name = "JetprintApiError";
  }

  get isDuplicateOrder() {
    return isJetprintDuplicateOrderMessage(this.detail);
  }
}

export class JetprintConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JetprintConfigError";
  }
}

export const getJetprintConfig = (): JetprintConfig | null => {
  const baseUrl = process.env.JETPRINT_API_URL?.trim().replace(/\/+$/, "");
  const id = process.env.JETPRINT_API_ID?.trim();
  const secret = process.env.JETPRINT_API_SECRET?.trim();

  if (!baseUrl || !id || !secret) {
    return null;
  }

  return { baseUrl, id, secret };
};

type JetprintEnvelope = {
  code: number;
  msg?: string;
  data?: unknown;
};

const isEnvelope = (body: unknown): body is JetprintEnvelope =>
  Boolean(body) &&
  typeof body === "object" &&
  typeof (body as { code?: unknown }).code === "number";

const parseBody = (raw: string): unknown => {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const describeBody = (body: unknown) => {
  if (typeof body === "string") {
    return body;
  }

  if (body && typeof body === "object") {
    const { msg, message, error } = body as Record<string, unknown>;

    return String(msg ?? message ?? error ?? "");
  }

  return "";
};

export type JetprintRequestOptions = {
  timeoutMs?: number;
};

export const jetprintRequest = async <TResponse>(
  path: string,
  body: unknown,
  options: JetprintRequestOptions = {},
): Promise<TResponse> => {
  const config = getJetprintConfig();

  if (!config) {
    throw new JetprintConfigError(
      "JETPRINT_API_URL, JETPRINT_API_ID and JETPRINT_API_SECRET must be set",
    );
  }

  const credentials = Buffer.from(`${config.id}:${config.secret}`).toString(
    "base64",
  );
  const response = await fetch(`${config.baseUrl}${path}`, {
    method: "POST",
    signal: AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    headers: {
      Authorization: `Basic ${credentials}`,
      Accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const parsed = parseBody(await response.text());

  if (isEnvelope(parsed)) {
    if (parsed.code !== JETPRINT_SUCCESS_CODE) {
      const detail = describeBody(parsed);

      throw new JetprintApiError(
        `JetPrint ${path} failed with code ${parsed.code}${detail ? `: ${detail}` : ""}`,
        response.status,
        parsed.code,
        detail,
      );
    }

    return parsed.data as TResponse;
  }

  if (!response.ok) {
    const detail = describeBody(parsed);

    throw new JetprintApiError(
      `JetPrint ${path} failed with ${response.status}${detail ? `: ${detail}` : ""}`,
      response.status,
      undefined,
      detail,
    );
  }

  return parsed as TResponse;
};
