import type { CartSelections } from "@/types/cart";
import type {
  ProductDetails,
  ProductVariantValueState,
} from "@/types/product-details";

export type ProductSelectionKey = keyof CartSelections;

export type ProductSelectionState = Record<ProductSelectionKey, string>;

export type ProductSelectionIssue =
  | "soldOutProduct"
  | "soldOutSelection"
  | "unavailableSelection"
  | "printedUnavailableInRegion";

export type UseProductPriceParams = {
  product: ProductDetails;
};

export type UseProductPriceResult = {
  selections: ProductSelectionState;
  cartSelections: CartSelections;
  selectOption: (key: ProductSelectionKey, value: string) => void;
  getOptionState: (
    key: ProductSelectionKey,
    value: string,
  ) => ProductVariantValueState;
  selectionIssue: ProductSelectionIssue | null;
  price: number;
  oldPrice: number | undefined;
};
