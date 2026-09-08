import { Box, Container, Typography } from "@mui/material";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { Panel, Plate } from "@/components/primitives";
import { accentSx, displayFont } from "@/theme/sx";

import type { DeliveryStepsSectionProps } from "./types";

export const DeliveryStepsSection = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  items,
}: DeliveryStepsSectionProps) => {
  return (
    <Box component="section" sx={{ pt: 4 }}>
      <Container maxWidth="lg">
        <Panel tone="cream">
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
            component="ol"
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: { xs: 2, md: 2.5 },
              m: 0,
              p: 0,
              listStyle: "none",
            }}
          >
            {items.map((step, index) => (
              <Box component="li" key={step.title} sx={{ display: "flex" }}>
                <Plate
                  pad="sm"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    minHeight: { xs: 0, md: 190 },
                  }}
                >
                  <Typography
                    component="p"
                    sx={{
                      fontFamily: displayFont,
                      fontSize: 23,
                      fontStyle: "italic",
                      fontWeight: 500,
                      lineHeight: 1,
                      color: "var(--color-accent)",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Typography>

                  <Typography
                    variant="h3"
                    sx={{ mt: 1.75, fontSize: 20, lineHeight: 1.2 }}
                  >
                    {step.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1.25,
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {step.desc}
                  </Typography>
                </Plate>
              </Box>
            ))}
          </Box>
        </Panel>
      </Container>
    </Box>
  );
};

export type { DeliveryStepsSectionProps } from "./types";
