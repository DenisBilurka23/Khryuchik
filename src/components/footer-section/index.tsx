import { Box, Container, Grid, Stack, Typography } from "@mui/material";

import styles from "./footer-section.module.css";
import type { FooterSectionProps } from "./types";

export const FooterSection = ({ dictionary }: FooterSectionProps) => {
  return (
    <Box component="footer" id="faq" className={styles.footer}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box className={styles.brandMark}>🐷</Box>
              <Typography className={styles.brandTitle}>
                {dictionary.brand.shortLabel}
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, lineHeight: 1.7 }}
            >
              {dictionary.footer.description}
            </Typography>
          </Grid>

          {dictionary.footer.sections.map((section) => (
            <Grid key={section.title} size={{ xs: 12, md: 3 }}>
              <Typography sx={{ fontWeight: 700 }}>{section.title}</Typography>
              <Stack spacing={1.5} sx={{ mt: 2, color: "text.secondary" }}>
                {section.items.map((item) => (
                  <Typography key={item}>{item}</Typography>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
