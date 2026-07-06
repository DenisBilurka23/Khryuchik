import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
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
import type { DeliveryReturnsIcon } from "@/i18n/types";
import type { DeliveryReturnsSectionProps } from "./types";

const eyebrowSx = {
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  fontSize: 13,
  fontWeight: 700,
};

const returnsIcons: Record<DeliveryReturnsIcon, ReactNode> = {
  digital: <CloudDownloadOutlinedIcon />,
  physical: <Inventory2OutlinedIcon />,
  merch: <CheckroomOutlinedIcon />,
};

const resolveReturnsIcon = (icon: string): ReactNode =>
  returnsIcons[icon as DeliveryReturnsIcon] ?? returnsIcons.physical;

export const DeliveryReturnsSection = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  sub,
  items,
  accent,
}: DeliveryReturnsSectionProps) => {
  return (
    <Box component="section" id="returns" sx={{ py: { xs: 5, md: 7 } }}>
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
            <Grid key={item.title} size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 3.5 },
                  height: "100%",
                  borderRadius: 2.5,
                  border: "1px solid rgba(42,37,34,0.08)",
                  display: "flex",
                  flexDirection: "column",
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
                  {resolveReturnsIcon(item.icon)}
                </Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={1.25}
                  sx={{ mb: 1.25 }}
                >
                  <Typography variant="h3" sx={{ fontSize: 22, lineHeight: 1.15 }}>
                    {item.title}
                  </Typography>
                  <Chip
                    label={item.window}
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
                <Typography color="text.secondary" sx={{ lineHeight: 1.55 }}>
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export type { DeliveryReturnsSectionProps } from "./types";
