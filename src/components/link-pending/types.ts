import type { ReactNode } from "react";

export type LinkPendingContextValue = {
  pending: boolean;
  setPending: (pending: boolean) => void;
};

export type LinkPendingProviderProps = {
  children: ReactNode;
};
