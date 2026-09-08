import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import MarkunreadMailboxOutlinedIcon from "@mui/icons-material/MarkunreadMailboxOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { Box, Container, Typography } from "@mui/material";
import type { ReactNode } from "react";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { IconTile, Pill, Plate } from "@/components/primitives";
import type { DeliveryMethodIcon } from "@/i18n/types";
import { accentSx, displayFont, leadSx } from "@/theme/sx";

import type { DeliveryMethodsSectionProps } from "./types";

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
}: DeliveryMethodsSectionProps) => {
  return (
    <Box component="section" sx={{ pt: 4 }}>
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
              key={item.name}
              interactive
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <IconTile cycle={index} sx={{ mb: 2.5 }}>
                {resolveMethodIcon(item.icon)}
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
                  {item.name}
                </Typography>
                <Pill sx={{ flexShrink: 0, fontSize: 11 }}>{item.meta}</Pill>
              </Box>

              <Typography
                sx={{
                  flex: 1,
                  mt: 1.5,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "var(--color-text-secondary)",
                }}
              >
                {item.note}
              </Typography>

              <Typography
                component="p"
                sx={{
                  mt: 2.5,
                  pt: 2,
                  borderTop: "1px solid var(--color-border)",
                  fontFamily: displayFont,
                  fontSize: 22,
                  fontWeight: 600,
                  color: "var(--color-accent)",
                }}
              >
                {item.price}
              </Typography>
            </Plate>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryMethodsSectionProps } from "./types";
