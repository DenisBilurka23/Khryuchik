import { Box, Container, Grid } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { ENTERTAINMENT_QUERY_PARAM } from "@/constants/entertainment";
import { getLocalizedEntertainmentPath, getLocalizedPath } from "@/utils";

import { CategoryTabs } from "@/components/category-tabs";
import {
  EntertainmentDownloadCard,
  EntertainmentVideoCard,
} from "@/components/entertainment-card";
import { Panel } from "@/components/primitives";
import { SectionHeading } from "@/components/section-heading";

import type { EntertainmentSectionProps } from "./types";

export const EntertainmentSection = async ({
  locale,
  entertainment,
}: EntertainmentSectionProps) => {
  const { availableCategories, selectedCategory, items } = entertainment;
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

          {availableCategories.length > 1 ? (
            <CategoryTabs
              selectedValue={selectedCategory ?? availableCategories[0]}
              options={availableCategories.map((category) => ({
                value: category,
                label: tCategories(category),
              }))}
              queryParamName={ENTERTAINMENT_QUERY_PARAM}
              defaultValueWithoutQuery={availableCategories[0]}
              preserveQueryParams={["category"]}
              sx={{ mb: 4 }}
            />
          ) : null}

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
