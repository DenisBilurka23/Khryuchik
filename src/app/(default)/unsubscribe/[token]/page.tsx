import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { UnsubscribePageView } from "@/components/unsubscribe-page-view";
import { defaultLocale } from "@/i18n/config";

type UnsubscribePageProps = {
  params: Promise<{ token: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront.unsubscribePage",
  });

  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
};

const DefaultUnsubscribePage = async ({ params }: UnsubscribePageProps) => {
  const { token } = await params;

  return <UnsubscribePageView locale={defaultLocale} token={token} />;
};

export default DefaultUnsubscribePage;
