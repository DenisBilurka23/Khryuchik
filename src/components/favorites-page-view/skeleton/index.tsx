import { Box, Container, Skeleton } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";

import favoritesHeroImage from "@/assets/FavoritesHero.png";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageShell } from "@/components/page-shell";
import { HeroPanel } from "@/components/primitives";
import { getLocalizedPath } from "@/utils";

import {
  favoritesHeroArtImageStyle,
  favoritesHeroArtSx,
  favoritesHeroContentSx,
  favoritesHeroSx,
} from "../hero/styles";
import { FavoritesLoading } from "../loading";
import type { FavoritesPageSkeletonProps } from "../types";

const titleSx = {
  mt: 2.5,
  fontSize: "clamp(32px, 3.6vw, 48px)",
} as const;

const leadSx = {
  mt: 2.25,
  fontSize: { xs: 16, md: 17 },
} as const;

const actionSx = {
  mt: 3.5,
  borderRadius: "var(--radius-button)",
} as const;

export const FavoritesPageSkeleton = ({
  locale,
}: FavoritesPageSkeletonProps) => {
  const t = useTranslations("storefront.favoritesPage");

  return (
    <PageShell>
      <Box component="section">
        <Container maxWidth="lg">
          <Breadcrumbs
            items={[
              {
                label: t("breadcrumbs.home"),
                href: getLocalizedPath(locale, "/"),
              },
              { label: t("breadcrumbs.current") },
            ]}
          />

          <HeroPanel tone="pale" aria-hidden="true" sx={favoritesHeroSx}>
            <Box sx={favoritesHeroContentSx}>
              <Skeleton variant="text" width={140} />
              <Skeleton variant="text" width="70%" sx={titleSx} />
              <Box sx={leadSx}>
                <Skeleton variant="text" width="95%" />
                <Skeleton variant="text" width="60%" />
              </Box>
              <Skeleton
                variant="rounded"
                width={220}
                height={48}
                sx={actionSx}
              />
            </Box>

            <Box sx={favoritesHeroArtSx}>
              <Image
                src={favoritesHeroImage}
                alt=""
                sizes="(max-width: 900px) 90vw, 500px"
                preload
                style={favoritesHeroArtImageStyle}
              />
            </Box>
          </HeroPanel>

          <Box sx={{ mt: 3 }}>
            <FavoritesLoading status={t("loading")} />
          </Box>
        </Container>
      </Box>
    </PageShell>
  );
};
