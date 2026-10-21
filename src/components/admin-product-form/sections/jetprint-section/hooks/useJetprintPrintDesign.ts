import { useEffect, useEffectEvent, useRef, useState } from "react";

import { requestAdminProductJetprintUploadUrls } from "@/client-api/admin";
import { uploadDirectToR2 } from "@/utils";

import { useAdminProductUploadRegistry } from "../../../upload-registry";
import type {
  EditablePrintDesign,
  PrintDesignAsset,
} from "../print-editor/types";
import { serializePrintDesign, toEditablePrintDesign } from "../utils";
import type {
  UseJetprintPrintDesignOptions,
  UseJetprintPrintDesignResult,
} from "./useJetprintPrintDesign.types";

export const useJetprintPrintDesign = ({
  locale,
  productId,
  initialDesign,
}: UseJetprintPrintDesignOptions): UseJetprintPrintDesignResult => {
  const [design, setDesignState] = useState(() =>
    toEditablePrintDesign(initialDesign),
  );
  const designRef = useRef(design);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const { register } = useAdminProductUploadRegistry();

  const commit = (next: EditablePrintDesign | null) => {
    designRef.current = next;
    setDesignState(next);

    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = serializePrintDesign(next);
    }
  };

  const uploadPendingAssets = useEffectEvent(async () => {
    const current = designRef.current;

    if (!current) {
      return;
    }

    const pending = [
      current.template.guides,
      current.template.cutMask,
      current.art.source,
    ].filter((asset): asset is PrintDesignAsset & { file: File } =>
      Boolean(asset.file),
    );

    if (pending.length === 0) {
      return;
    }

    const response = await requestAdminProductJetprintUploadUrls({
      locale,
      productId,
      files: pending.map(({ file }) => ({
        fileName: file.name,
        contentType: file.type,
      })),
    });
    const plans = response.ok ? response.data?.items : undefined;

    if (!plans || plans.length !== pending.length) {
      throw new Error("Failed to obtain print design upload URLs");
    }

    const uploadedUrls = new Map<PrintDesignAsset, string>();

    await Promise.all(
      pending.map(async (asset, index) => {
        await uploadDirectToR2({
          uploadUrl: plans[index].uploadUrl,
          file: asset.file,
          contentType: plans[index].contentType,
        });
        uploadedUrls.set(asset, plans[index].file.url);
      }),
    );

    const settle = (asset: PrintDesignAsset): PrintDesignAsset => {
      const url = uploadedUrls.get(asset);

      return url ? { url } : asset;
    };

    commit({
      ...current,
      template: {
        ...current.template,
        guides: settle(current.template.guides),
        cutMask: settle(current.template.cutMask),
      },
      art: { ...current.art, source: settle(current.art.source) },
    });
  });

  useEffect(() => register(() => uploadPendingAssets()), [register]);

  return {
    design,
    setDesign: commit,
    hiddenInputRef,
    value: serializePrintDesign(design),
  };
};
