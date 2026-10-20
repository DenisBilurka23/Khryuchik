import { useEffect, useEffectEvent, useRef, useState } from "react";

import { requestAdminProductJetprintUploadUrls } from "@/client-api/admin";
import type { JetprintFile } from "@/types/catalog";
import { uploadDirectToR2 } from "@/utils";

import { useAdminProductUploadRegistry } from "../../../upload-registry";
import type {
  JetprintFileUploadItem,
  UseJetprintFileUploadsOptions,
  UseJetprintFileUploadsResult,
} from "./useJetprintFileUploads.types";

const serializeFiles = (
  stored: JetprintFile[],
  pending: JetprintFileUploadItem[],
) =>
  JSON.stringify([
    ...stored,
    ...pending.flatMap((item) => (item.uploaded ? [item.uploaded] : [])),
  ]);

export const useJetprintFileUploads = ({
  locale,
  productId,
  existingFiles,
}: UseJetprintFileUploadsOptions): UseJetprintFileUploadsResult => {
  const [stored, setStored] = useState<JetprintFile[]>(existingFiles);
  const [pending, setPending] = useState<JetprintFileUploadItem[]>([]);
  const storedRef = useRef(stored);
  const pendingRef = useRef(pending);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const { register } = useAdminProductUploadRegistry();

  const commit = (
    nextStored: JetprintFile[],
    nextPending: JetprintFileUploadItem[],
  ) => {
    storedRef.current = nextStored;
    pendingRef.current = nextPending;
    setStored(nextStored);
    setPending(nextPending);

    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = serializeFiles(nextStored, nextPending);
    }
  };

  const patchItem = useEffectEvent(
    (id: string, patch: Partial<JetprintFileUploadItem>) => {
      commit(
        storedRef.current,
        pendingRef.current.map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      );
    },
  );

  useEffect(() => {
    const runUploads = async () => {
      const queue = pendingRef.current.filter(
        (item) => item.status === "pending" || item.status === "error",
      );

      if (queue.length === 0) {
        return;
      }

      queue.forEach((item) =>
        patchItem(item.id, { status: "uploading", progress: 0 }),
      );

      const response = await requestAdminProductJetprintUploadUrls({
        locale,
        productId,
        files: queue.map((item) => ({
          fileName: item.file.name,
          contentType: item.file.type,
        })),
      });
      const plans = response.ok ? response.data?.items : undefined;

      if (!plans || plans.length !== queue.length) {
        queue.forEach((item) => patchItem(item.id, { status: "error" }));
        throw new Error("Failed to obtain JetPrint upload URLs");
      }

      await Promise.all(
        queue.map(async (item, index) => {
          const plan = plans[index];

          try {
            await uploadDirectToR2({
              uploadUrl: plan.uploadUrl,
              file: item.file,
              contentType: plan.contentType,
              onProgress: (progress) => patchItem(item.id, { progress }),
            });
            patchItem(item.id, {
              status: "uploaded",
              progress: 1,
              uploaded: plan.file,
            });
          } catch (error) {
            patchItem(item.id, { status: "error" });
            throw error;
          }
        }),
      );
    };

    return register(runUploads);
  }, [locale, productId, register]);

  return {
    stored,
    pending,
    hiddenInputRef,
    initialValue: serializeFiles(existingFiles, []),
    addFiles: (files) =>
      commit(storedRef.current, [
        ...pendingRef.current,
        ...files.map((file) => ({
          id: crypto.randomUUID(),
          file,
          status: "pending" as const,
          progress: 0,
        })),
      ]),
    replaceFiles: (files) =>
      commit(
        [],
        files.map((file) => ({
          id: crypto.randomUUID(),
          file,
          status: "pending" as const,
          progress: 0,
        })),
      ),
    removeStored: (url) =>
      commit(
        storedRef.current.filter((file) => file.url !== url),
        pendingRef.current,
      ),
    removePending: (id) =>
      commit(
        storedRef.current,
        pendingRef.current.filter((item) => item.id !== id),
      ),
  };
};
