import type { Locale } from "@/i18n/config";
import type { ShippingParcel } from "@/types/shipping";

export type AdminOrderCustomsButtonProps = {
  locale: Locale;
  parcel: ShippingParcel;
};
