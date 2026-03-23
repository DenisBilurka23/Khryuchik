"use client";

import { Box } from "@mui/material";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

import { BookSection } from "./books-section";
import { FooterSection } from "./footer-section";
import { HeroSection } from "./hero-section";
import { NewsletterSection } from "./newsletter-section";
import { OrderSection } from "./order-section";
import { ShopSection } from "./shop-section";
import { StorefrontHeader } from "./storefront-header";
import { StorefrontThemeProvider } from "./storefront-theme-provider";
import { StorySection } from "./story-section";
import styles from "./storefront.module.css";
import type { StorefrontProps } from "./types";
import { formatCurrency } from "./utils";

export const Storefront = ({ locale, dictionary }: StorefrontProps) => {
  const pathname = usePathname();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(
    dictionary.shopSection.filters[0] ?? "",
  );

  const buildLocalizedPath = (targetLocale: Locale) => {
    if (pathname === "/") {
      return targetLocale === defaultLocale ? "/" : `/${targetLocale}`;
    }

    const segments = pathname.split("/");

    if (isLocale(segments[1] ?? "")) {
      if (targetLocale === defaultLocale) {
        segments.splice(1, 1);
      } else {
        segments[1] = targetLocale;
      }
    } else if (targetLocale !== defaultLocale) {
      segments.splice(1, 0, targetLocale);
    }

    const normalizedPath = segments.join("/").replace(/\/+/g, "/");
    if (!normalizedPath) {
      return "/";
    }

    return normalizedPath.length > 1 && normalizedPath.endsWith("/")
      ? normalizedPath.slice(0, -1)
      : normalizedPath;
  };

  const visibleProducts = useMemo(() => {
    const defaultFilter = dictionary.shopSection.filters[0];

    if (selectedFilter === defaultFilter) {
      return dictionary.shopSection.items;
    }

    return dictionary.shopSection.items.filter(
      (product) => product.category === selectedFilter,
    );
  }, [
    dictionary.shopSection.filters,
    dictionary.shopSection.items,
    selectedFilter,
  ]);

  const cartItems = useMemo(
    () =>
      dictionary.shopSection.items
        .filter((product) => (quantities[product.id] ?? 0) > 0)
        .map((product) => ({
          ...product,
          quantity: quantities[product.id] ?? 0,
          subtotal: product.price * (quantities[product.id] ?? 0),
        })),
    [dictionary.shopSection.items, quantities],
  );

  const totalCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.subtotal, 0),
    [cartItems],
  );

  const orderSummary = useMemo(() => {
    const itemText =
      cartItems.length > 0
        ? cartItems
            .map(
              (item) =>
                `• ${item.title} x${item.quantity} — ${formatCurrency(item.subtotal, locale)}`,
            )
            .join("\n")
        : dictionary.orderSection.summary.emptyItem;

    return [
      dictionary.orderSection.summary.title,
      "",
      `${dictionary.orderSection.form.nameLabel}: ${name || dictionary.orderSection.summary.nameFallback}`,
      `${dictionary.orderSection.form.contactLabel}: ${contact || dictionary.orderSection.summary.contactFallback}`,
      "",
      dictionary.orderSection.summary.itemsTitle,
      itemText,
      "",
      `${dictionary.orderSection.summary.totalLabel}: ${formatCurrency(total, locale)}`,
      `${dictionary.orderSection.summary.noteLabel}: ${note || dictionary.orderSection.summary.noteFallback}`,
    ].join("\n");
  }, [cartItems, contact, dictionary, locale, name, note, total]);

  const mailtoHref = `mailto:hello@khryuchik.store?subject=${encodeURIComponent(
    dictionary.orderSection.emailSubject,
  )}&body=${encodeURIComponent(orderSummary)}`;

  const addToCart = (productId: string) => {
    setQuantities((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
  };

  const clearCart = () => {
    setQuantities({});
    setStatus(dictionary.orderSection.status.cleared);
  };

  const copyOrder = async () => {
    if (cartItems.length === 0) {
      setStatus(dictionary.orderSection.status.emptyCart);
      return;
    }

    await navigator.clipboard.writeText(orderSummary);
    setStatus(dictionary.orderSection.status.copied);
  };

  return (
    <StorefrontThemeProvider>
      <Box className={styles.pageShell} sx={{ color: "text.primary" }}>
        <Box className={styles.pageContent}>
          <StorefrontHeader
            locale={locale}
            totalCount={totalCount}
            dictionary={dictionary}
            buildLocalizedPath={buildLocalizedPath}
          />
          <HeroSection locale={locale} dictionary={dictionary} />
          <BookSection locale={locale} dictionary={dictionary} />
          <ShopSection
            locale={locale}
            selectedFilter={selectedFilter}
            visibleProducts={visibleProducts}
            dictionary={dictionary}
            setSelectedFilter={setSelectedFilter}
            addToCart={addToCart}
          />
          <StorySection dictionary={dictionary} />
          <OrderSection
            locale={locale}
            total={total}
            name={name}
            contact={contact}
            note={note}
            status={status}
            mailtoHref={mailtoHref}
            cartItems={cartItems}
            dictionary={dictionary}
            setName={setName}
            setContact={setContact}
            setNote={setNote}
            copyOrder={copyOrder}
            clearCart={clearCart}
          />
          <NewsletterSection dictionary={dictionary} />
          <FooterSection dictionary={dictionary} />
        </Box>
      </Box>
    </StorefrontThemeProvider>
  );
};
