import { Box, Container, Typography } from "@mui/material";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { Panel, Plate } from "@/components/primitives";
import { displayFont, leadSx } from "@/theme/sx";

import type { StoryValuesSectionProps } from "./types";

export const StoryValuesSection = ({
  eyebrow,
  title,
  lead,
  items,
}: StoryValuesSectionProps) => {
  return (
    <Box component="section" sx={{ pt: 4 }}>
      <Container maxWidth="lg">
        <Panel tone="cream">
          <Box sx={{ maxWidth: 860, mb: 4 }}>
            <SectionEyebrow label={eyebrow} />

            <Typography variant="h2" sx={{ mt: 1.5 }}>
              {title}
            </Typography>

            <Typography
              sx={{
                mt: 2,
                ...leadSx,
              }}
            >
              {lead}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {items.map((item, index) => (
              <Plate
                pad="sm"
                key={item.title}
                interactive
                sx={{
                  display: "flex",
                  flexDirection: "column",
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
                  sx={{ mt: 1.75, fontSize: 22, lineHeight: 1.2 }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    mt: 1.25,
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {item.text}
                </Typography>
              </Plate>
            ))}
          </Box>
        </Panel>
      </Container>
    </Box>
  );
};

export type { StoryValuesSectionProps } from "./types";
