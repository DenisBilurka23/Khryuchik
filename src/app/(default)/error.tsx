"use client";

import { ErrorView } from "@/components/error-view";

const DefaultError = ({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => <ErrorView error={error} onRetry={unstable_retry} />;

export default DefaultError;
