import type { ProductImage } from "./product-details";

export type StoryTimelineBook = {
  slug: string;
  href: string;
  title: string;
  subtitle: string;
  emoji: string;
  ageRating?: string;
  storyLabel?: string;
  badge?: string;
  thumbnail?: ProductImage;
  thumbnailBackgroundColor?: string;
};
