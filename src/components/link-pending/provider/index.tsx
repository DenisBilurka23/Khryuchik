"use client";

import { useMemo, useState } from "react";

import { LinkPendingContext } from "../context";
import type { LinkPendingProviderProps } from "../types";

export const LinkPendingProvider = ({ children }: LinkPendingProviderProps) => {
  const [pending, setPending] = useState(false);
  const value = useMemo(() => ({ pending, setPending }), [pending]);

  return (
    <LinkPendingContext.Provider value={value}>
      {children}
    </LinkPendingContext.Provider>
  );
};
