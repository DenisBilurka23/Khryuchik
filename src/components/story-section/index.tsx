import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import styles from "./story-section.module.css";
import type { StorySectionProps } from "./types";

export const StorySection = ({ dictionary }: StorySectionProps) => {
  return (
    <Box component="section" id="story" className={styles.section}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              className={styles.storyCard}
              sx={{ p: { xs: 4, md: 5 } }}
            >
              <Typography className={styles.eyebrow}>
                {dictionary.storySection.eyebrow}
              </Typography>
              <Typography
                variant="h2"
                sx={{ mt: 2, fontSize: { xs: 32, md: 42 } }}
              >
                {dictionary.storySection.title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 3, maxWidth: 620, lineHeight: 1.8 }}
              >
                {dictionary.storySection.text}
              </Typography>
              <Button variant="contained" className={styles.actionButton}>
                {dictionary.storySection.actionLabel}
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              {dictionary.storySection.features.map((feature) => (
                <Paper
                  key={feature.title}
                  elevation={0}
                  className={styles.featureCard}
                  sx={{ p: 4 }}
                >
                  <Typography sx={{ fontSize: 30 }}>{feature.emoji}</Typography>
                  <Typography sx={{ mt: 2, fontSize: 24, fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1.5, lineHeight: 1.8 }}
                  >
                    {feature.text}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
