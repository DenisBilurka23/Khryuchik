import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Button, Container, Typography } from "@mui/material";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { CONTACT_EMAIL } from "@/constants/contact";

import styles from "./story-author-section.module.css";
import type { StoryAuthorSectionProps } from "./types";

export const StoryAuthorSection = ({
  eyebrow,
  title,
  name,
  role,
  paragraphs,
  actionLabel,
}: StoryAuthorSectionProps) => {
  return (
    <Box component="section" id="author" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.panel}>
          <Box className={styles.portrait}>
            <Typography component="span" className={styles.portraitLabel}>
              {name} · {role}
            </Typography>
          </Box>

          <Box>
            <SectionEyebrow label={eyebrow} />

            <Typography variant="h2" className={styles.title}>
              {title}
            </Typography>

            {paragraphs.map((paragraph) => (
              <Typography
                key={paragraph}
                component="p"
                className={styles.paragraph}
              >
                {paragraph}
              </Typography>
            ))}

            <Button
              variant="outlined"
              endIcon={<MailOutlineIcon />}
              component="a"
              href={`mailto:${CONTACT_EMAIL}`}
              className={styles.action}
            >
              {actionLabel}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export type { StoryAuthorSectionProps } from "./types";
