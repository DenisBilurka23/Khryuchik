import { useTranslations } from "next-intl";

import { AdminStatusChip } from "@/components/admin-page-shared";

import { getJetprintVariantStatus } from "../../utils";
import type { AdminJetprintVariantStatusProps } from "./types";

export const AdminJetprintVariantStatus = ({
  row,
}: AdminJetprintVariantStatusProps) => {
  const tJetprint = useTranslations("adminPage.productForm.jetprint");
  const status = getJetprintVariantStatus(row);

  return (
    <AdminStatusChip
      label={tJetprint(`variantStatus.${status.key}`)}
      tone={status.tone}
    />
  );
};

export type { AdminJetprintVariantStatusProps } from "./types";
