import * as Sentry from "@sentry/nextjs";

import { scrubSentryError, sentryDataCollection } from "./sentry.privacy";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn && process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn,
    dataCollection: sentryDataCollection,
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    beforeBreadcrumb: () => null,
    beforeSend: scrubSentryError,
  });
}
