import "server-only";

import {
  DEFAULT_ENTERTAINMENT_CATEGORY,
  DEFAULT_ENTERTAINMENT_SORT_ORDER,
  ENTERTAINMENT_LANGUAGE_CODE_PATTERN,
  ENTERTAINMENT_MAX_AUDIO_TRACKS,
  ENTERTAINMENT_MAX_SUBTITLE_TRACKS,
} from "@/constants/entertainment";
import { defaultLocale, type Locale } from "@/i18n/config";
import {
  AdminEntertainmentFormErrorCode,
  AdminEntertainmentFormValidationError,
} from "@/server/admin/entertainment-form-state";
import { getActiveLocales } from "@/server/localization/localization.service";
import {
  buildEntertainmentGeneratedSubtitleKey,
  buildEntertainmentPlaylistUrl,
  buildEntertainmentSubtitleUrl,
  deleteEntertainmentHlsPrefix,
  deleteEntertainmentPublicObjects,
  deleteEntertainmentSourceObjects,
} from "@/server/storage/r2-assets.service";
import type {
  AdminEntertainmentEditorData,
  AdminEntertainmentListItem,
  AdminEntertainmentUpsertInput,
} from "@/types/admin";
import type {
  EntertainmentAudioTrack,
  EntertainmentItemDocument,
  EntertainmentMedia,
  EntertainmentSubtitleTrack,
  EntertainmentTranslation,
  EntertainmentVideoMedia,
} from "@/types/entertainment";
import {
  getEntertainmentFallbackTranslation,
  getEntertainmentHlsPrefix,
} from "@/utils";
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
    normalizeIdentifierPart(
      getEntertainmentFallbackTranslation(translations)?.title ?? "",
    ) ||
    SLUG_FALLBACK;

  return buildUniqueValue(
    baseSlug,
    (candidate) => candidate !== currentSlug && existingSlugs.has(candidate),
  );
};

const normalizeLanguageCode = (value: string) => value.trim().toLowerCase();

const previousTracks = (
  video: EntertainmentVideoMedia | null,
): EntertainmentAudioTrack[] =>
  video?.source?.kind === "hls" ? (video.source.audioTracks ?? []) : [];

const buildEntertainmentAudioTracks = ({
  input,
  previousTracks,
  isMasterReplaced,
}: {
  input: AdminEntertainmentUpsertInput;
  previousTracks: EntertainmentAudioTrack[];
  isMasterReplaced: boolean;
}): EntertainmentAudioTrack[] => {
  const rows = input.media.audioTracks ?? [];

  if (rows.length === 0) {
    return [];
  }

  if (rows.length > ENTERTAINMENT_MAX_AUDIO_TRACKS) {
    throw new AdminEntertainmentFormValidationError(
      AdminEntertainmentFormErrorCode.AudioLanguageDuplicate,
    );
  }

  const previousByLanguage = new Map(
    previousTracks.map((track) => [track.language, track]),
  );
  const seen = new Set<string>();

  const tracks = rows.map((row) => {
    const language = normalizeLanguageCode(row.language ?? "");

    if (!language) {
      throw new AdminEntertainmentFormValidationError(
        AdminEntertainmentFormErrorCode.AudioLanguageRequired,
      );
    }

    if (!ENTERTAINMENT_LANGUAGE_CODE_PATTERN.test(language)) {
      throw new AdminEntertainmentFormValidationError(
        AdminEntertainmentFormErrorCode.AudioLanguageInvalid,
      );
    }

    if (seen.has(language)) {
      throw new AdminEntertainmentFormValidationError(
        AdminEntertainmentFormErrorCode.AudioLanguageDuplicate,
      );
    }

    seen.add(language);

    const previous = previousByLanguage.get(language);
    const uploadedFile = row.uploadedFile;

    if (row.isDefault) {
      return {
        id: language,
        language,
        isDefault: true,
        status:
          isMasterReplaced || !previous || previous.status !== "ready"
            ? ("processing" as const)
            : previous.status,
      };
    }

    const sourceObjectKey =
      uploadedFile?.objectKey ?? previous?.sourceObjectKey;

    if (!sourceObjectKey) {
      throw new AdminEntertainmentFormValidationError(
        AdminEntertainmentFormErrorCode.AudioFileRequired,
      );
    }

    const isUnchanged =
      !uploadedFile && !isMasterReplaced && previous?.status === "ready";

    return {
      id: language,
      language,
      isDefault: false,
      sourceObjectKey,
      status: isUnchanged ? ("ready" as const) : ("processing" as const),
    };
  });

  if (tracks.filter((track) => track.isDefault).length !== 1) {
    throw new AdminEntertainmentFormValidationError(
      AdminEntertainmentFormErrorCode.AudioLanguageRequired,
    );
  }

  return tracks;
};

