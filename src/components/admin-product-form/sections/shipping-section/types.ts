import type { AdminProductPayload } from "@/types/admin";
import type { ProductPrintedStock, ProductType } from "@/types/catalog";
import type { ProductOption } from "@/types/product-details";
import type { ShippingHubCode } from "@/types/shipping";

import type { AdminLanguagesFieldHub } from "../../languages-field/types";

export type AdminProductShippingSectionProps = {
  payload: AdminProductPayload;
  hubs: AdminLanguagesFieldHub[];
  selectedType: ProductType;
  languages: ProductOption[];
  printedStock: ProductPrintedStock;
  isStocked: (code: string, hub: ShippingHubCode) => boolean;
  onToggleHubAction: (code: string, hub: ShippingHubCode) => void;
};
