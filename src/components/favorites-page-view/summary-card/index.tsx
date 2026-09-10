import { Box, Button, Typography } from "@mui/material";

import { Plate } from "@/components/primitives";
import { leadSx } from "@/theme/sx";

import type { FavoritesSummaryCardProps } from "./types";

const cardSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "flex-start", sm: "center" },
  justifyContent: "space-between",
  gap: { xs: 2.5, sm: 3 },
  minHeight: { xs: 0, md: 132 },
  boxShadow: "var(--shadow-panel)",
} as const;

const titleSx = {
  fontSize: { xs: 22, md: 26 },
  fontWeight: 700,
  lineHeight: 1.2,
} as const;

const cardLeadSx = {
  ...leadSx,
  mt: 1.25,
  maxWidth: "56ch",
} as const;

export const FavoritesSummaryCard = ({
  title,
  lead,
  actionLabel,
  onAddAllToCart,
  isAddAllDisabled,
}: FavoritesSummaryCardProps) => {
  return (
    <Plate pad="lg" sx={cardSx}>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={titleSx}>{title}</Typography>
        <Typography sx={cardLeadSx}>{lead}</Typography>
      </Box>

      <Button
        variant="contained"
        size="large"
        onClick={onAddAllToCart}
        disabled={isAddAllDisabled}
        sx={{ flexShrink: 0 }}
      >
        {actionLabel}
      </Button>
    </Plate>
  );
};

export type { FavoritesSummaryCardProps } from "./types";
