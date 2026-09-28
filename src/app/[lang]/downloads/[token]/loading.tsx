import { getTranslations } from "next-intl/server";

import { NoticePageLoading } from "@/components/notice-page-loading";
import { resolveLocale } from "@/server/i18n/request-locale";

const Loading = async () => {
  const locale = await resolveLocale("storefront");
  const t = await getTranslations({
    locale,
    namespace: "downloadsPage.loading",
  });

  return <NoticePageLoading title={t("title")} text={t("text")} />;
};

export default Loading;
