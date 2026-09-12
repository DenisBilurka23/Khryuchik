import "server-only";

import {
  ORPHAN_MIN_AGE_MS,
  ORPHAN_REPORT_SAMPLE_SIZE,
  ORPHAN_SWEEP_PREFIXES,
} from "@/constants/storage";
import { findAllProductDetails } from "@/server/catalog/repositories/product-details.repository";
import { findAllProducts } from "@/server/catalog/repositories/products.repository";
import { findAllEntertainmentItems } from "@/server/entertainment/repositories/entertainment.repository";
import { getEntertainmentHlsPrefix } from "@/utils";

import {
  deletePrivateObject,
  deletePublicObject,
  isR2Configured,
  listObjects,
  type R2BucketKind,
  type R2ObjectSummary,
} from "./r2";

export type OrphanReason = "abandonedUpload" | "removedLadder" | "failedLadder";

type ReasonTally = { count: number; bytes: number };

export type OrphanSweepSummary = {
  dryRun: boolean;
  scanned: number;
  candidates: number;
  bytes: number;
  deleted: number;
  byReason: Record<OrphanReason, ReasonTally>;
  sample: string[];
  skipped?: string;
};

type ReferencedKeys = {
  publicKeys: Set<string>;
  privateKeys: Set<string>;
  liveLadderPrefixes: Set<string>;
  failedLadderPrefixes: Set<string>;
  documentCount: number;
};

const LADDER_PATTERN = /^entertainment\/.+\/hls\//;

const collectReferencedKeys = async (): Promise<ReferencedKeys> => {
  const [items, products, details] = await Promise.all([
    findAllEntertainmentItems(),
    findAllProducts(),
    findAllProductDetails(),
  ]);

  const publicKeys = new Set<string>();
  const privateKeys = new Set<string>();
  const liveLadderPrefixes = new Set<string>();
  const failedLadderPrefixes = new Set<string>();

  for (const item of items) {
    for (const translation of Object.values(item.translations)) {
      if (translation?.poster?.objectKey) {
        publicKeys.add(translation.poster.objectKey);
      }
    }

    if (item.media.type === "download") {
      publicKeys.add(item.media.objectKey);
      continue;
    }

    if (item.media.source?.kind !== "hls") {
      continue;
    }

    const { sourceObjectKey, audioTracks, playlistUrl } = item.media.source;
    privateKeys.add(sourceObjectKey);

    for (const track of audioTracks ?? []) {
      if (track.sourceObjectKey) {
        privateKeys.add(track.sourceObjectKey);
      }
    }

    const ladderPrefix = getEntertainmentHlsPrefix(playlistUrl);

    if (ladderPrefix) {
      if (item.media.status === "failed") {
        failedLadderPrefixes.add(ladderPrefix);
      } else {
        liveLadderPrefixes.add(ladderPrefix);
      }
    }
  }

  for (const product of products) {
    for (const translation of Object.values(product.translations)) {
      if (translation?.thumbnail?.objectKey) {
        publicKeys.add(translation.thumbnail.objectKey);
      }
    }
  }

  for (const detail of details) {
    for (const translation of Object.values(detail.translations)) {
      for (const image of translation?.images ?? []) {
        if (image.objectKey) {
          publicKeys.add(image.objectKey);
        }
      }

      for (const asset of translation?.digitalAssets ?? []) {
        privateKeys.add(asset.objectKey);
      }
    }
  }

  return {
    publicKeys,
    privateKeys,
    liveLadderPrefixes,
    failedLadderPrefixes,
    documentCount: items.length + products.length + details.length,
  };
};

const startsWithAny = (objectKey: string, prefixes: Set<string>) => {
  for (const prefix of prefixes) {
    if (objectKey.startsWith(prefix)) {
      return true;
    }
  }

  return false;
};

const classifyObject = (
  objectKey: string,
  bucket: R2BucketKind,
  referenced: ReferencedKeys,
): OrphanReason | null => {
  if (LADDER_PATTERN.test(objectKey)) {
    if (startsWithAny(objectKey, referenced.liveLadderPrefixes)) {
      return null;
    }

    return startsWithAny(objectKey, referenced.failedLadderPrefixes)
      ? "failedLadder"
      : "removedLadder";
  }

  const owned =
    bucket === "public" ? referenced.publicKeys : referenced.privateKeys;

  return owned.has(objectKey) ? null : "abandonedUpload";
};

const emptyTally = (): Record<OrphanReason, ReasonTally> => ({
  abandonedUpload: { count: 0, bytes: 0 },
  removedLadder: { count: 0, bytes: 0 },
  failedLadder: { count: 0, bytes: 0 },
});

export const sweepOrphanedObjects = async ({
  dryRun,
}: {
  dryRun: boolean;
}): Promise<OrphanSweepSummary> => {
  const summary: OrphanSweepSummary = {
    dryRun,
    scanned: 0,
    candidates: 0,
    bytes: 0,
    deleted: 0,
    byReason: emptyTally(),
    sample: [],
  };

  if (!isR2Configured) {
    return { ...summary, skipped: "storageNotConfigured" };
  }

  const referenced = await collectReferencedKeys();

  if (referenced.documentCount === 0) {
    return { ...summary, skipped: "noDocuments" };
  }

  const cutoff = Date.now() - ORPHAN_MIN_AGE_MS;
  const buckets: R2BucketKind[] = ["public", "private"];

  for (const bucket of buckets) {
    for (const prefix of ORPHAN_SWEEP_PREFIXES[bucket]) {
      let objects: R2ObjectSummary[];

      try {
        objects = await listObjects({ bucket, prefix });
      } catch (error) {
        console.error("Orphan sweep listing failed", { bucket, prefix, error });

        continue;
      }

      for (const object of objects) {
        summary.scanned += 1;

        const modifiedAt = object.lastModified?.getTime() ?? 0;

        if (modifiedAt > cutoff) {
          continue;
        }

        const reason = classifyObject(object.objectKey, bucket, referenced);

        if (!reason) {
          continue;
        }

        summary.candidates += 1;
        summary.bytes += object.sizeBytes;
        summary.byReason[reason].count += 1;
        summary.byReason[reason].bytes += object.sizeBytes;

        if (summary.sample.length < ORPHAN_REPORT_SAMPLE_SIZE) {
          summary.sample.push(`${reason} ${bucket} ${object.objectKey}`);
        }

        if (dryRun) {
          continue;
        }

        try {
          await (bucket === "public"
            ? deletePublicObject(object.objectKey)
            : deletePrivateObject(object.objectKey));
          summary.deleted += 1;
        } catch (error) {
          console.error("Orphan sweep delete failed", {
            objectKey: object.objectKey,
            error,
          });
        }
      }
    }
  }

  return summary;
};
