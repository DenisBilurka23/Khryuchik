import { Box, Skeleton, Stack, Typography } from "@mui/material";

import { formatCurrency } from "@/utils";

import {
  productPriceRowSx,
  productPriceSx,
  productSubtitleSx,
  productTitleRowSx,
  productTitleSx,
} from "../product-info/styles";
import type { ProductInfoSkeletonProps } from "../types";

const chipSx = { borderRadius: "var(--radius-pill)" } as const;

const wishlistSx = { flexShrink: 0, mt: 0.5 } as const;

const controlsSx = {
  mt: 4,
  borderRadius: "var(--radius-card)",
} as const;

export const ProductInfoSkeleton = ({
  locale,
  product,
}: ProductInfoSkeletonProps) => (
  <Box>
    {product.series || product.storyLabel ? (
      <Skeleton variant="rounded" width={110} height={32} sx={chipSx} />
    ) : null}

    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      sx={productTitleRowSx}
    >
      <Typography variant="h3" sx={productTitleSx}>
        {product.title}
      </Typography>
      <Skeleton variant="circular" width={40} height={40} sx={wishlistSx} />
    </Stack>

    <Typography color="text.secondary" sx={productSubtitleSx}>
      {product.subtitle}
    </Typography>

    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={productPriceRowSx}
    >
      <Typography sx={productPriceSx}>
        {formatCurrency(product.price, locale, product.currency)}
      </Typography>
    </Stack>

    <Skeleton variant="rounded" height={240} sx={controlsSx} />
  </Box>
);
