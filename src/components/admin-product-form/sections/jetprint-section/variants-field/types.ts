import type {
  JetprintBlank,
  JetprintBlankVariant,
  JetprintVariantLink,
} from "@/types/catalog";

export type AdminJetprintVariantRow = JetprintBlankVariant & {
  isAvailable?: boolean;
  checkedAt?: string;
};

export type AdminJetprintVariantsFieldProps = {
  name: string;
  blank: JetprintBlank;
  initialVariants: JetprintVariantLink[];
};

export type AdminJetprintVariantStatusKey =
  | "available"
  | "unavailable"
  | "unchecked";
