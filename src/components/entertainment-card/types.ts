import type { ReactNode } from "react";

import type {
  EntertainmentCategoryKey,
  LocalizedEntertainmentItem,
} from "@/types/entertainment";
import type { ProductImage } from "@/types/product-details";

export type EntertainmentPosterProps = {
  poster?: ProductImage;
  category: EntertainmentCategoryKey;
  alt: string;
  children?: ReactNode;
};

export type EntertainmentVideoCardProps = {
  item: LocalizedEntertainmentItem;
  href: string;
  watchLabel: string;
};

export type EntertainmentDownloadCardProps = {
  item: LocalizedEntertainmentItem;
  downloadLabel: string;
};
