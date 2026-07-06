import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { CONTACT_EMAIL } from "@/constants/contact";
import type { StoryAuthorSectionProps } from "./types";

const eyebrowSx = {
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  fontSize: 13,
  fontWeight: 700,
  color: "primary.main",
} as const;

export const StoryAuthorSection = ({
  eyebrow,
  title,
  name,
  role,
  emoji,
  paragraphs,
  actionLabel,
}: StoryAuthorSectionProps) => {
  return (
    <Box component="section" id="author" sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 1.4,
            p: { xs: 3, md: 7 },
            background: "linear-gradient(135deg, #F6E8DB 0%, #F9DDC8 100%)",
          }}
        >
          <Grid container spacing={{ xs: 4, md: 7 }} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 1.4,
                  overflow: "hidden",
                  aspectRatio: "5 / 6",
                  background: "#F4D8C2",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Typography
                  component="span"
                  sx={{ fontSize: 96, lineHeight: 1 }}
                  aria-hidden
                >
                  {emoji}
                </Typography>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    right: 12,
                    bgcolor: "rgba(255,255,255,0.9)",
                    py: 1,
                    px: 1.5,
                    borderRadius: 999,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {name} · {role}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Typography sx={eyebrowSx}>{eyebrow}</Typography>
              <Typography
                variant="h2"
                sx={{ mt: 1.5, mb: 2.5, fontSize: { xs: 26, md: 38 } }}
              >
                {title}
              </Typography>
              {paragraphs.map((paragraph) => (
                <Typography
                  key={paragraph}
                  color="text.secondary"
                  sx={{ lineHeight: 1.8, mb: 2, maxWidth: "60ch" }}
                >
                  {paragraph}
                </Typography>
              ))}
              <Button
                variant="outlined"
                color="inherit"
                endIcon={<MailOutlineIcon />}
                component="a"
                href={`mailto:${CONTACT_EMAIL}`}
                sx={{ mt: 1 }}
              >
                {actionLabel}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};
