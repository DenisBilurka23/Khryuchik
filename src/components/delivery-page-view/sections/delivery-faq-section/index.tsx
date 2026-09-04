import AddIcon from "@mui/icons-material/Add";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from "@mui/material";

import { SectionEyebrow } from "@/components/section-eyebrow";

import styles from "./delivery-faq-section.module.css";
import type { DeliveryFaqSectionProps } from "./types";

export const DeliveryFaqSection = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  items,
}: DeliveryFaqSectionProps) => {
  return (
    <Box component="section" id="faq" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.header}>
          <SectionEyebrow label={eyebrow} />

          <Typography variant="h2" className={styles.title}>
            {titlePrefix} <em className={styles.titleAccent}>{titleAccent}</em>
          </Typography>
        </Box>

        <Box className={styles.list}>
          {items.map((item) => (
            <Accordion
              key={item.q}
              disableGutters
              elevation={0}
              square={false}
              className={styles.item}
            >
              <AccordionSummary
                expandIcon={<AddIcon className={styles.icon} />}
                className={styles.summary}
              >
                <Typography component="span" className={styles.question}>
                  {item.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={styles.details}>
                <Typography className={styles.answer}>{item.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryFaqSectionProps } from "./types";
