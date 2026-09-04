import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

import styles from "./order-steps.module.css";
import type { OrderStepsProps } from "./types";

const iconByKey: Record<string, ReactNode> = {
  shop: <ShoppingBagOutlinedIcon />,
  cart: <ShoppingCartOutlinedIcon />,
  gift: <CardGiftcardOutlinedIcon />,
};

const toneByKey: Record<string, string> = {
  shop: styles.toneBerry,
  cart: styles.toneAqua,
  gift: styles.toneOlive,
};

export const OrderSteps = ({ steps }: OrderStepsProps) => {
  return (
    <Box className={styles.grid}>
      {steps.map((step, index) => (
        <Box key={step.title} className={styles.step}>
          <Box
            className={`${styles.mark} ${toneByKey[step.icon] ?? styles.toneBerry}`}
          >
            {iconByKey[step.icon] ?? iconByKey.shop}
          </Box>

          <Box>
            <Typography component="p" className={styles.stepTitle}>
              {index + 1}. {step.title}
            </Typography>
            <Typography className={styles.stepText}>{step.text}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export type { OrderStepsProps } from "./types";
