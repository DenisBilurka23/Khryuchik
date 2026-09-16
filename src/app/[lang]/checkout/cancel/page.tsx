
import { CheckoutResultView } from "@/components/checkout-result-view";
import { locales } from "@/i18n/config";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";

type LocalizedCheckoutCancelPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

const LocalizedCheckoutCancelPage = async ({
  params,
}: LocalizedCheckoutCancelPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  return <CheckoutResultView locale={lang} kind="cancel" />;
};

export default LocalizedCheckoutCancelPage;
