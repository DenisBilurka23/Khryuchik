"use client";

import { useCallback, useRef, useState } from "react";

import { requestAdminEntertainmentUploadUrl } from "@/client-api/admin";
import type { AdminEntertainmentUploadedFile } from "@/types/admin";
import { uploadDirectToR2 } from "@/utils";

import type {
  AdminEntertainmentUploadErrorCode,
  AdminEntertainmentUploadState,
  UseAdminEntertainmentUploadOptions,
  UseAdminEntertainmentUploadResult,
} from "./useAdminEntertainmentUpload.types";

const IDLE_STATE: AdminEntertainmentUploadState = {
  status: "idle",
  progress: 0,
};

export const useAdminEntertainmentUpload = ({
  kind,
  contentTypes,
  maxBytes,
  slug,
  locale,
}: UseAdminEntertainmentUploadOptions): UseAdminEntertainmentUploadResult => {
  const [state, setState] = useState<AdminEntertainmentUploadState>(IDLE_STATE);
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setState(IDLE_STATE);
  }, []);

  const upload = useCallback(
    async (file: File) => {
      const fail = (errorCode: AdminEntertainmentUploadErrorCode) => {
        setState({
          status: "error",
          progress: 0,
          fileName: file.name,
          errorCode,
        });

        return null;
      };

      if (!contentTypes.includes(file.type)) {
        return fail("invalidType");
      }

      if (file.size <= 0 || file.size > maxBytes) {
        return fail("tooLarge");
      }

      abortControllerRef.current?.abort();

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setState({ status: "uploading", progress: 0, fileName: file.name });

      const response = await requestAdminEntertainmentUploadUrl({
        kind,
        slug,
        locale,
        file: {
          fileName: file.name,
          contentType: file.type,
          sizeBytes: file.size,
        },
      });
      const plan = response.data?.item;

      if (!response.ok || !plan) {
        return fail("presignFailed");
      }

      try {
        await uploadDirectToR2({
          uploadUrl: plan.uploadUrl,
          file,
          contentType: plan.contentType,
          signal: abortController.signal,
          onProgress: (progress) => {
            setState((current) =>
              current.status === "uploading"
                ? { ...current, progress }
                : current,
            );
          },
        });
      } catch (error) {
        if (abortController.signal.aborted) {
          return null;
        }

        console.error("Entertainment upload failed", error);

        return fail("uploadFailed");
      }

      abortControllerRef.current = null;

      const uploadedFile: AdminEntertainmentUploadedFile = {
        objectKey: plan.objectKey,
        fileName: plan.fileName,
        contentType: plan.contentType,
        sizeBytes: file.size,
        url: plan.url,
      };

      setState({
        status: "uploaded",
        progress: 1,
        fileName: plan.fileName,
        file: uploadedFile,
      });

      return uploadedFile;
    },
    [contentTypes, kind, locale, maxBytes, slug],
  );

  return { state, upload, reset };
};
