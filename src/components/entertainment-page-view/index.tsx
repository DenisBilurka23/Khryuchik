import { Box, Container, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryTabs } from "@/components/category-tabs";
import {
  DEFAULT_ENTERTAINMENT_CATEGORY,
  ENTERTAINMENT_CATEGORIES,
  ENTERTAINMENT_QUERY_PARAM,
} from "@/constants/entertainment";
import { displayFont, leadSx } from "@/theme/sx";
import { getLocalizedEntertainmentPath, getLocalizedPath } from "@/utils";

import {
  EntertainmentDownloadCard,
  EntertainmentVideoCard,
} from "../entertainment-card";
import { NewsletterSection } from "../newsletter-section";
import { PageShell } from "../storefront/page-shell";

import { EntertainmentHero } from "./entertainment-hero";
import type { EntertainmentPageViewProps } from "./types";

const gridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
    md: "repeat(3, minmax(0, 1fr))",
    lg: "repeat(4, minmax(0, 1fr))",
  },
  gap: 3,
  mt: 3.5,
} as const;

const emptyStateSx = {
  mt: 3.5,
  p: { xs: "28px 20px", md: 5 },
  border: "1px dashed var(--color-border)",
  borderRadius: "var(--radius-panel)",
  background: "var(--color-card)",
  textAlign: "center",
} as const;

export const EntertainmentPageView = async ({
  locale,
  items,
  selectedCategory,
}: EntertainmentPageViewProps) => {
  const [tPage, tSection, tCategories] = await Promise.all([
    getTranslations({ locale, namespace: "storefront.entertainmentPage" }),
    getTranslations({ locale, namespace: "storefront.entertainmentSection" }),
    getTranslations({
      locale,
      namespace: "storefront.entertainmentCategories",
    }),
  ]);

  return (
    <PageShell>
      <Box component="section" sx={{ pb: 7 }}>
        <Container maxWidth="lg">
          <Breadcrumbs
            items={[
              {
                label: tPage("breadcrumbs.home"),
                href: getLocalizedPath(locale, "/"),
              },
              { label: tPage("breadcrumbs.entertainment") },
            ]}
          />

          <EntertainmentHero
            eyebrow={tPage("hero.eyebrow")}
            title={tPage("hero.title")}
            lead={tPage("hero.lead")}
          />

          <Box sx={{ mt: { xs: 5, md: 7 } }}>
            <CategoryTabs
              selectedValue={selectedCategory}
              options={ENTERTAINMENT_CATEGORIES.map((category) => ({
                value: category,
                label: tCategories(category),
              }))}
              queryParamName={ENTERTAINMENT_QUERY_PARAM}
              defaultValueWithoutQuery={DEFAULT_ENTERTAINMENT_CATEGORY}
            />

            {items.length > 0 ? (
              <Box sx={gridSx}>
                {items.map((item) =>
                  item.media.type === "download" ? (
                    <EntertainmentDownloadCard
                      key={item.slug}
                      item={item}
                      downloadLabel={tSection("downloadAction")}
                    />
                  ) : (
                    <EntertainmentVideoCard
                      key={item.slug}
                      item={item}
                      href={getLocalizedEntertainmentPath(locale, item.slug)}
                      watchLabel={tSection("watchAction")}
                    />
                  ),
                )}
              </Box>
            ) : (
              <Box sx={emptyStateSx}>
                <Typography
                  component="p"
                  sx={{
                    fontFamily: displayFont,
                    fontSize: 26,
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {tPage("emptyTitle")}
                </Typography>

                <Typography component="p" sx={{ ...leadSx, mt: 1.5 }}>
                  {tPage("emptyText")}
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <NewsletterSection locale={locale} />
    </PageShell>
  );
};

export type { EntertainmentPageViewProps } from "./types";
