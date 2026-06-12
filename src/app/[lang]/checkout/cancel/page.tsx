import { notFound } from "next/navigation";

import { CheckoutResultView } from "@/components/checkout-result-view";
import { locales } from "@/i18n/config";
import { isActiveLocale } from "@/server/localization/localization.service";

type LocalizedCheckoutCancelPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

const LocalizedCheckoutCancelPage = async ({
  params,
}: LocalizedCheckoutCancelPageProps) => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  return <CheckoutResultView locale={lang} kind="cancel" />;
};

export default LocalizedCheckoutCancelPage;
