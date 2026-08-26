import type { ShippingManufacturer } from "@/types/shipping";

export type AdminManufacturerFormProps = {
  locale: string;
  manufacturer?: ShippingManufacturer;
  saveAction: (formData: FormData) => Promise<void>;
};
