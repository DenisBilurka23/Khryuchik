"use client";

import { SessionProvider } from "next-auth/react";

import type { AuthSessionProviderProps } from "./types";

export const AuthSessionProvider = ({ children }: AuthSessionProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export type { AuthSessionProviderProps } from "./types";