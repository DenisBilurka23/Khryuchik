import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import styles from "./newsletter-section.module.css";
import type { NewsletterSectionProps } from "./types";

export const NewsletterSection = ({ dictionary }: NewsletterSectionProps) => {
  return (
    <Box className={styles.section}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          className={styles.panel}
          sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 } }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography className={styles.eyebrow}>
                {dictionary.newsletter.eyebrow}
              </Typography>
              <Typography
                variant="h2"
                sx={{ mt: 2, fontSize: { xs: 30, md: 42 } }}
              >
                {dictionary.newsletter.title}
              </Typography>
              <Typography
                sx={{ mt: 2, color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}
              >
                {dictionary.newsletter.text}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} className={styles.formCard} sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  placeholder={dictionary.newsletter.emailPlaceholder}
                  variant="outlined"
                />
                <Button fullWidth variant="contained" sx={{ mt: 2 }}>
                  {dictionary.newsletter.buttonLabel}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};
