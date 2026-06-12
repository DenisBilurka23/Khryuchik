import type { PaymentMethod } from "@/utils";

import type { CheckoutLabels } from "../../types";

export type PaymentSectionProps = {
  availableMethods: PaymentMethod[];
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  labels: CheckoutLabels;
};
