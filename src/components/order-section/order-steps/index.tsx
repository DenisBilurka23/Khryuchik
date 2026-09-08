import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

import type { OrderStepsProps } from "./types";

const iconByKey: Record<string, ReactNode> = {
  shop: <ShoppingBagOutlinedIcon />,
  cart: <ShoppingCartOutlinedIcon />,
  gift: <CardGiftcardOutlinedIcon />,
};

const toneByKey: Record<string, { color: string; borderColor: string }> = {
  shop: {
    color: "var(--color-action)",
    borderColor: "var(--color-border-rose)",
  },
  cart: { color: "var(--color-aqua)", borderColor: "var(--color-aqua)" },
  gift: { color: "var(--color-olive)", borderColor: "var(--color-olive)" },
};

const markSx = {
  flexShrink: 0,
  width: 64,
  height: 64,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "var(--radius-pill)",
  border: "1.5px solid var(--color-border)",
  background: "transparent",
  "& svg": { fontSize: 26 },
} as const;

export const OrderSteps = ({ steps }: OrderStepsProps) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          sm: "repeat(3, minmax(0, 1fr))",
        },
        gap: 2,
      }}
    >
      {steps.map((step, index) => (
        <Box
          key={step.title}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            height: "100%",
          }}
        >
          <Box sx={{ ...markSx, ...(toneByKey[step.icon] ?? toneByKey.shop) }}>
            {iconByKey[step.icon] ?? iconByKey.shop}
          </Box>

          <Box>
            <Typography component="p" sx={{ fontSize: 15, fontWeight: 600 }}>
              {index + 1}. {step.title}
            </Typography>
            <Typography
              sx={{
                mt: 0.75,
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--color-text-secondary)",
              }}
            >
              {step.text}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export type { OrderStepsProps } from "./types";
