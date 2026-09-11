import { Box, Container, Grid } from "@mui/material";
import { getTranslations } from "next-intl/server";

import {
  DEFAULT_ENTERTAINMENT_CATEGORY,
  ENTERTAINMENT_CATEGORIES,
  ENTERTAINMENT_QUERY_PARAM,
} from "@/constants/entertainment";
import { getLocalizedEntertainmentPath, getLocalizedPath } from "@/utils";

import { CategoryTabs } from "../category-tabs";
import {
  EntertainmentDownloadCard,
  EntertainmentVideoCard,
} from "../entertainment-card";
import { Panel } from "../primitives";
import { SectionHeading } from "../section-heading";

import type { EntertainmentSectionProps } from "./types";

export const EntertainmentSection = async ({
  locale,
  items,
  selectedCategory,
}: EntertainmentSectionProps) => {
  const [tSection, tCategories] = await Promise.all([
    getTranslations({ locale, namespace: "storefront.entertainmentSection" }),
    getTranslations({
      locale,
      namespace: "storefront.entertainmentCategories",
    }),
  ]);

  return (
    <Box component="section" id="entertainment" sx={{ py: { xs: 1.5, md: 2 } }}>
      <Container maxWidth="lg">
        <Panel tone="mauve">
          <SectionHeading
            eyebrow={tSection("eyebrow")}
            title={tSection("title")}
            actionLabel={tSection("actionLabel")}
            actionHref={getLocalizedPath(locale, "/entertainment")}
          />

          <CategoryTabs
            selectedValue={selectedCategory}
            options={ENTERTAINMENT_CATEGORIES.map((category) => ({
              value: category,
              label: tCategories(category),
            }))}
            queryParamName={ENTERTAINMENT_QUERY_PARAM}
            defaultValueWithoutQuery={DEFAULT_ENTERTAINMENT_CATEGORY}
            preserveQueryParams={["category"]}
            sx={{ mb: 4 }}
          />

          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid key={item.slug} size={{ xs: 6, md: 4, lg: 3 }}>
                {item.media.type === "download" ? (
                  <EntertainmentDownloadCard
                    item={item}
                    downloadLabel={tSection("downloadAction")}
                  />
                ) : (
                  <EntertainmentVideoCard
                    item={item}
                    href={getLocalizedEntertainmentPath(locale, item.slug)}
                    watchLabel={tSection("watchAction")}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Panel>
      </Container>
    </Box>
  );
};

export type { EntertainmentSectionProps } from "./types";
