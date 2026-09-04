import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { SectionEyebrow } from "@/components/section-eyebrow";

import styles from "./favorites-hero.module.css";
import type { FavoritesHeroProps } from "./types";

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
      <Box className={styles.actions}>
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
            className={styles.secondaryAction}
          >
            {tFavorites("secondaryAction")}
          </Button>
        </Link>
      </Box>

      <Box className={styles.textAction}>
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
    <Box className={styles.panel}>
      <SectionEyebrow
        label={authState ? tAccount("favoritesEyebrow") : tFavorites("eyebrow")}
      />

      <Typography variant="h1" className={styles.title}>
        {authState ? tAccount("favoritesTitle") : tFavorites("title")}
      </Typography>

      <Typography className={styles.lead}>
        {authState ? tAccount("favoritesLead") : tFavorites("lead")}
      </Typography>

      {authState ? (
        <Box className={styles.actions}>
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
    </Box>
  );
};

export type { FavoritesHeroProps } from "./types";
