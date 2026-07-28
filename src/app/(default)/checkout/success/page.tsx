import { CheckoutResultView } from "@/components/checkout-result-view";
import { defaultLocale } from "@/i18n/config";
import { buildOrderDownloadsHref } from "@/server/downloads/order-downloads.service";
import { confirmOrderFromStripeSession } from "@/server/orders/services/orders.service";

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

const CheckoutSuccessPage = async ({
  searchParams,
}: CheckoutSuccessPageProps) => {
  const { session_id } = await searchParams;
  const order = session_id
    ? await confirmOrderFromStripeSession(session_id)
    : null;
  const downloadsHref = await buildOrderDownloadsHref(order, defaultLocale);

  return (
    <CheckoutResultView
      locale={defaultLocale}
      kind="success"
      orderId={order?.id}
      downloadsHref={downloadsHref ?? undefined}
    />
  );
};

export default CheckoutSuccessPage;
