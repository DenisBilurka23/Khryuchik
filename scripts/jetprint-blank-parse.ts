import type {
  JetprintBlank,
  JetprintBlankVariant,
  JetprintShippingGroup,
} from "@/types/catalog";

type RawPriceItem = {
  pricePerKilo: number;
  registrationFee: number;
  weightMin: number;
  weightMax: number;
};

type RawShippingGroup = {
  countryGroupName: string;
  countryItems: { countryCode: string }[];
  deliveryTime: string;
  priceItems: RawPriceItem[];
};

type RawLogisticsMethod = {
  name: string;
  items: RawShippingGroup[];
};

type RawSkuTreeNode = {
  optionName: string;
  optionValue: string;
  variantIds?: number[];
  children?: RawSkuTreeNode[];
};

type RawSkuMap = {
  name: string;
  items: { name: string; option?: string }[];
};

export type RawJetprintBlank = {
  id: number;
  blankProductInfo: { model: string; productionTime: string };
  skuInfos: { id: number; skuName: string; weight: number }[];
  skuTrees?: RawSkuTreeNode[];
  skuMaps?: RawSkuMap[];
  logisticsMethodInfos: RawLogisticsMethod[];
};

type VariantAxis = "size" | "color";

type VariantLeaf = {
  id: number;
  path: { axis: VariantAxis; value: string }[];
};

export class JetprintBlankParseError extends Error {}

const STANDARD_SHIPPING = "Standard Shipping";
const EMPTY_BAND_MAX_KG = 0.01;
const AXIS_PATTERNS: Record<VariantAxis, RegExp> = {
  size: /size/i,
  color: /colou?r/i,
};

const toDayRange = (value: string) => value.replace(/days?/i, "").trim();

const toShippingGroup = (group: RawShippingGroup): JetprintShippingGroup => ({
  name: group.countryGroupName.trim(),
  countries: group.countryItems.map((country) =>
    country.countryCode.trim().toUpperCase(),
  ),
  deliveryDays: toDayRange(group.deliveryTime),
  bands: group.priceItems
    .filter((item) => item.weightMax > EMPTY_BAND_MAX_KG)
    .map((item) => ({
      minKg: item.weightMin,
      maxKg: item.weightMax,
      perKg: item.pricePerKilo,
      fee: item.registrationFee,
    }))
    .sort((left, right) => left.minKg - right.minKg),
});

const findVariantAxis = (optionName: string) =>
  (Object.keys(AXIS_PATTERNS) as VariantAxis[]).find((axis) =>
    AXIS_PATTERNS[axis].test(optionName),
  );

const toVariantAxis = (optionName: string) => {
  const axis = findVariantAxis(optionName);

  if (!axis) {
    throw new JetprintBlankParseError(
      `Unsupported variant option "${optionName}": the store only sells sizes and colors`,
    );
  }

  return axis;
};

const collectLeaves = (
  nodes: RawSkuTreeNode[],
  path: VariantLeaf["path"] = [],
): VariantLeaf[] =>
  nodes.flatMap((node) => {
    const nextPath = [
      ...path,
      { axis: toVariantAxis(node.optionName), value: node.optionValue.trim() },
    ];

    return node.children?.length
      ? collectLeaves(node.children, nextPath)
      : (node.variantIds ?? []).map((id) => ({ id, path: nextPath }));
  });

const readOptionColor = (option: string | undefined) => {
  try {
    const { color } = JSON.parse(option ?? "{}") as { color?: unknown };

    return typeof color === "string" && color.trim() ? color.trim() : undefined;
  } catch {
    return undefined;
  }
};

const collectColorHexes = (maps: RawSkuMap[]) =>
  new Map(
    maps
      .filter((map) => findVariantAxis(map.name) === "color")
      .flatMap((map) =>
        map.items.flatMap((item) => {
          const hex = readOptionColor(item.option);

          return hex ? [[item.name.trim(), hex] as const] : [];
        }),
      ),
  );

export const toJetprintBlankVariants = (
  raw: RawJetprintBlank,
): JetprintBlankVariant[] => {
  const leaves = collectLeaves(raw.skuTrees ?? []);

  if (leaves.length === 0) {
    return raw.skuInfos.map((sku) => ({ sku: sku.skuName }));
  }

  const skuById = new Map(raw.skuInfos.map((sku) => [sku.id, sku.skuName]));
  const distinctValues: Record<VariantAxis, Set<string>> = {
    size: new Set(),
    color: new Set(),
  };

  leaves.forEach(({ path }) =>
    path.forEach(({ axis, value }) => distinctValues[axis].add(value)),
  );

  const colorHexes = collectColorHexes(raw.skuMaps ?? []);
  const variants = new Map<string, JetprintBlankVariant>();

  for (const { id, path } of leaves) {
    const sku = skuById.get(id);

    if (!sku) {
      throw new JetprintBlankParseError(
        `Variant ${id} from skuTrees has no SKU in skuInfos`,
      );
    }

    const chosen = path.filter(({ axis }) => distinctValues[axis].size > 1);
    const size = chosen.find(({ axis }) => axis === "size")?.value;
    const color = chosen.find(({ axis }) => axis === "color")?.value;
    const colorHex = color ? colorHexes.get(color) : undefined;

    variants.set(sku, {
      sku,
      ...(size ? { size } : {}),
      ...(color ? { color } : {}),
      ...(colorHex ? { colorHex } : {}),
    });
  }

  const missing = raw.skuInfos.filter((sku) => !variants.has(sku.skuName));

  if (missing.length > 0) {
    throw new JetprintBlankParseError(
      `SKUs missing from skuTrees: ${missing.map((sku) => sku.skuName).join(", ")}`,
    );
  }

  return [...variants.values()];
};

export const toJetprintBlank = (
  raw: RawJetprintBlank,
  importedAt: string,
): JetprintBlank => {
  const standard = raw.logisticsMethodInfos?.find(
    (method) => method.name === STANDARD_SHIPPING,
  );

  if (!raw.skuInfos?.length || !standard) {
    throw new JetprintBlankParseError(
      "The file has no SKUs or no Standard Shipping rates. Copy the response while signed in to the JetPrint dashboard.",
    );
  }

  return {
    name: raw.blankProductInfo.model,
    productionDays: toDayRange(raw.blankProductInfo.productionTime),
    skus: Object.fromEntries(
      raw.skuInfos.map((sku) => [sku.skuName, { weightGrams: sku.weight }]),
    ),
    variants: toJetprintBlankVariants(raw),
    standardShipping: standard.items.map(toShippingGroup),
    importedAt,
  };
};
