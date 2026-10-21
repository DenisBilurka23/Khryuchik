import type { Locale } from "@/i18n/config";
import type { ProductJetprintLink } from "@/types/catalog";

export type AdminProductJetprintSectionProps = {
  locale: Locale;
  productId?: string;
  link?: ProductJetprintLink;
  isEnabled: boolean;
  onEnabledChangeAction: (isEnabled: boolean) => void;
};
