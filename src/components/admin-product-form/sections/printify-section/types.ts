import type { Locale } from "@/i18n/config";
import type { ProductPrintifyLink } from "@/types/catalog";

export type AdminPrintifyActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type AdminPrintifyAction = (
  productId: string,
) => Promise<AdminPrintifyActionResult>;

export type AdminProductPrintifySectionProps = {
  productId: string;
  locale: Locale;
  link: ProductPrintifyLink;
  syncAction?: AdminPrintifyAction;
  relinkAction?: AdminPrintifyAction;
};
