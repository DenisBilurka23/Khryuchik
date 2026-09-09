import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { HeroPanel } from "@/components/primitives";
import { SectionEyebrow } from "@/components/section-eyebrow";

import type { FavoritesHeroProps } from "./types";

const actionsSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  flexWrap: "wrap",
  alignItems: { xs: "stretch", sm: "center" },
  gap: 1.5,
  mt: 3.5,
} as const;

export const FavoritesHero = ({
  authState,
  shopHref,
  loginHref,
  registerHref,
  onAddAllToCart,
  isAddAllDisabled,
}: FavoritesHeroProps) => {
  const tFavorites = useTranslations("storefront.favoritesPage");
  const tAccount = useTranslations("accountPage");

  const renderGuestActions = () => (
    <>
      <Box sx={actionsSx}>
        <Link href={loginHref}>
          <Button
            component="span"
            variant="contained"
            size="large"
            startIcon={<LoginOutlinedIcon />}
          >
            {tFavorites("primaryAction")}
          </Button>
        </Link>

        <Link href={registerHref}>
          <Button
            component="span"
            variant="outlined"
            size="large"
            startIcon={<PersonAddAltOutlinedIcon />}
            sx={{ background: "var(--color-card)" }}
          >
            {tFavorites("secondaryAction")}
          </Button>
        </Link>
      </Box>

      <Box sx={{ mt: 1.75 }}>
        <Link href={shopHref}>
          <Button
            component="span"
            variant="text"
            endIcon={<ChevronRightOutlinedIcon />}
          >
            {tFavorites("continueAction")}
          </Button>
        </Link>
      </Box>
    </>
  );

  return (
    <HeroPanel sx={{ p: { xs: "28px 20px", md: 5 } }}>
      <SectionEyebrow
        label={authState ? tAccount("favoritesEyebrow") : tFavorites("eyebrow")}
      />

      <Typography
        variant="h1"
        sx={{ mt: 2.5, fontSize: "clamp(32px, 3.6vw, 48px)" }}
      >
        {authState ? tAccount("favoritesTitle") : tFavorites("title")}
      </Typography>

      <Typography
        sx={{
          maxWidth: "62ch",
          mt: 2.25,
          fontSize: { xs: 16, md: 17 },
          lineHeight: 1.65,
          color: "var(--color-text)",
        }}
      >
        {authState ? tAccount("favoritesLead") : tFavorites("lead")}
      </Typography>

      {authState ? (
        <Box sx={actionsSx}>
          <Button
            variant="contained"
            size="large"
            onClick={onAddAllToCart}
            disabled={isAddAllDisabled}
          >
            {tAccount("favoritesAddAllToCart")}
          </Button>
        </Box>
      ) : (
        renderGuestActions()
      )}
    </HeroPanel>
  );
};

export type { FavoritesHeroProps } from "./types";
