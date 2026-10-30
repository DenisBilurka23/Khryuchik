import type * as Sentry from "@sentry/nextjs";
import type { ErrorEvent } from "@sentry/nextjs";

export const sentryDataCollection: NonNullable<
  Parameters<typeof Sentry.init>[0]["dataCollection"]
> = {
  userInfo: false,
  cookies: false,
  httpHeaders: { request: { allow: ["user-agent"] }, response: false },
  httpBodies: [],
  urlQueryParams: false,
  databaseQueryData: false,
  queues: false,
  stackFrameVariables: false,
};

const urlCredentialsPattern = /\b([a-z][a-z0-9+.-]*:\/\/)[^\s/@]+@/gi;
const emailPattern = /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g;
const secretPattern = /\b(?:sk|rk|whsec|cs|pi|ch)_[A-Za-z0-9_]+\b/g;

const redactErrorText = (value: string) =>
  value
    .replace(urlCredentialsPattern, "$1[redacted credentials]@")
    .replace(emailPattern, "[redacted email]")
    .replace(secretPattern, "[redacted token]");

const pickUserAgentHeader = (headers: Record<string, string> | undefined) => {
  const userAgent = Object.entries(headers ?? {}).find(
    ([key]) => key.toLowerCase() === "user-agent",
  )?.[1];

  return userAgent ? { "User-Agent": userAgent } : undefined;
};

export const scrubSentryError = (event: ErrorEvent): ErrorEvent => {
  const userAgentHeader = pickUserAgentHeader(event.request?.headers);

  delete event.request;
  delete event.user;
  delete event.extra;
  delete event.breadcrumbs;
  delete event.contexts;
  delete event.server_name;

  if (userAgentHeader) {
    event.request = { headers: userAgentHeader };
  }

  if (event.message) {
    event.message = redactErrorText(event.message);
  }

  if (event.transaction) {
    event.transaction = event.transaction.split(/[?#]/, 1)[0];
  }

  for (const exception of event.exception?.values ?? []) {
    if (exception.value) {
      exception.value = redactErrorText(exception.value);
    }
  }

  return event;
};
