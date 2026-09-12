import { ENTERTAINMENT_CATEGORIES } from "@/constants/entertainment";
import { defaultLocale, type Locale } from "@/i18n/config";
import type {
  EntertainmentCategoryKey,
  EntertainmentItemDocument,
  LocalizedEntertainmentItem,
} from "@/types/entertainment";

export const localizeEntertainmentItem = (
  item: EntertainmentItemDocument,
  locale: Locale,
): LocalizedEntertainmentItem | null => {
  const translation =
    item.translations[locale] ?? item.translations[defaultLocale];

  if (!translation) {
    return null;
  }

  return {
    slug: item.slug,
    category: item.category,
    title: translation.title,
    description: translation.description,
    poster: translation.poster,
    media: item.media,
    sortOrder: item.sortOrder,
    uploadedAt: item.createdAt,
  };
};

export const isLocalizedEntertainmentItem = (
  item: LocalizedEntertainmentItem | null,
): item is LocalizedEntertainmentItem => item !== null;

export const isEntertainmentCategory = (
  value: string | undefined,
): value is EntertainmentCategoryKey =>
  ENTERTAINMENT_CATEGORIES.some((category) => category === value);

export const getEntertainmentHlsPrefix = (playlistUrl: string) => {
  let pathname: string;

  try {
    ({ pathname } = new URL(playlistUrl));
  } catch {
    return null;
  }

  const objectKey = decodeURIComponent(pathname).replace(/^\//, "");
  const lastSeparator = objectKey.lastIndexOf("/");

  return lastSeparator === -1 ? null : objectKey.slice(0, lastSeparator + 1);
};
