import type { AdminStatusChipTone } from "@/components/admin-page-shared";
import type {
  JetprintBlank,
  JetprintBlankCatalog,
  JetprintVariantLink,
  PrintDesign,
} from "@/types/catalog";

import type { AdminJetprintBlankOption } from "./blank-field/types";
import type { JetprintFileUploadStatus } from "./hooks/useJetprintFileUploads.types";
import type { EditablePrintDesign } from "./print-editor/types";
import type {
  AdminJetprintVariantRow,
  AdminJetprintVariantStatusKey,
} from "./variants-field/types";

export const toEditablePrintDesign = (
  design: PrintDesign | undefined,
): EditablePrintDesign | null =>
  design
    ? {
        template: {
          width: design.template.width,
          height: design.template.height,
          dpi: design.template.dpi,
          bleedBox: design.template.bleedBox,
          safeBox: design.template.safeBox,
          guides: { url: design.template.guidesUrl },
          cutMask: { url: design.template.cutMaskUrl },
        },
        art: {
          width: design.art.width,
          height: design.art.height,
          source: { url: design.art.url },
        },
        layout: design.layout,
      }
    : null;

export const serializePrintDesign = (design: EditablePrintDesign | null) => {
  if (
    !design ||
    design.template.guides.file ||
    design.template.cutMask.file ||
    design.art.source.file
  ) {
    return "";
  }

  return JSON.stringify({
    template: {
      width: design.template.width,
      height: design.template.height,
      dpi: design.template.dpi,
      bleedBox: design.template.bleedBox,
      safeBox: design.template.safeBox,
      guidesUrl: design.template.guides.url,
      cutMaskUrl: design.template.cutMask.url,
    },
    art: {
      url: design.art.source.url,
      width: design.art.width,
      height: design.art.height,
    },
    layout: design.layout,
  } satisfies PrintDesign);
};

export const getJetprintFileStatusColor = (status: JetprintFileUploadStatus) =>
  status === "error"
    ? "error.main"
    : status === "uploaded"
      ? "success.main"
      : "text.secondary";

export const toJetprintBlankOptions = (
  catalog: JetprintBlankCatalog,
): AdminJetprintBlankOption[] =>
  Object.entries(catalog).map(([id, blank]) => ({ id, name: blank.name }));

export const toJetprintVariantRows = (
  blank: JetprintBlank,
  savedVariants: JetprintVariantLink[],
): AdminJetprintVariantRow[] => {
  const savedBySku = new Map(
    savedVariants.map((variant) => [variant.sku, variant]),
  );

  return blank.variants.map((variant) => {
    const saved = savedBySku.get(variant.sku);

    return {
      ...variant,
      ...(saved ? { isAvailable: saved.isAvailable } : {}),
      ...(saved?.checkedAt ? { checkedAt: saved.checkedAt } : {}),
    };
  });
};

export const getInitialJetprintSkus = (
  blank: JetprintBlank,
  savedVariants: JetprintVariantLink[],
) => {
  const saved = new Set(savedVariants.map((variant) => variant.sku));
  const kept = blank.variants
    .map((variant) => variant.sku)
    .filter((sku) => saved.has(sku));

  return kept.length > 0 ? kept : blank.variants.map((variant) => variant.sku);
};

export const getJetprintVariantStatus = (
  row: Pick<AdminJetprintVariantRow, "isAvailable" | "checkedAt">,
): {
  key: AdminJetprintVariantStatusKey;
  tone: AdminStatusChipTone;
} => {
  if (row.isAvailable === false) {
    return { key: "unavailable", tone: "warning" };
  }

  if (!row.checkedAt) {
    return { key: "unchecked", tone: "neutral" };
  }

  return { key: "available", tone: "success" };
};
