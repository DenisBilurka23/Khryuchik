import type { CartSelections } from "@/types/cart";
import type { ProductDetails } from "@/types/product-details";
import type { CountryCode } from "@/utils";

export type ProductSelectionKey = keyof CartSelections;

export type ProductSelectionState = Record<ProductSelectionKey, string>;

export type UseProductPriceParams = {
  product: ProductDetails;
  country: CountryCode;
};

export type UseProductPriceResult = {
  selections: ProductSelectionState;
  cartSelections: CartSelections;
  selectOption: (key: ProductSelectionKey, value: string) => void;
  price: number;
};
