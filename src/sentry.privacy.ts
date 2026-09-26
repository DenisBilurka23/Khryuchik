import type * as Sentry from "@sentry/nextjs";
import type { ErrorEvent } from "@sentry/nextjs";

export const sentryDataCollection: NonNullable<
  Parameters<typeof Sentry.init>[0]["dataCollection"]
> = {
  userInfo: false,
  cookies: false,
  httpHeaders: false,
  httpBodies: [],
  urlQueryParams: false,
  databaseQueryData: false,
  queues: false,
  stackFrameVariables: false,
};

const emailPattern = /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g;
const secretPattern = /\b(?:sk|rk|whsec|cs|pi|ch)_[A-Za-z0-9_]+\b/g;

const redactErrorText = (value: string) =>
  value
    .replace(emailPattern, "[redacted email]")
    .replace(secretPattern, "[redacted token]");

export const scrubSentryError = (event: ErrorEvent): ErrorEvent => {
  delete event.request;
  delete event.user;
  delete event.extra;
  delete event.breadcrumbs;
  delete event.contexts;
  delete event.server_name;

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
