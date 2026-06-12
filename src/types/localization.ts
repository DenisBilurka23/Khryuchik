import type { CurrencyCode } from "@/utils";

// Admin-managed product language. Drives the optional translation sections in
// the product form and which languages a product can be published in. The
// `code` aligns with UI locale codes (e.g. "ru", "en") so a language that also
// ships a UI dictionary is rendered with its own copy; languages without a
// shipped dictionary fall back to English at the UI layer. The display name is
// derived from `code` via `Intl.DisplayNames`, localized to the current UI
// locale — it is not stored.
export type LocaleDocument = {
  code: string;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
};

// Admin-managed sales region. Drives per-region pricing in the product form
// and the storefront country selector.
export type RegionDocument = {
  code: string;
  currency: CurrencyCode;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
};
