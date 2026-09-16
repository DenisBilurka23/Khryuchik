
import { CheckoutResultView } from "@/components/checkout-result-view";
import { locales } from "@/i18n/config";
import { buildOrderDownloadsHref } from "@/server/downloads/order-downloads.service";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import { confirmOrderFromStripeSession } from "@/server/orders/services/orders.service";

type LocalizedCheckoutSuccessPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

const LocalizedCheckoutSuccessPage = async ({
  params,
  searchParams,
}: LocalizedCheckoutSuccessPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const { session_id } = await searchParams;
  const order = session_id
    ? await confirmOrderFromStripeSession(session_id)
    : null;
  const downloadsHref = await buildOrderDownloadsHref(order, lang);

  return (
    <CheckoutResultView
      locale={lang}
      kind="success"
      orderId={order?.id}
      downloadsHref={downloadsHref ?? undefined}
    />
  );
};

export default LocalizedCheckoutSuccessPage;
