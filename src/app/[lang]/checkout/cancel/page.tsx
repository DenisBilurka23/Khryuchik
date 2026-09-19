import { CheckoutResultView } from "@/components/checkout-result-view";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";

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
