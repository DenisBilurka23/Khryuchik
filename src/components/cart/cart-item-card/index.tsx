import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, IconButton, Typography } from "@mui/material";
import Link from "next/link";

import { Pill, Plate } from "@/components/primitives";
import { displayFont } from "@/theme/sx";
import {
  formatCurrency,
  getLocalizedProductPath,
  isPurchasableAvailability,
} from "@/utils";

import type { CartItemCardProps } from "../types";

const metaSx = {
  mt: 1,
  fontSize: 14,
  lineHeight: 1.5,
  color: "var(--color-text-secondary)",
} as const;

const quantityButtonSx = {
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-field)",
  background: "var(--color-card)",
  "&:hover": {
    borderColor: "var(--color-border-rose)",
    background: "var(--color-accent-pale)",
  },
} as const;

export const CartItemCard = ({
  item,
  locale,
  variantLabel,
  removeLabel,
  soldOutLabel,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemCardProps) => {
  const productHref = getLocalizedProductPath(locale, item.slug);
  const isSoldOut = !isPurchasableAvailability(item.availability);

  return (
    <Plate
      pad="none"
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          sm: "140px minmax(0, 1fr)",
        },
        gap: { xs: 2, sm: 3 },
        p: { xs: 2.5, sm: 3 },
      }}
    >
      <Link href={productHref} style={{ display: "block" }}>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: { xs: "100%", sm: 140 },
            height: { xs: 180, sm: 140 },
            overflow: "hidden",
            borderRadius: "var(--radius-card)",
            background:
              item.thumbnail?.bgColor ??
              item.thumbnailBackgroundColor ??
              "var(--color-cream)",
            fontSize: 52,
          }}
        >
          {item.thumbnail?.src ? (
            <Box
              component="img"
              src={item.thumbnail.src}
              alt={item.thumbnail.alt ?? item.title}
              sx={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            (item.thumbnail?.emoji ?? item.emoji)
          )}
        </Box>
      </Link>

      <Box>
        <Typography variant="h3" sx={{ fontSize: 20, lineHeight: 1.2 }}>
          <Link href={productHref}>{item.title}</Link>
        </Typography>

        {isSoldOut ? (
          <Pill sx={{ mt: 1.25, fontSize: 13, fontWeight: 500 }}>
            {soldOutLabel}
          </Pill>
        ) : null}

        {item.variant ? (
          <Typography sx={metaSx}>
            {variantLabel}: {item.variant}
          </Typography>
        ) : null}

        <Typography sx={metaSx}>
          {formatCurrency(item.price, locale, item.currency)}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: { xs: "wrap", md: "nowrap" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mt: 2.5,
          }}
        >
          {!item.isDigital ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={() => onDecrease(item.id)}
                sx={quantityButtonSx}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>

              <Box
                sx={{
                  minWidth: 48,
                  padding: "8px 12px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--color-cream)",
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                {item.quantity}
              </Box>

              <IconButton
                onClick={() => onIncrease(item.id)}
                sx={quantityButtonSx}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : null}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              marginLeft: "auto",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: displayFont,
                fontSize: 24,
                fontWeight: 600,
                lineHeight: 1,
                color: "var(--color-accent)",
              }}
            >
              {formatCurrency(
                item.price * item.quantity,
                locale,
                item.currency,
              )}
            </Typography>

            <IconButton
              aria-label={removeLabel}
              onClick={() => onRemove(item.id)}
              sx={{
                color: "var(--color-text-muted)",
                "&:hover": {
                  color: "var(--color-action)",
                  background: "var(--color-accent-pale)",
                },
              }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Plate>
  );
};
