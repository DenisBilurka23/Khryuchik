import type { AdminJetprintVariantRow } from "../types";

export type AdminJetprintVariantTableRowProps = {
  row: AdminJetprintVariantRow;
  onChangeAction: (
    patch: Partial<Pick<AdminJetprintVariantRow, "sku" | "size" | "color">>,
  ) => void;
  onRemoveAction: () => void;
};
