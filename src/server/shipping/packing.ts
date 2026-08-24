import { SHIPPING_BOX_PRESETS } from "@/constants/shipping";
import type { ShippingParcel, ShippingParcelItem } from "@/types/shipping";
import type { CurrencyCode } from "@/utils";

export const buildParcel = ({
  units,
  contentWeightGrams,
  value,
  contents,
}: {
  units: number;
  contentWeightGrams: number;
  value: { amount: number; currency: CurrencyCode };
  contents: ShippingParcelItem[];
}): ShippingParcel => {
  const box =
    SHIPPING_BOX_PRESETS.find((preset) => units <= preset.maxBooks) ??
    SHIPPING_BOX_PRESETS[SHIPPING_BOX_PRESETS.length - 1];

  return {
    weightGrams: contentWeightGrams + box.tareGrams,
    lengthMm: box.lengthMm,
    widthMm: box.widthMm,
    heightMm: box.heightMm,
    valueAmount: value.amount,
    valueCurrency: value.currency,
    contents,
  };
};
