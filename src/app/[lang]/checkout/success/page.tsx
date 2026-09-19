import { CheckoutResultView } from "@/components/checkout-result-view";
import { buildOrderDownloadsHref } from "@/server/downloads/order-downloads.service";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import { confirmOrderFromStripeSession } from "@/server/orders/services/orders.service";

type LocalizedCheckoutSuccessPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

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
      isDigitalOnly={order?.fulfillmentType === "digital"}
      downloadsHref={downloadsHref ?? undefined}
    />
  );
};

export default LocalizedCheckoutSuccessPage;
