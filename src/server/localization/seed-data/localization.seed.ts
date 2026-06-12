import type { LocaleDocument, RegionDocument } from "@/types/localization";

// Built-in defaults mirror the shipped UI locales and the original hardcoded
// regions. They seed a fresh database and act as the runtime fallback when the
// `locales` / `regions` collections are empty, so existing behaviour is
// preserved before the admin manages the lists.
export const localeSeedDocuments: LocaleDocument[] = [
  {
    code: "en",
    isActive: true,
    isDefault: true,
    sortOrder: 1,
  },
  {
    code: "ru",
    isActive: true,
    isDefault: false,
    sortOrder: 2,
  },
];

export const regionSeedDocuments: RegionDocument[] = [
  {
    code: "US",
    currency: "USD",
    isActive: true,
    isDefault: true,
    sortOrder: 1,
  },
  {
    code: "BY",
    currency: "BYN",
    isActive: true,
    isDefault: false,
    sortOrder: 2,
  },
];
