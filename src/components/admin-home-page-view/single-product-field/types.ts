import type { Locale } from "@/i18n/config";
import type { AdminProductOption } from "@/types/admin";

export type AdminSingleProductFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  helperText: string;
  locale: Locale;
  initialOption?: AdminProductOption;
  initialOptions: AdminProductOption[];
};
