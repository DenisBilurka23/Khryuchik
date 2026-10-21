import type { AdminJetprintVariantRow } from "../types";

export type AdminJetprintVariantStatusProps = {
  row: Pick<AdminJetprintVariantRow, "isAvailable" | "checkedAt">;
};
