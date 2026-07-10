import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { UnsubscribePageView } from "@/components/unsubscribe-page-view";
import { isActiveLocale } from "@/server/localization/localization.service";

type LocalizedUnsubscribePageProps = {
  params: Promise<{ lang: string; token: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedUnsubscribePageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

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

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  return <UnsubscribePageView locale={lang} token={token} />;
};

export default LocalizedUnsubscribePage;
