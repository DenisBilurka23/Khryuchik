import type { AdminJetprintVariantRow } from "../types";

export type AdminJetprintVariantTableRowProps = {
  row: AdminJetprintVariantRow;
  isSelected: boolean;
  onToggleAction: () => void;
};
