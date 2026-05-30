import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

import type { DeliveryCtaSectionProps } from "./types";

const eyebrowSx = {
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  fontSize: 13,
  fontWeight: 700,
};

export const DeliveryCtaSection = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  titleSuffix,
  action,
  sub,
  shopHref,
  accent,
}: DeliveryCtaSectionProps) => {
  return (
    <Box component="section" sx={{ pb: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            backgroundColor: "#27272A",
            color: "#fff",
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: -100,
              bottom: -100,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accent}66, transparent 70%)`,
            }}
          />
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography sx={{ ...eyebrowSx, color: accent }}>
              {eyebrow}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: 1.5,
                fontSize: { xs: 28, md: 40 },
                fontWeight: 500,
                color: "#fff",
              }}
            >
              {titlePrefix}{" "}
              <Box component="em" sx={{ fontStyle: "italic", color: accent }}>
                {titleAccent}
              </Box>
              <br />
              {titleSuffix}
            </Typography>
          </Box>

          <Stack
            spacing={1.25}
            alignItems={{ xs: "flex-start", md: "flex-end" }}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Link href={shopHref}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  backgroundColor: accent,
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: accent,
                    filter: "brightness(0.92)",
                  },
                }}
              >
                {action}
              </Button>
            </Link>
            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
              {sub}
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryCtaSectionProps } from "./types";
