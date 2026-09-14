import { ENTERTAINMENT_CATEGORIES } from "@/constants/entertainment";
import { defaultLocale, type Locale } from "@/i18n/config";
import type {
  EntertainmentCategoryKey,
  EntertainmentItemDocument,
  LocalizedEntertainmentItem,
} from "@/types/entertainment";

export const getEntertainmentFallbackTranslation = (
  translations: EntertainmentItemDocument["translations"],
) => Object.values(translations).find((translation) => translation?.title);

export const localizeEntertainmentItem = (
  item: EntertainmentItemDocument,
  locale: Locale,
): LocalizedEntertainmentItem | null => {
  const translation =
    item.translations[locale] ??
    item.translations[defaultLocale] ??
    getEntertainmentFallbackTranslation(item.translations);

  if (!translation) {
    return null;
  }

  return {
    slug: item.slug,
    category: item.category,
    title: translation.title,
    description: translation.description,
    poster: translation.poster,
    media:
      item.media.type === "video" && item.media.subtitleTracks
        ? {
            ...item.media,
            subtitleTracks: item.media.subtitleTracks.filter(
              (track) =>
                track.isPublished &&
                (!track.status || track.status === "ready"),
            ),
          }
        : item.media,
    sortOrder: item.sortOrder,
    viewCount: item.viewCount ?? 0,
    uploadedAt: item.createdAt,
  };
};

export const pickPreferredAudioTrack = <T extends { language: string }>(
  tracks: T[],
  locale: string,
): T | undefined => {
  if (tracks.length < 2) {
    return undefined;
  }

  const baseLanguage = (value: string) =>
    value.split("-")[0]?.toLowerCase() ?? "";
  const wanted = baseLanguage(locale);

  return (
    tracks.find((track) => baseLanguage(track.language) === wanted) ??
    tracks.find((track) => baseLanguage(track.language) === "en")
  );
};

export const getEntertainmentAspectRatio = (width?: number, height?: number) =>
  width && height ? `${width} / ${height}` : undefined;

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
