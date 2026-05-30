import type { DeliveryPageLabels } from "@/i18n/types";

export type DeliveryCtaSectionProps = DeliveryPageLabels["finalCta"] & {
  shopHref: string;
  accent: string;
};
