import type {
  DELIVERY_METHOD_ICONS,
  DELIVERY_RETURNS_ICONS,
} from "@/constants/delivery";
import type { EntertainmentCategoryKey } from "@/types/entertainment";
import type { OrderFulfillmentSource } from "@/types/order";
import type { CountryCode } from "@/utils/country";

import type enMessages from "./messages/en.json";

type Messages = typeof enMessages;

type RawStorefront = Messages["storefront"];
type RawDeliveryPage = RawStorefront["deliveryPage"];
type RawAccountPage = Messages["accountPage"];
type RawAdminPage = Messages["adminPage"];

export type CountLabelForms = RawStorefront["favoritesPage"]["itemCount"];

export type ProductPageLabels = RawStorefront["productPage"];

export type CartPageLabels = RawStorefront["cartPage"];

export type CheckoutPageLabels = RawStorefront["checkoutPage"];

export type CheckoutResultLabels = RawStorefront["checkoutResult"];

export type StoryPageLabels = RawStorefront["storyPage"];

export type LegalPageLabels = RawStorefront["termsPage"];

export type ContactPageLabels = RawStorefront["contactPage"];

export type DeliveryRegionOptionLabels =
  RawDeliveryPage["hero"]["options"]["BY"];

export type DeliveryReceiptCardLabels = {
  type: string;
  num: string;
  rows: Array<{ label: string; value: string }>;
  totalLabel: string;
  totalValue: string;
  stamp: {
    line1: string;
    line2: string;
  };
};

export type DeliveryStripeCardLabels = RawDeliveryPage["payment"]["stripe"];

export type DeliveryMethodIcon = (typeof DELIVERY_METHOD_ICONS)[number];

export type DeliveryReturnsIcon = (typeof DELIVERY_RETURNS_ICONS)[number];

export type DeliveryPageLabels = Omit<RawDeliveryPage, "hero" | "payment"> & {
  hero: Omit<RawDeliveryPage["hero"], "options"> & {
    options: Record<CountryCode, DeliveryRegionOptionLabels>;
  };
  payment: RawDeliveryPage["payment"] & {
    receipt?: DeliveryReceiptCardLabels;
  };
};

export type StorefrontFooterSection =
  RawStorefront["footer"]["sections"][number];

export type StorefrontDictionary = Omit<
  RawStorefront,
  "entertainmentCategories" | "deliveryPage"
> & {
  entertainmentCategories: Record<EntertainmentCategoryKey, string>;
  deliveryPage: DeliveryPageLabels;
};

export type AccountPageDictionary = Omit<RawAccountPage, "orderParcels"> & {
  orderParcels: Record<OrderFulfillmentSource, string>;
};

export type AdminPageDictionary = Omit<RawAdminPage, "orders"> & {
  orders: Omit<RawAdminPage["orders"], "parcels"> & {
    parcels: Record<OrderFulfillmentSource, string>;
  };
};

export type Dictionary = Omit<
  Messages,
  "storefront" | "accountPage" | "adminPage"
> & {
  storefront: StorefrontDictionary;
  accountPage: AccountPageDictionary;
  adminPage: AdminPageDictionary;
};
