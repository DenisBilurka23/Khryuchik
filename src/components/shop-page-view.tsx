"use client";

import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  InputAdornment,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";

import { getProductDetails } from "@/data/product-details";

import { FooterSection } from "./footer-section";
import { NewsletterSection } from "./newsletter-section";
import { ProductCard } from "./product-card";
import { StorefrontHeader } from "./storefront-header";
import { StorefrontThemeProvider } from "./storefront-theme-provider";
import styles from "./storefront.module.css";
import { getLocalizedPath, getLocalizedProductPath } from "./utils";

type ShopPageViewProps = {
  locale: Locale;
  dictionary: StorefrontDictionary;
  initialCategory?: string;
  initialQuery?: string;
};

type ShopFilterValue = "books" | "all" | "clothes" | "gifts";
type ShopCatalogItem = {
  id: string;
  title: string;
  price: number;
  emoji: string;
  category: ShopFilterValue;
};

type ShopSearchFieldProps = {
  initialValue: string;
  placeholder: string;
  onSearchChange: (value: string) => void;
};

const isShopFilterValue = (value: string | null): value is ShopFilterValue =>
  value === "books" ||
  value === "all" ||
  value === "clothes" ||
  value === "gifts";

const isShopCatalogItem = (
  item: ShopCatalogItem | null,
): item is ShopCatalogItem => item !== null;

