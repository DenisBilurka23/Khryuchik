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
import { accentSx, displayFont } from "@/theme/sx";

import type { DeliveryFaqSectionProps } from "./types";

const itemSx = {
  overflow: "hidden",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-plate)",
  background: "var(--color-card)",
  transition: "border-color 0.2s ease",
  "&::before": { display: "none" },
  "&:hover": { borderColor: "var(--color-border-rose)" },
  "&.Mui-expanded": {
    borderColor: "var(--color-border-rose)",
    background: "var(--color-cream)",
  },
} as const;

export const DeliveryFaqSection = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  items,
}: DeliveryFaqSectionProps) => {
  return (
    <Box component="section" id="faq" sx={{ pt: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 760, mb: 4 }}>
          <SectionEyebrow label={eyebrow} />

          <Typography variant="h2" sx={{ mt: 1.5 }}>
            {titlePrefix}{" "}
            <Box component="em" sx={accentSx}>
              {titleAccent}
            </Box>
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            maxWidth: 900,
          }}
        >
          {items.map((item) => (
            <Accordion
              key={item.q}
              disableGutters
              elevation={0}
              square={false}
              sx={itemSx}
            >
              <AccordionSummary
                expandIcon={<AddIcon sx={{ color: "var(--color-action)" }} />}
                sx={{
                  minHeight: 68,
                  padding: { xs: "0 20px", md: "0 24px" },
                  "& .MuiAccordionSummary-content": { margin: "16px 0" },
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontFamily: displayFont,
                    fontSize: { xs: 19, md: 22 },
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {item.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ padding: { xs: "0 20px 20px", md: "0 24px 24px" } }}
              >
                <Typography
                  sx={{
                    maxWidth: "65ch",
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {item.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryFaqSectionProps } from "./types";
