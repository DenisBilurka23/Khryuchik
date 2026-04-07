"use client";

import { createContext, useContext } from "react";

import type { UseWishlistResult } from "@/types/wishlist";

export const WishlistContext = createContext<UseWishlistResult | null>(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }

  return context;
};