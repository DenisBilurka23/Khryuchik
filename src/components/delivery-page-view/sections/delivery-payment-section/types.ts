import type { DeliveryPageLabels } from "@/i18n/types";

import type { DeliveryPaymentVariant } from "../../utils";

export type DeliveryPaymentSectionProps = DeliveryPageLabels["payment"] & {
  paymentVariant: DeliveryPaymentVariant;
};
