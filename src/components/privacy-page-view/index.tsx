import { getTranslations } from "next-intl/server";

import type { StorefrontDictionary } from "@/i18n/types";

import { LegalPageShared } from "../legal-page-shared";
import type { PrivacyPageViewProps } from "./types";

export const PrivacyPageView = async ({ locale }: PrivacyPageViewProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.privacyPage",
  });
  const sections = t.raw(
    "sections",
  ) as StorefrontDictionary["privacyPage"]["sections"];

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

export type { PrivacyPageViewProps } from "./types";
