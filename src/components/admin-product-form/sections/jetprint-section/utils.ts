import type { AdminStatusChipTone } from "@/components/admin-page-shared";
import type { JetprintVariantLink, PrintDesign } from "@/types/catalog";
import type { ProductOption } from "@/types/product-details";

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

export const toJetprintVariantRows = (
  variants: JetprintVariantLink[],
): AdminJetprintVariantRow[] =>
  variants.map((variant) => ({
    id: variant.sku,
    sku: variant.sku,
    size: variant.selections.size ?? "",
    color: variant.selections.color ?? "",
    isAvailable: variant.isAvailable,
    checkedAt: variant.checkedAt,
  }));

export const createJetprintVariantRow = (
  size = "",
  color = "",
): AdminJetprintVariantRow => ({
  id: crypto.randomUUID(),
  sku: "",
  size,
  color,
});

export const buildJetprintOptionRows = (
  sizes: ProductOption[],
  colors: ProductOption[],
): AdminJetprintVariantRow[] => {
  const sizeValues = sizes.length > 0 ? sizes.map(({ value }) => value) : [""];
  const colorValues =
    colors.length > 0 ? colors.map(({ value }) => value) : [""];

  return sizeValues.flatMap((size) =>
    colorValues.map((color) => createJetprintVariantRow(size, color)),
  );
};

export const serializeJetprintVariantRows = (rows: AdminJetprintVariantRow[]) =>
  JSON.stringify(
    rows.map(({ sku, size, color }) => ({
      sku,
      selections: { size, color },
    })),
  );

export const getJetprintVariantStatus = (
  row: AdminJetprintVariantRow,
  hasShippingData: boolean,
): {
  key: AdminJetprintVariantStatusKey;
  tone: AdminStatusChipTone;
} => {
  if (row.sku.trim() && !hasShippingData) {
    return { key: "noShipping", tone: "warning" };
  }

  if (row.isAvailable === false) {
    return { key: "unavailable", tone: "warning" };
  }

  if (!row.checkedAt) {
    return { key: "unchecked", tone: "neutral" };
  }

  return { key: "available", tone: "success" };
};
