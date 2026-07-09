import { getTranslations } from "next-intl/server";

import type { StorefrontDictionary } from "@/i18n/types";

import { LegalPageShared } from "../legal-page-shared";
import type { TermsPageViewProps } from "./types";

export const TermsPageView = async ({ locale }: TermsPageViewProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.termsPage",
  });
  const sections = t.raw(
    "sections",
  ) as StorefrontDictionary["termsPage"]["sections"];

  return (
    <LegalPageShared
      eyebrow={t("eyebrow")}
      title={t("title")}
      updatedLabel={t("updatedLabel")}
      updatedDate={t("updatedDate")}
      intro={t("intro")}
      sections={sections}
    />
  );
};

export type { TermsPageViewProps } from "./types";
