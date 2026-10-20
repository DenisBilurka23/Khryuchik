import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { format } from "prettier";

import type {
  JetprintBlankCatalog,
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

type RawBlank = {
  id: number;
  blankProductInfo: { model: string; productionTime: string };
  skuInfos: { skuName: string; weight: number }[];
  logisticsMethodInfos: RawLogisticsMethod[];
};

const CATALOG_PATH = resolve("src/data/jetprint-blanks.json");
const STANDARD_SHIPPING = "Standard Shipping";
const EMPTY_BAND_MAX_KG = 0.01;

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

const main = async () => {
  const [inputPath] = process.argv.slice(2);

  if (!inputPath) {
    throw new Error(
      "Usage: npm run jetprint:blank -- <saved blankProduct/detail response.json>",
    );
  }

  const parsed = JSON.parse(readFileSync(resolve(inputPath), "utf8"));
  const raw: RawBlank = parsed.data ?? parsed;
  const standard = raw.logisticsMethodInfos?.find(
    (method) => method.name === STANDARD_SHIPPING,
  );

  if (!raw.skuInfos?.length || !standard) {
    throw new Error(
      "The file has no SKUs or no Standard Shipping rates. Copy the response while signed in to the JetPrint dashboard.",
    );
  }

  const catalog: JetprintBlankCatalog = existsSync(CATALOG_PATH)
    ? JSON.parse(readFileSync(CATALOG_PATH, "utf8"))
    : {};

  catalog[String(raw.id)] = {
    name: raw.blankProductInfo.model,
    productionDays: toDayRange(raw.blankProductInfo.productionTime),
    skus: Object.fromEntries(
      raw.skuInfos.map((sku) => [sku.skuName, { weightGrams: sku.weight }]),
    ),
    standardShipping: standard.items.map(toShippingGroup),
    importedAt: new Date().toISOString().slice(0, 10),
  };

  writeFileSync(
    CATALOG_PATH,
    await format(JSON.stringify(catalog), { filepath: CATALOG_PATH }),
  );

  console.log(
    `Imported blank ${raw.id} (${raw.blankProductInfo.model}): ${raw.skuInfos.length} SKU(s), ${standard.items.length} shipping group(s)`,
  );
};

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
