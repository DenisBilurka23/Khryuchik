import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import MarkunreadMailboxOutlinedIcon from "@mui/icons-material/MarkunreadMailboxOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { Box, Container, Paper, Typography } from "@mui/material";
import type { ReactNode } from "react";

import { SectionEyebrow } from "@/components/section-eyebrow";
import type { DeliveryMethodIcon } from "@/i18n/types";

import styles from "./delivery-methods-section.module.css";
import type { DeliveryMethodsSectionProps } from "./types";

const methodIcons: Record<DeliveryMethodIcon, ReactNode> = {
  post: <MarkunreadMailboxOutlinedIcon />,
  courier: <LocalShippingOutlinedIcon />,
  pickup: <StorefrontOutlinedIcon />,
  card: <CreditCardOutlinedIcon />,
};

const resolveMethodIcon = (icon: string): ReactNode =>
  methodIcons[icon as DeliveryMethodIcon] ?? methodIcons.post;

const iconTones = [styles.iconRose, styles.iconAqua, styles.iconOlive];

export const DeliveryMethodsSection = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  sub,
  items,
}: DeliveryMethodsSectionProps) => {
  return (
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.header}>
          <SectionEyebrow label={eyebrow} />

          <Typography variant="h2" className={styles.title}>
            {titlePrefix} <em className={styles.titleAccent}>{titleAccent}</em>
          </Typography>

          <Typography className={styles.lead}>{sub}</Typography>
        </Box>

        <Box className={styles.grid}>
          {items.map((item, index) => (
            <Paper key={item.name} elevation={0} className={styles.card}>
              <Box
                className={[
                  styles.icon,
                  iconTones[index % iconTones.length],
                ].join(" ")}
              >
                {resolveMethodIcon(item.icon)}
              </Box>

              <Box className={styles.cardHead}>
                <Typography variant="h3" className={styles.name}>
                  {item.name}
                </Typography>
                <Typography component="span" className={styles.meta}>
                  {item.meta}
                </Typography>
              </Box>

              <Typography className={styles.note}>{item.note}</Typography>

              <Typography component="p" className={styles.price}>
                {item.price}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryMethodsSectionProps } from "./types";
