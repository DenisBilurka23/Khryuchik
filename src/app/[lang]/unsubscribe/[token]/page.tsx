import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { UnsubscribePageView } from "@/components/unsubscribe-page-view";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";

type LocalizedUnsubscribePageProps = {
  params: Promise<{ lang: string; token: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedUnsubscribePageProps): Promise<Metadata> => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const t = await getTranslations({
    locale: lang,
    namespace: "storefront.unsubscribePage",
  });

  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
};

const LocalizedUnsubscribePage = async ({
  params,
}: LocalizedUnsubscribePageProps) => {
  const { lang, token } = await params;

  await requireActiveLocale(lang);

  return <UnsubscribePageView locale={lang} token={token} />;
};

export default LocalizedUnsubscribePage;
