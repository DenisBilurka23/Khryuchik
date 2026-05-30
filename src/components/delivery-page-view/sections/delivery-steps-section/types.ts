import type { DeliveryPageLabels } from "@/i18n/types";

export type DeliveryStepsSectionProps = DeliveryPageLabels["steps"] & {
  accent: string;
};
