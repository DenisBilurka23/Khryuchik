import "server-only";

import {
  DEFAULT_ENTERTAINMENT_CATEGORY,
  DEFAULT_ENTERTAINMENT_SORT_ORDER,
} from "@/constants/entertainment";
import { defaultLocale, type Locale } from "@/i18n/config";
import {
  AdminEntertainmentFormErrorCode,
  AdminEntertainmentFormValidationError,
} from "@/server/admin/entertainment-form-state";
import { getActiveLocales } from "@/server/localization/localization.service";
import {
  buildEntertainmentPlaylistUrl,
  deleteEntertainmentPublicObjects,
  deleteEntertainmentSourceObjects,
} from "@/server/storage/r2-assets.service";
import type {
  AdminEntertainmentEditorData,
  AdminEntertainmentListItem,
  AdminEntertainmentUpsertInput,
} from "@/types/admin";
import type {
  EntertainmentItemDocument,
  EntertainmentMedia,
  EntertainmentTranslation,
} from "@/types/entertainment";
import { buildUniqueValue, normalizeIdentifierPart } from "@/utils/admin";

import {
  deleteEntertainmentItemBySlug,
  findAllEntertainmentItems,
  findEntertainmentItemBySlugForAdmin,
  upsertEntertainmentItem,
} from "../entertainment/repositories/entertainment.repository";

const SLUG_FALLBACK = "cartoon";

const createEmptyEntertainmentItem = (): EntertainmentItemDocument => {
  const now = new Date().toISOString();

  return {
    slug: "",
    category: DEFAULT_ENTERTAINMENT_CATEGORY,
    media: {
      type: "video",
      source: null,
      status: "uploading",
      durationSeconds: null,
    },
    status: { isActive: true, visibleOnHome: false },
    sortOrder: DEFAULT_ENTERTAINMENT_SORT_ORDER,
    createdAt: now,
    updatedAt: now,
    translations: {},
  };
};

const normalizeTranslations = (
  translations: AdminEntertainmentUpsertInput["translations"],
) =>
  Object.entries(translations).reduce<
    Partial<Record<Locale, EntertainmentTranslation>>
  >((accumulator, [locale, translation]) => {
    const title = translation?.title.trim();

    if (!title) {
      return accumulator;
    }

    accumulator[locale as Locale] = {
      title,
      description: translation?.description?.trim() || undefined,
      poster: translation?.poster,
    };

    return accumulator;
  }, {});

const resolveEntertainmentSlug = ({
  requestedSlug,
  translations,
  existingSlugs,
  currentSlug,
}: {
  requestedSlug: string;
  translations: Partial<Record<Locale, EntertainmentTranslation>>;
  existingSlugs: Set<string>;
  currentSlug?: string;
}) => {
  const baseSlug =
    normalizeIdentifierPart(requestedSlug) ||
    normalizeIdentifierPart(translations[defaultLocale]?.title ?? "") ||
    SLUG_FALLBACK;

  return buildUniqueValue(
    baseSlug,
    (candidate) => candidate !== currentSlug && existingSlugs.has(candidate),
  );
};

const buildEntertainmentMedia = ({
  input,
  slug,
  previous,
}: {
  input: AdminEntertainmentUpsertInput;
  slug: string;
  previous: EntertainmentItemDocument | null;
}): EntertainmentMedia => {
  const uploadedFile = input.media.uploadedFile;

  if (input.media.type === "download") {
    if (!uploadedFile) {
      if (previous?.media.type === "download") {
        return previous.media;
      }

      throw new AdminEntertainmentFormValidationError(
        AdminEntertainmentFormErrorCode.FileRequired,
      );
    }

    if (!uploadedFile.url) {
      throw new AdminEntertainmentFormValidationError(
        AdminEntertainmentFormErrorCode.StorageUnavailable,
      );
    }

    return {
      type: "download",
      fileName: uploadedFile.fileName,
      objectKey: uploadedFile.objectKey,
      url: uploadedFile.url,
      contentType: uploadedFile.contentType,
      sizeBytes: uploadedFile.sizeBytes,
    };
  }

  const previousVideo =
    previous?.media.type === "video" ? previous.media : null;
  const durationSeconds =
    input.media.durationSeconds ?? previousVideo?.durationSeconds ?? null;

  if (!uploadedFile) {
    if (!previousVideo?.source) {
      throw new AdminEntertainmentFormValidationError(
        AdminEntertainmentFormErrorCode.VideoRequired,
      );
    }

    return { ...previousVideo, durationSeconds };
  }

  const playlistUrl = buildEntertainmentPlaylistUrl(slug);

  if (!playlistUrl) {
    throw new AdminEntertainmentFormValidationError(
      AdminEntertainmentFormErrorCode.StorageUnavailable,
    );
  }

  return {
    type: "video",
    source: {
      kind: "hls",
      playlistUrl,
      sourceObjectKey: uploadedFile.objectKey,
    },
    status: "processing",
    durationSeconds,
  };
};

