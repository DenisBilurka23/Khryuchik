import type { Locale } from "@/i18n/config";
import type { ReactNode } from "react";
import type { EntertainmentCategoryView } from "@/types/entertainment";

export type EntertainmentPageViewProps = {
  locale: Locale;
  children: ReactNode;
};

export type EntertainmentCatalogProps = {
  locale: Locale;
  entertainment: EntertainmentCategoryView;
};
