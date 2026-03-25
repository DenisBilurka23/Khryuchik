import type { LocalizedProductSummary } from "@/types/catalog";

export type BookCardProps = {
  book: LocalizedProductSummary;
  detailsHref: string;
  detailsButton: string;
  buyButton: string;
};