const ShopSearchField = ({
  initialValue,
  placeholder,
  onSearchChange,
}: ShopSearchFieldProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (value !== initialValue) {
        onSearchChange(value);
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [initialValue, onSearchChange, value]);

  return (
    <TextField
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder={placeholder}
      sx={{
        minWidth: { xs: "100%", md: 320 },
        bgcolor: "#fff",
        borderRadius: "999px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "999px",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderRadius: "999px",
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export const ShopPageView = ({
  locale,
  dictionary,
  initialCategory,
  initialQuery,
}: ShopPageViewProps) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const router = useRouter();
  const pathname = usePathname();

  const homeHref = getLocalizedPath(locale, "/");
  const shopHref = getLocalizedPath(locale, "/shop");

  const filters = useMemo(
    () => [
      { value: "all" as const, label: dictionary.shopPage.filters.all },
      { value: "books" as const, label: dictionary.shopPage.filters.books },
      {
        value: "clothes" as const,
        label: dictionary.shopPage.filters.clothes,
      },
      { value: "gifts" as const, label: dictionary.shopPage.filters.gifts },
    ],
    [dictionary.shopPage.filters],
  );

  const initialCategoryParam = initialCategory ?? null;

  const selectedFilter: ShopFilterValue = isShopFilterValue(
    initialCategoryParam,
  )
    ? initialCategoryParam
    : "all";
  const search = initialQuery ?? "";

  const catalogItems = useMemo(() => {
    const bookItems = dictionary.booksSection.items
      .map<ShopCatalogItem | null>((book) => {
        const details = getProductDetails(locale, book.slug);

        if (!details) {
          return null;
        }

        return {
          id: book.slug,
          title: details.title,
          price: details.price,
          emoji: book.emoji,
          category: "books",
        };
      })
      .filter(isShopCatalogItem);

    const merchItems = dictionary.shopSection.items.map<ShopCatalogItem>(
      (product) => ({
        ...product,
        category:
          product.id === "tshirt"
            ? "clothes"
            : product.id === "mug" || product.id === "stickers"
              ? "gifts"
              : "all",
      }),
    );

    return [...bookItems, ...merchItems].filter(
      (item, index, items) =>
        items.findIndex((entry) => entry.id === item.id) === index,
    );
  }, [dictionary.booksSection.items, dictionary.shopSection.items, locale]);

  const updateQuery = (nextValues: {
    category?: ShopFilterValue;
    q?: string;
  }) => {
    const params = new URLSearchParams();

    if (selectedFilter !== "all") {
      params.set("category", selectedFilter);
    }

    if (search.trim()) {
      params.set("q", search);
    }

    if (nextValues.category) {
      if (nextValues.category === "all") {
        params.delete("category");
      } else {
        params.set("category", nextValues.category);
      }
    }

    if (typeof nextValues.q === "string") {
      const trimmed = nextValues.q.trim();

      if (trimmed) {
        params.set("q", nextValues.q);
      } else {
        params.delete("q");
      }
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return catalogItems.filter((product) => {
      const matchesCategory =
        selectedFilter === "all" || product.category === selectedFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.title.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [catalogItems, search, selectedFilter]);

  const totalCount = useMemo(
    () => Object.values(quantities).reduce((sum, value) => sum + value, 0),
    [quantities],
  );

  const addToCart = (productId: string) => {
    setQuantities((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
  };

  const resetFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <StorefrontThemeProvider>
      <Box className={styles.pageShell} sx={{ color: "text.primary" }}>
        <Box className={styles.pageContent}>
          <StorefrontHeader
            locale={locale}
            totalCount={totalCount}
            dictionary={dictionary}
            buildLocalizedPath={(targetLocale) =>
              getLocalizedPath(targetLocale, "/shop")
            }
            navigationPaths={{
              books: getLocalizedPath(locale, "/shop?category=books"),
              shop: shopHref,
              story: `${homeHref}#story`,
              faq: `${homeHref}#faq`,
              order: `${homeHref}#order`,
            }}
          />

          <Box sx={{ py: { xs: 4, md: 6 } }}>
            <Container maxWidth="lg">
              <Breadcrumbs sx={{ mb: 4 }}>
                <MuiLink underline="hover" color="inherit" href={homeHref}>
                  {dictionary.shopPage.breadcrumbs.home}
                </MuiLink>
                <Typography color="text.primary">
                  {dictionary.shopPage.breadcrumbs.current}
                </Typography>
              </Breadcrumbs>

              <Box
                sx={{
                  borderRadius: "32px",
                  p: { xs: 3, md: 5 },
                  background:
                    "radial-gradient(circle at top left, rgba(247,201,209,0.45), transparent 30%), radial-gradient(circle at right, rgba(255,224,167,0.45), transparent 28%), #FFF8F0",
                  border: "1px solid #F0DFC8",
                }}
              >
                <Typography
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "primary.main",
                  }}
                >
                  {dictionary.shopPage.eyebrow}
                </Typography>

                <Typography
                  variant="h1"
                  sx={{ mt: 2, fontSize: { xs: 38, md: 58 }, maxWidth: 800 }}
                >
                  {dictionary.shopPage.title}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 2,
                    maxWidth: 760,
                    lineHeight: 1.8,
                    fontSize: { xs: 16, md: 18 },
                  }}
                >
                  {dictionary.shopPage.lead}
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", md: "center" }}
                spacing={3}
                sx={{ mt: 5, mb: 4 }}
              >
                <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
                  {filters.map((filter) => (
                    <Button
                      key={filter.value}
                      variant={
                        selectedFilter === filter.value
                          ? "contained"
                          : "outlined"
                      }
                      color={
                        selectedFilter === filter.value ? "primary" : "inherit"
                      }
                      onClick={() => updateQuery({ category: filter.value })}
                      sx={
                        selectedFilter === filter.value
                          ? undefined
                          : {
                              borderColor: "#E8D6BF",
                              bgcolor: "#fff",
                            }
                      }
                    >
                      {filter.label}
                    </Button>
                  ))}
                </Stack>

                <ShopSearchField
                  key={search}
                  initialValue={search}
                  placeholder={dictionary.shopPage.searchPlaceholder}
                  onSearchChange={(value) => updateQuery({ q: value })}
                />
              </Stack>

              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {dictionary.shopPage.resultsLabel}: {filteredProducts.length}
              </Typography>

              <Grid container spacing={3}>
                {filteredProducts.map((product) => (
                  <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                    <ProductCard
                      product={product}
                      locale={locale}
                      addToCart={dictionary.shopSection.addToCart}
                      wishlistAriaLabel={
                        dictionary.shopSection.wishlistAriaLabel
                      }
                      detailsHref={getLocalizedProductPath(locale, product.id)}
                      onAddToCart={addToCart}
                    />
                  </Grid>
                ))}
              </Grid>

              {filteredProducts.length === 0 ? (
                <Box
                  sx={{
                    mt: 6,
                    borderRadius: "28px",
                    border: "1px dashed #E8D6BF",
                    p: 5,
                    textAlign: "center",
                    bgcolor: "#fff",
                  }}
                >
                  <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
                    {dictionary.shopPage.emptyTitle}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                    {dictionary.shopPage.emptyText}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 3 }}
                    onClick={resetFilters}
                  >
                    {dictionary.shopPage.resetFilters}
                  </Button>
                </Box>
              ) : null}
            </Container>
          </Box>

          <NewsletterSection dictionary={dictionary} />
          <FooterSection dictionary={dictionary} />
        </Box>
      </Box>
    </StorefrontThemeProvider>
  );
};
