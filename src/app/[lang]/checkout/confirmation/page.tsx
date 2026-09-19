import { CheckoutResultView } from "@/components/checkout-result-view";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import { findOrderById } from "@/server/orders/repositories/orders.repository";

type LocalizedCheckoutConfirmationPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ order_id?: string }>;
};

const LocalizedCheckoutConfirmationPage = async ({
  params,
  searchParams,
}: LocalizedCheckoutConfirmationPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const { order_id } = await searchParams;
  const order = order_id ? await findOrderById(order_id) : null;

  return (
    <CheckoutResultView
      locale={lang}
      kind="confirmation"
      orderId={order?.id}
      paymentMethod={order?.payment.method}
    />
  );
};

export default LocalizedCheckoutConfirmationPage;
