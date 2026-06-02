import { CheckoutResultView } from "@/components/checkout-result-view";
import { defaultLocale } from "@/i18n/config";
import { findOrderById } from "@/server/orders/repositories/orders.repository";

type CheckoutConfirmationPageProps = {
  searchParams: Promise<{ order_id?: string }>;
};

const CheckoutConfirmationPage = async ({
  searchParams,
}: CheckoutConfirmationPageProps) => {
  const { order_id } = await searchParams;
  const order = order_id ? await findOrderById(order_id) : null;

  return (
    <CheckoutResultView
      locale={defaultLocale}
      kind="confirmation"
      orderId={order?.id}
      paymentMethod={order?.payment.method}
    />
  );
};

export default CheckoutConfirmationPage;
