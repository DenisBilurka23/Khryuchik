import type { Metadata } from "next";
import { CheckoutResultView } from "@/components/checkout-result-view";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import { NOINDEX_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = { robots: NOINDEX_ROBOTS };

type LocalizedCheckoutCancelPageProps = {
  params: Promise<{ lang: string }>;
};

const LocalizedCheckoutCancelPage = async ({
  params,
}: LocalizedCheckoutCancelPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  return <CheckoutResultView locale={lang} kind="cancel" />;
};

export default LocalizedCheckoutCancelPage;
