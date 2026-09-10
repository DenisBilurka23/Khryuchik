import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import branchLeftImage from "@/assets/BranchReceptionLeft.png";
import branchRightImage from "@/assets/BranchReceptionRight.png";

import type { AuthInviteCardProps } from "./types";

const cardSx = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  p: { xs: "24px 20px", md: "28px 40px" },
  border: "1px solid var(--color-border-rose)",
  borderRadius: "var(--radius-card)",
  background: "var(--color-accent-pale)",
  boxShadow: "var(--shadow-card)",
} as const;

const branchSx = {
  position: "absolute",
  top: "50%",
  display: { xs: "none", sm: "block" },
  width: { sm: "15%" },
  transform: "translateY(-50%)",
  pointerEvents: "none",
} as const;

const branchLeftSx = { ...branchSx, left: { sm: "3.5%" } } as const;

const branchRightSx = { ...branchSx, right: { sm: "3.5%" } } as const;

const branchImageStyle = { width: "100%", height: "auto" } as const;

const contentSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
} as const;

const titleSx = {
  fontSize: { xs: 24, md: 28 },
  lineHeight: 1.2,
} as const;

const actionSx = {
  width: { xs: "100%", sm: "60%" },
  minHeight: 50,
  mt: 2.5,
  gap: 0.75,
  borderRadius: "var(--radius-field)",
  borderColor: "var(--color-action)",
  background: "var(--color-card)",
  color: "var(--color-action)",
  fontSize: 16,
  "&:hover": {
    borderColor: "var(--color-action)",
    background: "var(--color-action)",
    color: "var(--color-white)",
  },
} as const;

export const AuthInviteCard = ({
  title,
  actionLabel,
  href,
}: AuthInviteCardProps) => (
  <Box sx={cardSx}>
    <Box sx={branchLeftSx}>
      <Image src={branchLeftImage} alt="" style={branchImageStyle} />
    </Box>

    <Box sx={branchRightSx}>
      <Image src={branchRightImage} alt="" style={branchImageStyle} />
    </Box>

    <Box sx={contentSx}>
      <Typography variant="h3" sx={titleSx}>
        {title}
      </Typography>

      <Button
        component={Link}
        href={href}
        variant="outlined"
        sx={actionSx}
        endIcon={<ArrowForwardOutlinedIcon />}
      >
        {actionLabel}
      </Button>
    </Box>
  </Box>
);

export type { AuthInviteCardProps } from "./types";
