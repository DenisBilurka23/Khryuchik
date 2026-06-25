import { CheckoutResultView } from "@/components/checkout-result-view";
import { defaultLocale } from "@/i18n/config";
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

  return (
    <CheckoutResultView
      locale={defaultLocale}
      kind="success"
      orderId={order?.id}
    />
  );
};

export default CheckoutSuccessPage;
