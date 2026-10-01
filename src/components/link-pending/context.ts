"use client";

import { createContext } from "react";

import type { LinkPendingContextValue } from "./types";

export const LinkPendingContext = createContext<LinkPendingContextValue>({
  pending: false,
  setPending: () => {},
});