const buildEntertainmentSubtitleTracks = ({
  input,
  previousTracks,
  playlistUrl,
}: {
  input: AdminEntertainmentUpsertInput;
  previousTracks: EntertainmentSubtitleTrack[];
  playlistUrl: string;
}): EntertainmentSubtitleTrack[] => {
  const rows = input.media.subtitleTracks ?? [];

  if (rows.length === 0) {
    return [];
  }

  if (rows.length > ENTERTAINMENT_MAX_SUBTITLE_TRACKS) {
    throw new AdminEntertainmentFormValidationError(
      AdminEntertainmentFormErrorCode.SubtitleLanguageDuplicate,
    );
  }

  const previousByLanguage = new Map(
    previousTracks.map((track) => [track.language, track]),
  );
  const seen = new Set<string>();

  return rows.map((row) => {
    const language = normalizeLanguageCode(row.language ?? "");

    if (!language) {
      throw new AdminEntertainmentFormValidationError(
        AdminEntertainmentFormErrorCode.SubtitleLanguageRequired,
      );
    }

    if (!ENTERTAINMENT_LANGUAGE_CODE_PATTERN.test(language)) {
      throw new AdminEntertainmentFormValidationError(
        AdminEntertainmentFormErrorCode.SubtitleLanguageInvalid,
      );
    }

    if (seen.has(language)) {
      throw new AdminEntertainmentFormValidationError(
        AdminEntertainmentFormErrorCode.SubtitleLanguageDuplicate,
      );
    }

    seen.add(language);

    const previous = previousByLanguage.get(language);
    const uploadedFile = row.uploadedFile;

    if (uploadedFile && !uploadedFile.url) {
      throw new AdminEntertainmentFormValidationError(
        AdminEntertainmentFormErrorCode.StorageUnavailable,
      );
    }

    if (row.generate && !uploadedFile) {
      const hlsPrefix = getEntertainmentHlsPrefix(playlistUrl);
      const generatedKey = hlsPrefix
        ? buildEntertainmentGeneratedSubtitleKey({
            hlsPrefix,
            trackId: language,
          })
        : undefined;
      const generatedUrl = generatedKey
        ? buildEntertainmentSubtitleUrl(generatedKey)
        : undefined;

      if (!generatedKey || !generatedUrl) {
        throw new AdminEntertainmentFormValidationError(
          AdminEntertainmentFormErrorCode.StorageUnavailable,
        );
      }

      return {
        id: language,
        language,
        objectKey: generatedKey,
        url: generatedUrl,
        source: "generated" as const,
        isPublished: false,
        status: "processing" as const,
      };
    }

    const objectKey = uploadedFile?.objectKey ?? previous?.objectKey;
    const url = uploadedFile?.url ?? previous?.url;

    if (!objectKey || !url) {
      throw new AdminEntertainmentFormValidationError(
        AdminEntertainmentFormErrorCode.SubtitleFileRequired,
      );
    }

    return {
      id: language,
      language,
      objectKey,
      url,
      source: uploadedFile ? "manual" : (previous?.source ?? "manual"),
      isPublished: row.isPublished,
      ...(uploadedFile || !previous?.status
        ? {}
        : { status: previous.status, failureReason: previous.failureReason }),
    };
  });
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
  const width = input.media.width ?? previousVideo?.width;
  const height = input.media.height ?? previousVideo?.height;

  if (!uploadedFile) {
    if (!previousVideo?.source) {
      throw new AdminEntertainmentFormValidationError(
        AdminEntertainmentFormErrorCode.VideoRequired,
      );
    }

    const audioTracks = buildEntertainmentAudioTracks({
      input,
      previousTracks: previousTracks(previousVideo),
      isMasterReplaced: false,
    });

    return {
      ...previousVideo,
      durationSeconds,
      width,
      height,
      subtitleTracks: buildEntertainmentSubtitleTracks({
        input,
        previousTracks: previousVideo.subtitleTracks ?? [],
        playlistUrl:
          previousVideo.source.kind === "hls"
            ? previousVideo.source.playlistUrl
            : "",
      }),
      source:
        previousVideo.source.kind === "hls"
          ? { ...previousVideo.source, audioTracks }
          : previousVideo.source,
    };
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
      audioTracks: buildEntertainmentAudioTracks({
        input,
        previousTracks: previousTracks(previousVideo),
        isMasterReplaced: true,
      }),
    },
    subtitleTracks: buildEntertainmentSubtitleTracks({
      input,
      previousTracks: previousVideo?.subtitleTracks ?? [],
      playlistUrl,
    }),
    status: "processing",
    durationSeconds,
    width,
    height,
  };
};

