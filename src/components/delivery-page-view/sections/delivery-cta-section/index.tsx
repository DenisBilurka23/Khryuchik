import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

import { SectionEyebrow } from "@/components/section-eyebrow";

import styles from "./delivery-cta-section.module.css";
import type { DeliveryCtaSectionProps } from "./types";

export const DeliveryCtaSection = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  titleSuffix,
  action,
  sub,
  shopHref,
}: DeliveryCtaSectionProps) => {
  return (
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.panel}>
          <Box>
            <SectionEyebrow label={eyebrow} />

            <Typography variant="h2" className={styles.title}>
              {titlePrefix}{" "}
              <em className={styles.titleAccent}>{titleAccent}</em>
              <br />
              {titleSuffix}
            </Typography>
          </Box>

          <Box className={styles.actions}>
            <Link href={shopHref}>
              <Button
                component="span"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                {action}
              </Button>
            </Link>

            <Typography component="p" className={styles.sub}>
              {sub}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryCtaSectionProps } from "./types";
