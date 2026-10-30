import "server-only";

import { PRINT_DESIGN_DEFAULT_DPI } from "@/constants/print-design";
import { jetprintBlankCatalog } from "@/data/jetprint-blank-catalog";
import {
  parseBoolean,
  parseJsonField,
  parseOptionalString,
} from "@/server/admin/form-fields";
import type {
  JetprintFile,
  PrintDesign,
  PrintDesignBox,
  ProductJetprintLink,
} from "@/types/catalog";
import { buildJetprintVariantLinks } from "@/utils";

const readTrimmed = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const parseJetprintFiles = (formData: FormData, key: string): JetprintFile[] =>
  parseJsonField<unknown[]>(formData, key, []).flatMap((entry) => {
    if (!entry || typeof entry !== "object") {
      return [];
    }

    const { name, url, objectKey } = entry as Record<string, unknown>;
    const trimmedUrl = readTrimmed(url);
    const trimmedObjectKey = readTrimmed(objectKey);

    return trimmedUrl
      ? [
          {
            name: readTrimmed(name),
            url: trimmedUrl,
            ...(trimmedObjectKey ? { objectKey: trimmedObjectKey } : {}),
          },
        ]
      : [];
  });

const parseJetprintBlankId = (formData: FormData) => {
  const blankId = parseOptionalString(formData, "jetprint.blankId");

  return blankId && jetprintBlankCatalog[blankId] ? blankId : undefined;
};

const parseJetprintSkus = (formData: FormData) =>
  parseJsonField<unknown[]>(formData, "jetprint.skusJson", []).flatMap((sku) =>
    typeof sku === "string" && sku.trim() ? [sku] : [],
  );

const readFiniteNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const readPositiveNumber = (value: unknown) => {
  const number = readFiniteNumber(value);

  return number !== undefined && number > 0 ? number : undefined;
};

const readHttpUrl = (value: unknown) => {
  const url = readTrimmed(value);

  return /^https?:\/\//i.test(url) ? url : undefined;
};

const readPrintDesignBox = (value: unknown): PrintDesignBox | undefined => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const { x, y, width, height } = value as Record<string, unknown>;
  const box = {
    x: readFiniteNumber(x),
    y: readFiniteNumber(y),
    width: readPositiveNumber(width),
    height: readPositiveNumber(height),
  };

  return box.x !== undefined &&
    box.y !== undefined &&
    box.width !== undefined &&
    box.height !== undefined
    ? { x: box.x, y: box.y, width: box.width, height: box.height }
    : undefined;
};

const parseJetprintPrintDesign = (
  formData: FormData,
): PrintDesign | undefined => {
  const raw = parseJsonField<Record<string, unknown> | null>(
    formData,
    "jetprint.printDesignJson",
    null,
  );

  if (!raw || typeof raw !== "object") {
    return undefined;
  }

  const template = (raw.template ?? {}) as Record<string, unknown>;
  const art = (raw.art ?? {}) as Record<string, unknown>;
  const layout = (raw.layout ?? {}) as Record<string, unknown>;
  const templateWidth = readPositiveNumber(template.width);
  const templateHeight = readPositiveNumber(template.height);
  const templateDpi =
    readPositiveNumber(template.dpi) ?? PRINT_DESIGN_DEFAULT_DPI;
  const bleedBox = readPrintDesignBox(template.bleedBox);
  const safeBox = readPrintDesignBox(template.safeBox);
  const guidesUrl = readHttpUrl(template.guidesUrl);
  const cutMaskUrl = readHttpUrl(template.cutMaskUrl);
  const artUrl = readHttpUrl(art.url);
  const artWidth = readPositiveNumber(art.width);
  const artHeight = readPositiveNumber(art.height);
  const layoutX = readFiniteNumber(layout.x);
  const layoutY = readFiniteNumber(layout.y);
  const layoutScale = readPositiveNumber(layout.scale);

  if (
    !templateWidth ||
    !templateHeight ||
    !bleedBox ||
    !safeBox ||
    !guidesUrl ||
    !cutMaskUrl ||
    !artUrl ||
    !artWidth ||
    !artHeight ||
    layoutX === undefined ||
    layoutY === undefined ||
    !layoutScale
  ) {
    return undefined;
  }

  return {
    template: {
      width: templateWidth,
      height: templateHeight,
      dpi: templateDpi,
      bleedBox,
      safeBox,
      guidesUrl,
      cutMaskUrl,
    },
    art: { url: artUrl, width: artWidth, height: artHeight },
    layout: { x: layoutX, y: layoutY, scale: layoutScale },
  };
};

export const parseProductJetprint = (
  formData: FormData,
): ProductJetprintLink | undefined => {
  if (!parseBoolean(formData, "jetprint.enabled")) {
    return undefined;
  }

  const printDesign = parseJetprintPrintDesign(formData);
  const blankId = parseJetprintBlankId(formData);

  return {
    ...(blankId ? { blankId } : {}),
    variants: blankId
      ? buildJetprintVariantLinks(
          jetprintBlankCatalog[blankId],
          parseJetprintSkus(formData),
        )
      : [],
    printFiles: parseJetprintFiles(formData, "jetprint.printFilesJson"),
    previewFiles: [],
    ...(printDesign ? { printDesign } : {}),
  };
};
