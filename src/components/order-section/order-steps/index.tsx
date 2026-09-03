import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Box, Grid, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

import styles from "./order-steps.module.css";
import type { OrderStepsProps } from "./types";

const iconByKey: Record<string, ReactNode> = {
  shop: <ShoppingBagOutlinedIcon sx={{ fontSize: 26 }} />,
  cart: <ShoppingCartOutlinedIcon sx={{ fontSize: 26 }} />,
  gift: <CardGiftcardOutlinedIcon sx={{ fontSize: 26 }} />,
};

const toneByKey: Record<string, string> = {
  shop: styles.toneBerry,
  cart: styles.toneAqua,
  gift: styles.toneOlive,
};

export const OrderSteps = ({ steps }: OrderStepsProps) => {
  return (
    <Grid container spacing={2}>
      {steps.map((step, index) => (
        <Grid key={step.title} size={{ xs: 12, sm: 4 }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ height: "100%" }}
          >
            <Box
              className={`${styles.mark} ${toneByKey[step.icon] ?? styles.toneBerry}`}
            >
              {iconByKey[step.icon] ?? iconByKey.shop}
            </Box>

            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                {index + 1}. {step.title}
              </Typography>
              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: "text.secondary",
                }}
              >
                {step.text}
              </Typography>
            </Box>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};

export type { OrderStepsProps } from "./types";
