import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import branchLeftImage from "@/assets/BranchReceptionLeft.png";
import branchRightImage from "@/assets/BranchReceptionRight.png";
import receptionImage from "@/assets/KhryuchikReception.png";

import type { AuthRegisterInviteProps } from "./types";

const columnSx = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  height: "100%",
  minWidth: 0,
} as const;

const inviteWrapSx = {
  position: "relative",
} as const;

const artSx = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  minWidth: 0,
  position: { xs: "static", md: "absolute" },
  left: { md: -15 },
  right: { md: -15, lg: -20 },
  bottom: { md: "calc(100% - 20px)" },
} as const;

const artImageStyle = {
  width: "100%",
  maxWidth: 700,
  height: "auto",
  objectFit: "contain",
} as const;

const inviteSx = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  zIndex: 1,
  mt: { xs: 3, md: 0 },
  p: { xs: "24px 20px", md: "32px 40px" },
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

const inviteContentSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
} as const;

const inviteTitleSx = {
  fontSize: { xs: 24, md: 30 },
  lineHeight: 1.2,
} as const;

const registerButtonSx = {
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

export const AuthRegisterInvite = ({
  registerHref,
}: AuthRegisterInviteProps) => {
  const t = useTranslations("authPage");

  return (
    <Box sx={columnSx}>
      <Box sx={inviteWrapSx}>
        <Box sx={artSx}>
          <Image
            src={receptionImage}
            alt={t("illustrationAlt")}
            sizes="(max-width: 900px) 90vw, 700px"
            priority
            style={artImageStyle}
          />
        </Box>

        <Box sx={inviteSx}>
          <Box sx={branchLeftSx}>
            <Image src={branchLeftImage} alt="" style={branchImageStyle} />
          </Box>

          <Box sx={branchRightSx}>
            <Image src={branchRightImage} alt="" style={branchImageStyle} />
          </Box>

          <Box sx={inviteContentSx}>
            <Typography variant="h3" sx={inviteTitleSx}>
              {t("registerPrompt")}
            </Typography>

            <Button
              component={Link}
              href={registerHref}
              variant="outlined"
              sx={registerButtonSx}
              endIcon={<ArrowForwardOutlinedIcon />}
            >
              {t("registerLinkLabel")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export type { AuthRegisterInviteProps } from "./types";
