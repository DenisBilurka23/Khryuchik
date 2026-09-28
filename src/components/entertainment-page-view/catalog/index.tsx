import { Box, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { CategoryTabs } from "@/components/category-tabs";
import {
  EntertainmentDownloadCard,
  EntertainmentVideoCard,
} from "@/components/entertainment-card";
import { ENTERTAINMENT_QUERY_PARAM } from "@/constants/entertainment";
import { displayFont, leadSx } from "@/theme/sx";
import { getLocalizedEntertainmentPath } from "@/utils";

import type { EntertainmentCatalogProps } from "../types";

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

export const EntertainmentCatalog = async ({
  locale,
  entertainment,
}: EntertainmentCatalogProps) => {
  const { availableCategories, selectedCategory, items } = entertainment;
  const [tPage, tSection, tCategories] = await Promise.all([
    getTranslations({ locale, namespace: "storefront.entertainmentPage" }),
    getTranslations({ locale, namespace: "storefront.entertainmentSection" }),
    getTranslations({
      locale,
      namespace: "storefront.entertainmentCategories",
    }),
  ]);

  return (
    <>
      {availableCategories.length > 1 ? (
        <CategoryTabs
          selectedValue={selectedCategory ?? availableCategories[0]}
          options={availableCategories.map((category) => ({
            value: category,
            label: tCategories(category),
          }))}
          queryParamName={ENTERTAINMENT_QUERY_PARAM}
          defaultValueWithoutQuery={availableCategories[0]}
        />
      ) : null}

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
    </>
  );
};
