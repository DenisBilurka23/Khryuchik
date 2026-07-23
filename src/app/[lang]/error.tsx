"use client";

import { ErrorView } from "@/components/error-view";

const LocaleError = ({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => <ErrorView error={error} onRetry={unstable_retry} />;

export default LocaleError;
