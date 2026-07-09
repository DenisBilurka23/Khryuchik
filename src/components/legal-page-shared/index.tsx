import { Box, Container, Typography } from "@mui/material";

import storefrontStyles from "../storefront/storefront.module.css";
import type { LegalPageSharedProps } from "./types";

const serif = "var(--font-display, var(--font-display-fallback)), serif";

export const LegalPageShared = ({
  eyebrow,
  title,
  updatedLabel,
  updatedDate,
  intro,
  sections,
}: LegalPageSharedProps) => {
  return (
    <Box className={storefrontStyles.pageShell} sx={{ color: "text.primary" }}>
      <Box className={storefrontStyles.pageContent}>
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 9 } }}>
          <Typography
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: 13,
              fontWeight: 700,
              color: "text.secondary",
            }}
          >
            {eyebrow}
          </Typography>
          <Typography
            variant="h1"
            sx={{ mt: 1.5, fontFamily: serif, fontSize: { xs: 32, md: 48 } }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            {updatedLabel} {updatedDate}
          </Typography>
          <Typography sx={{ mt: 4, lineHeight: 1.8 }}>{intro}</Typography>

          <Box sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 4 }}>
            {sections.map((section) => (
              <Box key={section.heading}>
                <Typography
                  variant="h2"
                  sx={{ fontSize: { xs: 22, md: 26 }, mb: 1.5 }}
                >
                  {section.heading}
                </Typography>
                {section.paragraphs.map((paragraph, index) => (
                  <Typography
                    key={index}
                    sx={{ lineHeight: 1.8, color: "text.secondary", mb: 1.5 }}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
