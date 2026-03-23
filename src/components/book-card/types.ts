import type { StorefrontDictionary } from "@/i18n/types";

export type BookCardProps = {
  book: StorefrontDictionary["booksSection"]["items"][number];
  detailsButton: string;
  buyButton: string;
};
