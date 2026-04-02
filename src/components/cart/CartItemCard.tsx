"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import Link from "next/link";

import type { CartItemCardProps } from "./types";
import { formatCurrency, getLocalizedProductPath } from "@/utils";

export const CartItemCard = ({
  item,
  locale,
  variantLabel,
  removeLabel,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemCardProps) => {
  const productHref = getLocalizedProductPath(locale, item.slug);

  return (
    <Card sx={{ border: "1px solid #F0DFC8" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Link href={productHref} style={{ width: "100%", maxWidth: 140 }}>
            <Box
              sx={{
                width: { xs: "100%", sm: 140 },
                minWidth: { sm: 140 },
                height: 140,
                borderRadius: "24px",
                bgcolor: item.bgColor || "#FFF8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 56,
                cursor: "pointer",
              }}
            >
              {item.emoji}
            </Box>
          </Link>

          <Box sx={{ flex: 1, width: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              <Link
                href={productHref}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {item.title}
              </Link>
            </Typography>

            {item.variant ? (
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {variantLabel}: {item.variant}
              </Typography>
            ) : null}

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {formatCurrency(item.price, locale, item.currency)}
            </Typography>

            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton
                  onClick={() => onDecrease(item.id)}
                  sx={{ border: "1px solid #E8D6BF", bgcolor: "#fff" }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>

                <Box
                  sx={{
                    minWidth: 44,
                    textAlign: "center",
                    px: 1.5,
                    py: 1,
                    borderRadius: "999px",
                    bgcolor: "#FFF8F0",
                    border: "1px solid #F0DFC8",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>{item.quantity}</Typography>
                </Box>

                <IconButton
                  onClick={() => onIncrease(item.id)}
                  sx={{ border: "1px solid #E8D6BF", bgcolor: "#fff" }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                  width: { xs: "100%", md: "auto" },
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontSize: 22, fontWeight: 800, color: "primary.main" }}>
                  {formatCurrency(
                    item.price * item.quantity,
                    locale,
                    item.currency,
                  )}
                </Typography>

                <IconButton aria-label={removeLabel} onClick={() => onRemove(item.id)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};