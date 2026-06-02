import { CheckoutResultView } from "@/components/checkout-result-view";
import { defaultLocale } from "@/i18n/config";
import { findOrderByStripeSessionId } from "@/server/orders/repositories/orders.repository";

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

const CheckoutSuccessPage = async ({
  searchParams,
}: CheckoutSuccessPageProps) => {
  const { session_id } = await searchParams;
  const order = session_id
    ? await findOrderByStripeSessionId(session_id)
    : null;

  return (
    <CheckoutResultView
      locale={defaultLocale}
      kind="success"
      orderId={order?.id}
    />
  );
};

export default CheckoutSuccessPage;
