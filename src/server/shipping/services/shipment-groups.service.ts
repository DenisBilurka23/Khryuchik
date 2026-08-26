import "server-only";

import { findProductsByIds } from "@/server/catalog/repositories/products.repository";
import type { CountryCode, CurrencyCode } from "@/utils";
import type {
  ShippingHubCode,
  ShippingParcel,
  ShippingParcelItem,
} from "@/types/shipping";

import { buildParcel } from "../packing";
import { getShippingManufacturer } from "./shipping-settings.service";
import { chooseHubs } from "../utils";

export type ShipmentGroupItem = {
  id: string;
  productId: string;
  quantity: number;
  isDigital: boolean;
  unitPrice: number;
  language?: string;
};

export type ResolvedShipmentGroup = {
  id: string;
  source: "digital" | "printify" | "manual";
  hubs: ShippingHubCode[];
  itemIds: string[];
  parcel?: ShippingParcel;
};

export type ShipmentGroupsResult =
  | { status: "ok"; groups: ResolvedShipmentGroup[] }
  | { status: "missing-shipping-data"; productIds: string[] };

export const buildShipmentGroups = async (
  items: ShipmentGroupItem[],
  destinationCountry: CountryCode,
  currency: CurrencyCode,
): Promise<ShipmentGroupsResult> => {
  const [products, manufacturer] = await Promise.all([
    findProductsByIds(Array.from(new Set(items.map((item) => item.productId)))),
    getShippingManufacturer(),
  ]);
  const productById = new Map(
    products.map((product) => [product.productId, product]),
  );

  const digitalItemIds: string[] = [];
  const printifyItemIds: string[] = [];
  const manualByHub = new Map<
    string,
    {
      hubs: ShippingHubCode[];
      itemIds: string[];
      units: number;
      weightGrams: number;
      value: number;
      contents: ShippingParcelItem[];
    }
  >();
  const missingShippingData: string[] = [];

  for (const item of items) {
    const product = productById.get(item.productId);

    if (item.isDigital) {
      digitalItemIds.push(item.id);
      continue;
    }

    if (product?.printify) {
      printifyItemIds.push(item.id);
      continue;
    }

    const shipping = product?.shipping;

    if (!shipping) {
      missingShippingData.push(item.productId);
      continue;
    }

    const stocked = item.language
      ? shipping.stockByLanguage?.[item.language]
      : undefined;
    const hubs = chooseHubs(
      destinationCountry,
      stocked?.length ? stocked : shipping.hubs,
    );
    const key = hubs.join("-");
    const group = manualByHub.get(key) ?? {
      hubs,
      itemIds: [],
      units: 0,
      weightGrams: 0,
      value: 0,
      contents: [],
    };

    group.itemIds.push(item.id);
    group.units += item.quantity;
    group.weightGrams += shipping.weightGrams * item.quantity;
    group.value += item.unitPrice * item.quantity;
    group.contents.push({
      quantity: item.quantity,
      valueAmount: item.unitPrice * item.quantity,
      hsCode: shipping.hsCode,
      originCountry: manufacturer?.country,
      manufacturer,
    });
    manualByHub.set(key, group);
  }

  if (missingShippingData.length > 0) {
    return {
      status: "missing-shipping-data",
      productIds: Array.from(new Set(missingShippingData)),
    };
  }

  const groups: ResolvedShipmentGroup[] = [];

  if (digitalItemIds.length > 0) {
    groups.push({
      id: "digital",
      source: "digital",
      hubs: [],
      itemIds: digitalItemIds,
    });
  }

  if (printifyItemIds.length > 0) {
    groups.push({
      id: "printify",
      source: "printify",
      hubs: [],
      itemIds: printifyItemIds,
    });
  }

  for (const [key, group] of manualByHub) {
    groups.push({
      id: `manual:${key}`,
      source: "manual",
      hubs: group.hubs,
      itemIds: group.itemIds,
      parcel: buildParcel({
        units: group.units,
        contentWeightGrams: group.weightGrams,
        value: { amount: group.value, currency },
        contents: group.contents,
      }),
    });
  }

  return { status: "ok", groups };
};