const collectEntertainmentObjectKeys = (
  item: EntertainmentItemDocument | null,
) => {
  if (!item) {
    return { publicKeys: [] as string[], sourceKeys: [] as string[] };
  }

  const posterKeys = Object.values(item.translations)
    .map((translation) => translation?.poster?.objectKey)
    .filter((objectKey): objectKey is string => Boolean(objectKey));

  return {
    publicKeys:
      item.media.type === "download"
        ? [...posterKeys, item.media.objectKey]
        : posterKeys,
    sourceKeys:
      item.media.type === "video" && item.media.source?.kind === "hls"
        ? [item.media.source.sourceObjectKey]
        : [],
  };
};

const removeOrphanedObjects = async (
  previous: EntertainmentItemDocument | null,
  next: EntertainmentItemDocument,
) => {
  const previousKeys = collectEntertainmentObjectKeys(previous);
  const nextKeys = collectEntertainmentObjectKeys(next);
  const keptPublicKeys = new Set(nextKeys.publicKeys);
  const keptSourceKeys = new Set(nextKeys.sourceKeys);

  try {
    await Promise.all([
      deleteEntertainmentPublicObjects(
        previousKeys.publicKeys.filter(
          (objectKey) => !keptPublicKeys.has(objectKey),
        ),
      ),
      deleteEntertainmentSourceObjects(
        previousKeys.sourceKeys.filter(
          (objectKey) => !keptSourceKeys.has(objectKey),
        ),
      ),
    ]);
  } catch (error) {
    console.error("Admin entertainment object cleanup failed", error);
  }
};

export const getAdminEntertainmentItems = async (
  locale: Locale = defaultLocale,
): Promise<AdminEntertainmentListItem[]> => {
  const items = await findAllEntertainmentItems();

  return items.map((item) => ({
    slug: item.slug,
    title:
      item.translations[locale]?.title ||
      item.translations[defaultLocale]?.title ||
      item.slug,
    category: item.category,
    mediaType: item.media.type,
    mediaStatus: item.media.type === "video" ? item.media.status : undefined,
    isActive: item.status.isActive,
    visibleOnHome: item.status.visibleOnHome,
    sortOrder: item.sortOrder,
    updatedAt: item.updatedAt,
  }));
};

export const getAdminEntertainmentEditorData = async (
  slug?: string,
): Promise<AdminEntertainmentEditorData | null> => {
  const normalizedSlug = slug?.trim();
  const [activeLocales, item] = await Promise.all([
    getActiveLocales(),
    normalizedSlug
      ? findEntertainmentItemBySlugForAdmin(normalizedSlug)
      : Promise.resolve(null),
  ]);

  if (normalizedSlug && !item) {
    return null;
  }

  return {
    item: item ?? createEmptyEntertainmentItem(),
    activeLocales,
  };
};

export const saveAdminEntertainmentItem = async (
  input: AdminEntertainmentUpsertInput,
) => {
  const translations = normalizeTranslations(input.translations);

  if (!translations[defaultLocale]?.title) {
    throw new AdminEntertainmentFormValidationError(
      AdminEntertainmentFormErrorCode.TitleRequired,
    );
  }

  const currentSlug = input.currentSlug?.trim() || undefined;
  const [existingItems, previous] = await Promise.all([
    findAllEntertainmentItems(),
    currentSlug
      ? findEntertainmentItemBySlugForAdmin(currentSlug)
      : Promise.resolve(null),
  ]);
  const slug = resolveEntertainmentSlug({
    requestedSlug: input.slug,
    translations,
    existingSlugs: new Set(existingItems.map((item) => item.slug)),
    currentSlug,
  });
  const media = buildEntertainmentMedia({ input, slug, previous });
  const now = new Date().toISOString();
  const item: EntertainmentItemDocument = {
    slug,
    category: input.category,
    media,
    status: input.status,
    sortOrder: Number.isFinite(input.sortOrder)
      ? input.sortOrder
      : DEFAULT_ENTERTAINMENT_SORT_ORDER,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
    translations,
  };

  await upsertEntertainmentItem(item, currentSlug);
  await removeOrphanedObjects(previous, item);

  return item;
};

export const deleteAdminEntertainmentItem = async (slug: string) => {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    throw new AdminEntertainmentFormValidationError(
      AdminEntertainmentFormErrorCode.DeleteFailed,
    );
  }

  const item = await findEntertainmentItemBySlugForAdmin(normalizedSlug);

  if (!item) {
    throw new AdminEntertainmentFormValidationError(
      AdminEntertainmentFormErrorCode.DeleteFailed,
    );
  }

  await deleteEntertainmentItemBySlug(normalizedSlug);

  const { publicKeys, sourceKeys } = collectEntertainmentObjectKeys(item);

  try {
    await Promise.all([
      deleteEntertainmentPublicObjects(publicKeys),
      deleteEntertainmentSourceObjects(sourceKeys),
    ]);
  } catch (error) {
    console.error("Admin entertainment object cleanup failed", error);
  }

  return item;
};
