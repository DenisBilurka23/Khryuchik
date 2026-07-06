import AddIcon from "@mui/icons-material/Add";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from "@mui/material";

import type { DeliveryFaqSectionProps } from "./types";

const serif = "var(--font-display, var(--font-display-fallback)), serif";

const eyebrowSx = {
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  fontSize: 13,
  fontWeight: 700,
} as const;

export const DeliveryFaqSection = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  items,
  accent,
}: DeliveryFaqSectionProps) => {
  return (
    <Box component="section" id="faq" sx={{ py: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 720, mb: 5 }}>
          <Typography sx={{ ...eyebrowSx, color: accent }}>{eyebrow}</Typography>
          <Typography variant="h2" sx={{ mt: 1.5, fontSize: { xs: 30, md: 44 } }}>
            {titlePrefix}{" "}
            <Box component="em" sx={{ fontStyle: "italic", color: accent }}>
              {titleAccent}
            </Box>
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 900, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {items.map((item) => (
            <Accordion
              key={item.q}
              disableGutters
              elevation={0}
              square={false}
              sx={{
                borderRadius: 2.5,
                border: "1px solid rgba(42,37,34,0.08)",
                overflow: "hidden",
                "&::before": { display: "none" },
                "&.Mui-expanded": { borderColor: accent },
              }}
            >
              <AccordionSummary
                expandIcon={<AddIcon sx={{ color: accent }} />}
                sx={{
                  px: 3.25,
                  py: 1.5,
                  "& .MuiAccordionSummary-content": { my: 1 },
                }}
              >
                <Typography sx={{ fontFamily: serif, fontSize: 22, fontWeight: 500 }}>
                  {item.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3.25, pb: 3, pt: 0 }}>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 15, lineHeight: 1.65, maxWidth: "65ch" }}
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
