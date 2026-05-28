import { Box, Container, Grid, Paper, Typography } from "@mui/material";

import type { StoryValuesSectionProps } from "./types";

const eyebrowSx = {
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  fontSize: 13,
  fontWeight: 700,
  color: "primary.main",
} as const;

export const StoryValuesSection = ({
  eyebrow,
  title,
  lead,
  items,
}: StoryValuesSectionProps) => {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 720, mb: 5 }}>
          <Typography sx={eyebrowSx}>{eyebrow}</Typography>
          <Typography
            variant="h2"
            sx={{ mt: 1.5, fontSize: { xs: 30, md: 44 } }}
          >
            {title}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>
            {lead}
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {items.map((item, index) => (
            <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  height: "100%",
                  borderRadius: 1,
                  border: "1px solid rgba(39,39,42,0.08)",
                  transition: "transform .25s ease, border-color .25s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily:
                      "var(--font-display, var(--font-display-fallback)), serif",
                    fontSize: 36,
                    fontWeight: 500,
                    fontStyle: "italic",
                    color: "primary.main",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </Typography>
                <Typography variant="h3" sx={{ fontSize: 24, mt: 1, mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {item.text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
