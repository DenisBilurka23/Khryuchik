import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { Box, Container, Paper, Typography } from "@mui/material";
import type { ReactNode } from "react";

import { SectionEyebrow } from "@/components/section-eyebrow";
import type { DeliveryReturnsIcon } from "@/i18n/types";

import styles from "./delivery-returns-section.module.css";
import type { DeliveryReturnsSectionProps } from "./types";

const returnsIcons: Record<DeliveryReturnsIcon, ReactNode> = {
  digital: <CloudDownloadOutlinedIcon />,
  physical: <Inventory2OutlinedIcon />,
  merch: <CheckroomOutlinedIcon />,
};

const resolveReturnsIcon = (icon: string): ReactNode =>
  returnsIcons[icon as DeliveryReturnsIcon] ?? returnsIcons.physical;

const iconTones = [styles.iconRose, styles.iconAqua, styles.iconOlive];

export const DeliveryReturnsSection = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  sub,
  items,
}: DeliveryReturnsSectionProps) => {
  return (
    <Box component="section" id="returns" className={styles.section}>
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
            <Paper key={item.title} elevation={0} className={styles.card}>
              <Box
                className={[
                  styles.icon,
                  iconTones[index % iconTones.length],
                ].join(" ")}
              >
                {resolveReturnsIcon(item.icon)}
              </Box>

              <Box className={styles.cardHead}>
                <Typography variant="h3" className={styles.name}>
                  {item.title}
                </Typography>
                <Typography component="span" className={styles.window}>
                  {item.window}
                </Typography>
              </Box>

              <Typography className={styles.desc}>{item.desc}</Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryReturnsSectionProps } from "./types";
