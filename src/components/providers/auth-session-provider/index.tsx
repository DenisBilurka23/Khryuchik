"use client";

import { SessionProvider } from "next-auth/react";

import { WishlistProvider } from "@/components/providers";

import type { AuthSessionProviderProps } from "./types";

export const AuthSessionProvider = ({ children }: AuthSessionProviderProps) => {
  return (
    <SessionProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </SessionProvider>
  );
};

export type { AuthSessionProviderProps } from "./types";