import type {
  ProductOption,
  ProductOptionPriceDelta,
} from "@/types/product-details";

export type UseProductFormatsArgs = {
  initialFormats: ProductOption[];
  printedLabel: string;
  digitalLabel: string;
};

export type UseProductFormatsResult = {
  options: ProductOption[];
  selectedOptions: ProductOption[];
  isFormatSelected: (value: string) => boolean;
  toggleFormat: (value: string) => void;
  setPriceDelta: (value: string, priceDelta?: ProductOptionPriceDelta) => void;
};
