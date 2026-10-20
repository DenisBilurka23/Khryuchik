import { useTranslations } from "next-intl";

import { AdminStatusChip } from "@/components/admin-page-shared";
import jetprintBlanks from "@/data/jetprint-blanks.json";
import { findJetprintBlankBySku } from "@/utils";

import { getJetprintVariantStatus } from "../../utils";
import type { AdminJetprintVariantStatusProps } from "./types";

export const AdminJetprintVariantStatus = ({
  row,
}: AdminJetprintVariantStatusProps) => {
  const tJetprint = useTranslations("adminPage.productForm.jetprint");
  const status = getJetprintVariantStatus(
    row,
    Boolean(findJetprintBlankBySku(jetprintBlanks, row.sku.trim())),
  );

  return (
    <AdminStatusChip
      label={tJetprint(`variantStatus.${status.key}`)}
      tone={status.tone}
    />
  );
};

export type { AdminJetprintVariantStatusProps } from "./types";
