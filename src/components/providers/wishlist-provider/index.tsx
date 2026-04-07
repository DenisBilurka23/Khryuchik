"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  addToWishlist,
  getWishlist,
  mergeGuestWishlistAfterLogin,
  removeFromWishlist,
  resolveGuestWishlist,
} from "@/client-api/wishlist";
import { WishlistContext } from "@/hooks/useWishlist";
import { defaultLocale, type Locale, locales } from "@/i18n/config";
import type {
  GuestWishlistItem,
  UseWishlistResult,
  WishlistItem,
} from "@/types/wishlist";
import {
  getGuestWishlist,
  GUEST_WISHLIST_CHANGE_EVENT,
  toggleGuestWishlist,
} from "@/utils/wishlist";

import type { WishlistProviderProps } from "./types";

const getLocaleFromPathname = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const localeSegment = segments[0];

  return locales.includes(localeSegment as Locale)
    ? (localeSegment as Locale)
    : defaultLocale;
};

const mergeGuestItemsWithResolvedProducts = (
  guestItems: GuestWishlistItem[],
  resolvedItems: WishlistItem[],
) => {
  const resolvedItemsById = new Map(
    resolvedItems.map((item) => [item.productId, item]),
  );

  return guestItems.map((item) => ({
    ...item,
    product: resolvedItemsById.get(item.productId)?.product,
  }));
};

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const locale = getLocaleFromPathname(pathname);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mergedUserIdsRef = useRef<Set<string>>(new Set());
  const isAuthenticated = status === "authenticated";

  const refreshWishlist = useCallback(async () => {
    if (status === "loading") {
      return;
    }

    setIsLoading(true);

    try {
      if (isAuthenticated) {
        const response = await getWishlist(locale);

        if (response.ok && response.data) {
          setItems(response.data.items);
        } else {
          setItems([]);
        }

        return;
      }

      const guestItems = getGuestWishlist();

      if (guestItems.length === 0) {
        setItems([]);
        return;
      }

      const response = await resolveGuestWishlist(locale, guestItems);

      if (response.ok && response.data) {
        setItems(
          mergeGuestItemsWithResolvedProducts(guestItems, response.data.items),
        );
      } else {
        setItems(guestItems);
      }
    } catch {
      if (!isAuthenticated) {
        setItems(getGuestWishlist());
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, locale, status]);

  useEffect(() => {
    void refreshWishlist();
  }, [refreshWishlist]);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    const handleWishlistChange = () => {
      void refreshWishlist();
    };

    window.addEventListener("storage", handleWishlistChange);
    window.addEventListener(GUEST_WISHLIST_CHANGE_EVENT, handleWishlistChange);

    return () => {
      window.removeEventListener("storage", handleWishlistChange);
      window.removeEventListener(
        GUEST_WISHLIST_CHANGE_EVENT,
        handleWishlistChange,
      );
    };
  }, [isAuthenticated, refreshWishlist]);

  useEffect(() => {
    if (!isAuthenticated || !session?.user?.id) {
      return;
    }

    if (mergedUserIdsRef.current.has(session.user.id)) {
      return;
    }

    mergedUserIdsRef.current.add(session.user.id);

    void mergeGuestWishlistAfterLogin({ refreshWishlist });
  }, [isAuthenticated, refreshWishlist, session?.user?.id]);

  const toggleWishlist = async (productId: string) => {
    const normalizedProductId = productId.trim();

    if (!normalizedProductId) {
      return;
    }

    if (!isAuthenticated) {
      const nextGuestItems = toggleGuestWishlist(normalizedProductId);
      const previousItemsById = new Map(
        items.map((item) => [item.productId, item]),
      );

      setItems(
        nextGuestItems.map((item) => ({
          ...item,
          product: previousItemsById.get(item.productId)?.product,
        })),
      );

      const addedItem = nextGuestItems.find(
        (item) => item.productId === normalizedProductId,
      );

      if (addedItem && !previousItemsById.get(normalizedProductId)?.product) {
        try {
          const response = await resolveGuestWishlist(locale, [addedItem]);

          if (response.ok && response.data) {
            setItems((currentItems) =>
              mergeGuestItemsWithResolvedProducts(
                nextGuestItems,
                response.data!.items,
              ).map((item) => ({
                ...item,
                product:
                  item.product?.id === normalizedProductId
                    ? item.product
                    : (currentItems.find(
                        (currentItem) =>
                          currentItem.productId === item.productId,
                      )?.product ?? item.product),
              })),
            );
          }
        } catch {
          return;
        }
      }

      return;
    }

    const hasItem = items.some(
      (item) => item.productId === normalizedProductId,
    );
    const previousItems = items;

    setItems((currentItems) =>
      hasItem
        ? currentItems.filter((item) => item.productId !== normalizedProductId)
        : [
            {
              productId: normalizedProductId,
              addedAt: new Date().toISOString(),
            },
            ...currentItems,
          ],
    );

    try {
      const response = hasItem
        ? await removeFromWishlist(normalizedProductId)
        : await addToWishlist(normalizedProductId);

      if (!response.ok) {
        setItems(previousItems);
        return;
      }

      await refreshWishlist();
    } catch {
      setItems(previousItems);
    }
  };

  const ids = items.map((item) => item.productId);
  const value: UseWishlistResult = {
    items,
    ids,
    isLoading,
    isAuthenticated,
    isInWishlist: (productId: string) => ids.includes(productId),
    toggleWishlist,
    refreshWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
};

export type { WishlistProviderProps } from "./types";