import type { JetprintBlankVariant } from "@/types/catalog";
import type {
  ProductOption,
  ProductOptionPriceDelta,
} from "@/types/product-details";
import { toProductOptionValue } from "@/utils/product-options";

type RawImage = {
  id: number;
  url: string;
  checked: boolean;
};

type RawVariant = {
  checked: boolean;
  retailPrice: number;
  blankProductSkuId: number;
};

type RawCanvasObject = {
  type: string;
  id?: string;
  originX?: string;
  originY?: string;
  left: number;
  top: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  angle?: number;
  flipX?: boolean;
  flipY?: boolean;
  visible?: boolean;
  fileUrl?: string;
  src?: string;
  fileName?: string;
};

type RawDesignSide = {
  svg: { objects: RawCanvasObject[] };
};

export type RawJetprintMyProduct = {
  customProductInfo: {
    blankProductId: number;
    title: string;
    description?: string;
    tags?: string;
    mainImageId?: number;
  };
  images: RawImage[];
  variants: RawVariant[];
  designDataJson: string;
};

export type JetprintMyProduct = {
  blankId: string;
  title: string;
  description: string;
  tags: string[];
  price: number;
  variants: { blankSkuId: number; price: number }[];
  imageUrls: string[];
};

export type JetprintArtLayer = {
  url: string;
  fileName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  flipX: boolean;
  flipY: boolean;
};

export class JetprintProductParseError extends Error {}

const WORKSPACE_ID = "workspace";

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

const decodeEntity = (entity: string, name: string) => {
  if (name.startsWith("#x") || name.startsWith("#X")) {
    return String.fromCodePoint(Number.parseInt(name.slice(2), 16));
  }

  if (name.startsWith("#")) {
    return String.fromCodePoint(Number.parseInt(name.slice(1), 10));
  }

  return NAMED_ENTITIES[name.toLowerCase()] ?? entity;
};

export const htmlToPlainText = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|ul|ol)>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, decodeEntity)
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const toTags = (tags: string | undefined) =>
  (tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const pickImageUrls = (images: RawImage[], mainImageId?: number) => {
  const checked = images.filter((image) => image.checked);
  const main = checked.find((image) => image.id === mainImageId);

  return (
    main ? [main, ...checked.filter((image) => image !== main)] : checked
  ).map((image) => image.url);
};

export const toJetprintMyProduct = (
  raw: RawJetprintMyProduct,
): JetprintMyProduct => {
  const info = raw.customProductInfo;

  if (!info) {
    throw new JetprintProductParseError(
      "This is not a My Products response: customProductInfo is missing",
    );
  }

  const selectedVariants = raw.variants.filter((variant) => variant.checked);
  const prices = selectedVariants.map((variant) => variant.retailPrice);

  if (prices.length === 0) {
    throw new JetprintProductParseError("The product has no selected variants");
  }

  const imageUrls = pickImageUrls(raw.images, info.mainImageId);

  if (imageUrls.length === 0) {
    throw new JetprintProductParseError("The product has no selected images");
  }

  return {
    blankId: String(info.blankProductId),
    title: info.title.trim(),
    description: htmlToPlainText(info.description ?? ""),
    tags: toTags(info.tags),
    price: Math.min(...prices),
    variants: selectedVariants.map((variant) => ({
      blankSkuId: variant.blankProductSkuId,
      price: variant.retailPrice,
    })),
    imageUrls,
  };
};

export const parsePrintAreaSize = (value: string | undefined) => {
  const match = value?.match(/(\d+)\s*[x×]\s*(\d+)/i);

  return match
    ? { width: Number(match[1]), height: Number(match[2]) }
    : undefined;
};

const parseDesignSides = (designDataJson: string): RawDesignSide[] => {
  try {
    return JSON.parse(designDataJson);
  } catch {
    throw new JetprintProductParseError("designDataJson is not valid JSON");
  }
};

const assertSupportedObject = (object: RawCanvasObject) => {
  if (object.type !== "image") {
    throw new JetprintProductParseError(
      `Unsupported design element "${object.type}": only images are rendered`,
    );
  }

  if ((object.angle ?? 0) % 360 !== 0) {
    throw new JetprintProductParseError(
      `Rotated artwork (${object.angle}°) is not supported`,
    );
  }

  if (
    (object.originX ?? "left") !== "left" ||
    (object.originY ?? "top") !== "top"
  ) {
    throw new JetprintProductParseError(
      "Artwork anchored away from its top-left corner is not supported",
    );
  }
};

export const toJetprintArtLayers = (
  designDataJson: string,
  template: { width: number; height: number },
): JetprintArtLayer[] => {
  const sides = parseDesignSides(designDataJson);

  if (sides.length !== 1) {
    throw new JetprintProductParseError(
      `The design has ${sides.length} print areas; only single-area designs are supported`,
    );
  }

  const objects = sides[0].svg.objects;
  const workspace = objects.find((object) => object.id === WORKSPACE_ID);

  if (!workspace) {
    throw new JetprintProductParseError("The design has no workspace");
  }

  const scaleX = template.width / (workspace.width * workspace.scaleX);
  const scaleY = template.height / (workspace.height * workspace.scaleY);

  const layers = objects
    .filter((object) => object !== workspace && object.visible !== false)
    .map((object) => {
      assertSupportedObject(object);

      const url = object.fileUrl ?? object.src;

      if (!url) {
        throw new JetprintProductParseError("An artwork layer has no URL");
      }

      return {
        url,
        fileName: object.fileName?.trim() || "artwork",
        x: (object.left - workspace.left) * scaleX,
        y: (object.top - workspace.top) * scaleY,
        width: object.width * object.scaleX * scaleX,
        height: object.height * object.scaleY * scaleY,
        flipX: Boolean(object.flipX),
        flipY: Boolean(object.flipY),
      };
    });

  if (layers.length === 0) {
    throw new JetprintProductParseError("The design has no artwork");
  }

  return layers;
};

type OptionAxis = "size" | "color";

const roundPrice = (value: number) => Math.round(value * 100) / 100;

export const applyJetprintPriceDeltas = ({
  options,
  variants,
  priceBySku,
  basePrice,
  currencies,
}: {
  options: { sizes: ProductOption[]; colors: ProductOption[] };
  variants: JetprintBlankVariant[];
  priceBySku: Map<string, number>;
  basePrice: number;
  currencies: string[];
}) => {
  const priced = variants.filter((variant) => priceBySku.has(variant.sku));
  const prices = new Set(priced.map((variant) => priceBySku.get(variant.sku)));

  if (prices.size <= 1) {
    return { options, isPricedPerOption: true };
  }

  if (priced.some((variant) => variant.size && variant.color)) {
    return { options, isPricedPerOption: false };
  }

  const withDelta = (axis: OptionAxis) => (option: ProductOption) => {
    const optionPrices = priced.flatMap((variant) => {
      const label = variant[axis];
      const price = priceBySku.get(variant.sku);

      return label &&
        price !== undefined &&
        toProductOptionValue(label) === option.value
        ? [price]
        : [];
    });
    const delta =
      optionPrices.length > 0
        ? roundPrice(Math.min(...optionPrices) - basePrice)
        : 0;

    return delta > 0
      ? {
          ...option,
          priceDelta: Object.fromEntries(
            currencies.map((currency) => [currency, delta]),
          ) as ProductOptionPriceDelta,
        }
      : option;
  };

  return {
    options: {
      sizes: options.sizes.map(withDelta("size")),
      colors: options.colors.map(withDelta("color")),
    },
    isPricedPerOption: true,
  };
};
