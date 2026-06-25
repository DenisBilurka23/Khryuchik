"use client";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { getLocalizedProductPath } from "@/utils";
import { ProductCard } from "@/components/product-card";

import type { FavoritesWishlistGridProps } from "./types";

export const FavoritesWishlistGrid = ({
  locale,
  authState,
  items,
}: FavoritesWishlistGridProps) => {
  const tFavorites = useTranslations("storefront.favoritesPage");
  const tAccount = useTranslations("accountPage");
  const tShopSection = useTranslations("storefront.shopSection");

  return (
    <Card sx={{ border: "1px solid #F0DFC8" }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Typography sx={{ fontSize: { xs: 20, sm: 22 }, fontWeight: 800 }}>
              {authState ? tAccount("favoritesListTitle") : tFavorites("listTitle")}
            </Typography>
            {!authState ? (
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {tFavorites("guestListText")}
              </Typography>
            ) : null}
          </Box>
        </Stack>

        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid key={item.productId} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
              <ProductCard
                product={item.product}
                locale={locale}
                addToCart={tShopSection("addToCart")}
                selectOptions={tShopSection("selectOptions")}
                wishlistAriaLabel={tShopSection("wishlistAriaLabel")}
                detailsHref={getLocalizedProductPath(locale, item.product.slug)}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export type { FavoritesWishlistGridProps, ResolvedWishlistItem } from "./types";
