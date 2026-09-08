import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { accentSx } from "@/theme/sx";

import type { DeliveryCtaSectionProps } from "./types";

export const DeliveryCtaSection = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  titleSuffix,
  action,
  sub,
  shopHref,
}: DeliveryCtaSectionProps) => {
  return (
    <Box
      component="section"
      sx={{ pt: { xs: 3, md: 4 }, pb: { xs: 5, md: 7 } }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: { xs: 3.5, md: 5 },
            p: { xs: "28px 20px", md: 5 },
            borderRadius: "var(--radius-panel)",
            background: "var(--color-newsletter)",
          }}
        >
          <Box>
            <SectionEyebrow label={eyebrow} />

            <Typography
              variant="h2"
              sx={{
                mt: 1.5,
                fontSize: { xs: 28, md: 36 },
                lineHeight: 1.15,
              }}
            >
              {titlePrefix}{" "}
              <Box component="em" sx={accentSx}>
                {titleAccent}
              </Box>
              <br />
              {titleSuffix}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-start", md: "flex-end" },
              gap: 1.25,
              flexShrink: 0,
            }}
          >
            <Link href={shopHref}>
              <Button
                component="span"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                {action}
              </Button>
            </Link>

            <Typography
              component="p"
              sx={{ fontSize: 12, color: "var(--color-text-secondary)" }}
            >
              {sub}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryCtaSectionProps } from "./types";
