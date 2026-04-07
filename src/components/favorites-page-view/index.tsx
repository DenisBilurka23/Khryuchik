import { FavoritesPageContent } from "./content";
import type { FavoritesPageViewProps } from "./types";

export const FavoritesPageView = (props: FavoritesPageViewProps) => (
  <FavoritesPageContent {...props} />
);

export type { FavoritesPageViewProps } from "./types";