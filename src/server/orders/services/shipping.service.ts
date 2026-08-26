import "server-only";

import { getUsdRate } from "@/server/localization/exchange-rates.service";
import { getRegionCurrency } from "@/server/localization/localization.service";
import {
  getPrintifyShippingQuote,
  type ShippingQuoteAddress,
} from "@/server/printify/services/printify-shipping.service";
import {
  buildShipmentGroups,
  type ShipmentGroupItem,
} from "@/server/shipping/services/shipment-groups.service";
import { quoteShipment } from "@/server/shipping/services/shipping-quote.service";
import type { CartSelections } from "@/types/cart";
import type {
  ShippingFulfillmentGroup,
  ShippingOption,
  ShippingQuote,
  ShippingQuoteGroup,
} from "@/types/shipping";
import type { CountryCode, CurrencyCode } from "@/utils";
import { convertShippingAmount } from "@/utils";

const PRINTIFY_QUOTE_CURRENCY: CurrencyCode = "USD";

export type OrderShippingItem = ShipmentGroupItem & {
  selections?: CartSelections;
};

export type OrderShippingGroup = ShippingFulfillmentGroup;

export const toShippingQuoteGroups = (
  groups: OrderShippingGroup[],
): ShippingQuoteGroup[] =>
  groups.map(({ id, source, options, selectedOptionId, amount }) => ({
    id,
    source,
    options,
    selectedOptionId,
    amount,
  }));

export type OrderShippingInput = {
  country: CountryCode;
  items: OrderShippingItem[];
  subtotal: number;
  address?: ShippingQuoteAddress;
  selectedOptionIds?: Record<string, string>;
};

export type OrderShippingResult =
  | {
      status: "ok";
      currency: CurrencyCode;
      groups: OrderShippingGroup[];
      shipping: number;
    }
  | { status: "unsupported-destination" }
  | { status: "unsupported-variant" }
  | { status: "unsupported-parcel" }
  | { status: "missing-shipping-data" }
  | { status: "unavailable" };

const toPrintifyOption = async (
  amountCents: number,
  currency: CurrencyCode,
): Promise<ShippingOption | null> => {
  const amountUsd = amountCents / 100;

  if (currency === PRINTIFY_QUOTE_CURRENCY) {
    return buildPrintifyOption(amountUsd, currency);
  }

  const toUsdRate = await getUsdRate(currency);

  if (toUsdRate === null) {
    return null;
  }

  return buildPrintifyOption(
    convertShippingAmount({
      amount: amountUsd,
      fromCurrency: PRINTIFY_QUOTE_CURRENCY,
      toCurrency: currency,
      fromUsdRate: 1,
      toUsdRate,
    }),
    currency,
  );
};

const buildPrintifyOption = (
  amount: number,
  currency: CurrencyCode,
): ShippingOption => ({
  id: "printify:standard",
  provider: "printify",
  service: "standard",
  amount,
  currency,
  hasTracking: true,
  deliveryType: "address",
});

const pickOption = (
  options: ShippingOption[],
  selectedOptionId: string | undefined,
) =>
  options.find((option) => option.id === selectedOptionId) ??
  options[0] ??
  null;

export const calculateOrderShipping = async ({
  country,
  items,
  subtotal,
  address,
  selectedOptionIds,
}: OrderShippingInput): Promise<OrderShippingResult> => {
  const currency = await getRegionCurrency(country);

  if (subtotal === 0) {
    return { status: "ok", currency, groups: [], shipping: 0 };
  }

  const destinationCountry = address?.country ?? country;
  const grouping = await buildShipmentGroups(
    items.map((item) => ({ ...item, language: item.selections?.language })),
    destinationCountry,
    currency,
  );

  if (grouping.status === "missing-shipping-data") {
    console.error(
      `Cannot quote shipping: no weight or dimensions on ${grouping.productIds.join(", ")}`,
    );

    return { status: "missing-shipping-data" };
  }

  const itemById = new Map(items.map((item) => [item.id, item]));
  const groups: OrderShippingGroup[] = [];

  for (const group of grouping.groups) {
    if (group.source === "digital") {
      groups.push({
        id: group.id,
        source: "digital",
        options: [],
        selectedOptionId: null,
        amount: 0,
      });
      continue;
    }

    let quote: ShippingQuote;

    if (group.source === "printify") {
      const printifyQuote = await getPrintifyShippingQuote(
        group.itemIds.flatMap((itemId) => {
          const item = itemById.get(itemId);

          return item ? [item] : [];
        }),
        { ...address, country: destinationCountry },
      );

      if (printifyQuote.status === "unsupported-variant") {
        return { status: "unsupported-variant" };
      }

      if (printifyQuote.status === "unsupported-destination") {
        return { status: "unsupported-destination" };
      }

      if (printifyQuote.status === "unavailable") {
        return { status: "unavailable" };
      }

      // `no-merch` cannot happen: the group exists because an item matched.
      const option =
        printifyQuote.status === "quoted"
          ? await toPrintifyOption(printifyQuote.amountCents, currency)
          : null;

      quote = option
        ? { status: "quoted", options: [option] }
        : { status: "unavailable" };
    } else {
      quote = await quoteShipment({
        hubs: group.hubs,
        parcel: group.parcel!,
        destination: { ...address, country: destinationCountry },
        currency,
      });
    }

    if (quote.status !== "quoted") {
      return { status: quote.status };
    }

    const selected = pickOption(quote.options, selectedOptionIds?.[group.id]);

    if (!selected) {
      return { status: "unavailable" };
    }

    groups.push({
      id: group.id,
      source: group.source,
      options: quote.options,
      selectedOptionId: selected.id,
      amount: selected.amount,
      parcel: group.parcel,
    });
  }

  return {
    status: "ok",
    currency,
    groups,
    shipping: groups.reduce((sum, group) => sum + group.amount, 0),
  };
};
