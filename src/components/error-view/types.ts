export type ErrorViewProps = {
  error: Error & { digest?: string };
  onRetry: () => void;
};
