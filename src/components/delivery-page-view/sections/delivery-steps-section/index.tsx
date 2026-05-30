import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import type { DeliveryStepsSectionProps } from "./types";

const serif = "var(--font-display, var(--font-display-fallback)), serif";

const eyebrowSx = {
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  fontSize: 13,
  fontWeight: 700,
};

export const DeliveryStepsSection = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  items,
  accent,
}: DeliveryStepsSectionProps) => {
  return (
    <Box component="section" sx={{ py: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 720, mx: "auto", mb: 5, textAlign: "center" }}>
          <Typography sx={{ ...eyebrowSx, color: accent }}>
            {eyebrow}
          </Typography>
          <Typography
            variant="h2"
            sx={{ mt: 1.5, fontSize: { xs: 30, md: 44 } }}
          >
            {titlePrefix}{" "}
            <Box component="em" sx={{ fontStyle: "italic", color: accent }}>
              {titleAccent}
            </Box>
          </Typography>
        </Box>

        <Grid
          container
          spacing={2.5}
          component="ol"
          sx={{ listStyle: "none", p: 0, m: 0 }}
        >
          {items.map((step, index) => (
            <Grid
              key={step.title}
              size={{ xs: 12, sm: 6, md: 3 }}
              component="li"
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 3.5 },
                  height: "100%",
                  borderRadius: 2.5,
                  border: "1px solid rgba(42,37,34,0.08)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: serif,
                    fontStyle: "italic",
                    fontSize: 36,
                    fontWeight: 500,
                    color: accent,
                    mb: 1.25,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </Typography>
                <Typography variant="h3" sx={{ fontSize: 20, mb: 1 }}>
                  {step.title}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 13, lineHeight: 1.55 }}
                >
                  {step.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export type { DeliveryStepsSectionProps } from "./types";
