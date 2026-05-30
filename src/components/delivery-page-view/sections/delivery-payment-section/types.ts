import type { DeliveryPageLabels } from "@/i18n/types";

import type { DeliveryPaymentVariant } from "../../region-config";

export type DeliveryPaymentSectionProps = DeliveryPageLabels["payment"] & {
  paymentVariant: DeliveryPaymentVariant;
  accent: string;
};