const collectEntertainmentObjectKeys = (
  item: EntertainmentItemDocument | null,
) => {
  if (!item) {
    return {
      publicKeys: [] as string[],
      sourceKeys: [] as string[],
      hlsPrefix: null as string | null,
    };
  }

  const posterKeys = Object.values(item.translations)
    .map((translation) => translation?.poster?.objectKey)
    .filter((objectKey): objectKey is string => Boolean(objectKey));
  const hlsSource =
    item.media.type === "video" && item.media.source?.kind === "hls"
      ? item.media.source
      : null;

  const subtitleKeys =
    item.media.type === "video"
      ? (item.media.subtitleTracks ?? []).map((track) => track.objectKey)
      : [];

  return {
    publicKeys:
      item.media.type === "download"
        ? [...posterKeys, item.media.objectKey]
        : [...posterKeys, ...subtitleKeys],
    sourceKeys: hlsSource
      ? [
          hlsSource.sourceObjectKey,
          ...(hlsSource.audioTracks ?? [])
            .map((track) => track.sourceObjectKey)
            .filter((objectKey): objectKey is string => Boolean(objectKey)),
        ]
      : [],
    hlsPrefix: hlsSource
      ? getEntertainmentHlsPrefix(hlsSource.playlistUrl)
      : null,
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
  const orphanedHlsPrefix =
    previousKeys.hlsPrefix && previousKeys.hlsPrefix !== nextKeys.hlsPrefix
      ? previousKeys.hlsPrefix
      : null;

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
      orphanedHlsPrefix
        ? deleteEntertainmentHlsPrefix(orphanedHlsPrefix)
        : Promise.resolve(),
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
      getEntertainmentFallbackTranslation(item.translations)?.title ||
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

  if (!getEntertainmentFallbackTranslation(translations)) {
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

  const { publicKeys, sourceKeys, hlsPrefix } =
    collectEntertainmentObjectKeys(item);

  try {
    await Promise.all([
      deleteEntertainmentPublicObjects(publicKeys),
      deleteEntertainmentSourceObjects(sourceKeys),
      hlsPrefix ? deleteEntertainmentHlsPrefix(hlsPrefix) : Promise.resolve(),
    ]);
  } catch (error) {
    console.error("Admin entertainment object cleanup failed", error);
  }

  return item;
};
