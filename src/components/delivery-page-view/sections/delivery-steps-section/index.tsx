import { Box, Container, Paper, Typography } from "@mui/material";

import { SectionEyebrow } from "@/components/section-eyebrow";

import styles from "./delivery-steps-section.module.css";
import type { DeliveryStepsSectionProps } from "./types";

export const DeliveryStepsSection = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  items,
}: DeliveryStepsSectionProps) => {
  return (
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.panel}>
          <Box className={styles.header}>
            <SectionEyebrow label={eyebrow} />

            <Typography variant="h2" className={styles.title}>
              {titlePrefix}{" "}
              <em className={styles.titleAccent}>{titleAccent}</em>
            </Typography>
          </Box>

          <Box component="ol" className={styles.grid}>
            {items.map((step, index) => (
              <Box component="li" key={step.title} className={styles.item}>
                <Paper elevation={0} className={styles.card}>
                  <Typography component="p" className={styles.number}>
                    {String(index + 1).padStart(2, "0")}
                  </Typography>

                  <Typography variant="h3" className={styles.cardTitle}>
                    {step.title}
                  </Typography>

                  <Typography className={styles.text}>{step.desc}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryStepsSectionProps } from "./types";
