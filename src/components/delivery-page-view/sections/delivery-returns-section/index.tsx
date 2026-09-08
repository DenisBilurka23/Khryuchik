import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { Box, Container, Typography } from "@mui/material";
import type { ReactNode } from "react";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { IconTile, Pill, Plate } from "@/components/primitives";
import type { DeliveryReturnsIcon } from "@/i18n/types";
import { accentSx, leadSx } from "@/theme/sx";

import type { DeliveryReturnsSectionProps } from "./types";

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
}: DeliveryReturnsSectionProps) => {
  return (
    <Box component="section" id="returns" sx={{ pt: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 760, mb: 4 }}>
          <SectionEyebrow label={eyebrow} />

          <Typography variant="h2" sx={{ mt: 1.5 }}>
            {titlePrefix}{" "}
            <Box component="em" sx={accentSx}>
              {titleAccent}
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 2,
              ...leadSx,
            }}
          >
            {sub}
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
            gap: { xs: 2, md: 3 },
          }}
        >
          {items.map((item, index) => (
            <Plate
              key={item.title}
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <IconTile cycle={index} sx={{ mb: 2.5 }}>
                {resolveReturnsIcon(item.icon)}
              </IconTile>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ fontSize: 22, lineHeight: 1.15 }}
                >
                  {item.title}
                </Typography>
                <Pill sx={{ flexShrink: 0, fontSize: 11 }}>{item.window}</Pill>
              </Box>

              <Typography
                sx={{
                  mt: 1.5,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "var(--color-text-secondary)",
                }}
              >
                {item.desc}
              </Typography>
            </Plate>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryReturnsSectionProps } from "./types";
