import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import MarkunreadMailboxOutlinedIcon from "@mui/icons-material/MarkunreadMailboxOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import {
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import type { DeliveryMethodIcon } from "@/i18n/types";
import type { DeliveryMethodsSectionProps } from "./types";

const serif = "var(--font-display, var(--font-display-fallback)), serif";

const eyebrowSx = {
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  fontSize: 13,
  fontWeight: 700,
};

const methodIcons: Record<DeliveryMethodIcon, ReactNode> = {
  post: <MarkunreadMailboxOutlinedIcon />,
  courier: <LocalShippingOutlinedIcon />,
  pickup: <StorefrontOutlinedIcon />,
  card: <CreditCardOutlinedIcon />,
};

const resolveMethodIcon = (icon: string): ReactNode =>
  methodIcons[icon as DeliveryMethodIcon] ?? methodIcons.post;

export const DeliveryMethodsSection = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  sub,
  items,
  accent,
}: DeliveryMethodsSectionProps) => {
  return (
    <Box component="section" sx={{ py: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 720, mb: 5 }}>
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
          <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.6 }}>
            {sub}
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {items.map((item) => (
            <Grid key={item.name} size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 3.5 },
                  height: "100%",
                  borderRadius: 2.5,
                  border: "1px solid rgba(42,37,34,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  transition:
                    "transform .25s ease, border-color .25s ease, box-shadow .25s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: accent,
                    boxShadow: "0 16px 40px rgba(42,37,34,0.07)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: `${accent}1f`,
                    color: accent,
                    mb: 2.5,
                  }}
                >
                  {resolveMethodIcon(item.icon)}
                </Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={1.25}
                  sx={{ mb: 1.25 }}
                >
                  <Typography
                    variant="h3"
                    sx={{ fontSize: 22, lineHeight: 1.15 }}
                  >
                    {item.name}
                  </Typography>
                  <Chip
                    label={item.meta}
                    size="small"
                    sx={{
                      backgroundColor: "#fff8f0",
                      color: "text.secondary",
                      fontWeight: 600,
                      fontSize: 11,
                      flexShrink: 0,
                    }}
                  />
                </Stack>
                <Typography
                  color="text.secondary"
                  sx={{ lineHeight: 1.55, mb: 2, flex: 1 }}
                >
                  {item.note}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: serif,
                    fontSize: 22,
                    fontWeight: 600,
                    color: accent,
                    pt: 1.75,
                    borderTop: "1px solid rgba(42,37,34,0.08)",
                  }}
                >
                  {item.price}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export type { DeliveryMethodsSectionProps } from "./types";
