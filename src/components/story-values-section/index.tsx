import { Box, Container, Paper, Typography } from "@mui/material";

import { SectionEyebrow } from "@/components/section-eyebrow";

import styles from "./story-values-section.module.css";
import type { StoryValuesSectionProps } from "./types";

export const StoryValuesSection = ({
  eyebrow,
  title,
  lead,
  items,
}: StoryValuesSectionProps) => {
  return (
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.panel}>
          <Box className={styles.header}>
            <SectionEyebrow label={eyebrow} />

            <Typography variant="h2" className={styles.title}>
              {title}
            </Typography>

            <Typography className={styles.lead}>{lead}</Typography>
          </Box>

          <Box className={styles.grid}>
            {items.map((item, index) => (
              <Paper key={item.title} elevation={0} className={styles.card}>
                <Typography component="p" className={styles.number}>
                  {String(index + 1).padStart(2, "0")}
                </Typography>

                <Typography variant="h3" className={styles.cardTitle}>
                  {item.title}
                </Typography>

                <Typography className={styles.text}>{item.text}</Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export type { StoryValuesSectionProps } from "./types";
