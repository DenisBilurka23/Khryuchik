import type { AdminProductJetprintSectionProps } from "../types";

export type AdminJetprintSectionFieldsProps = Pick<
  AdminProductJetprintSectionProps,
  "locale" | "productId" | "link"
>;
