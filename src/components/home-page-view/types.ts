import type { Locale } from "@/i18n/config";
import type { ReactNode } from "react";
import type { HOME_SKELETON_CONFIG } from "@/constants/loading";

export type HomePageViewProps = {
  locale: Locale;
  books: ReactNode;
  shop: ReactNode;
  entertainment: ReactNode;
};

export type HomeSectionSkeletonProps = {
  kind: keyof typeof HOME_SKELETON_CONFIG;
};
