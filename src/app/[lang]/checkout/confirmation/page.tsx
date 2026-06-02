import { notFound } from "next/navigation";

import { CheckoutResultView } from "@/components/checkout-result-view";
import { isLocale, locales } from "@/i18n/config";
import { findOrderById } from "@/server/orders/repositories/orders.repository";

type LocalizedCheckoutConfirmationPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ order_id?: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

const LocalizedCheckoutConfirmationPage = async ({
  params,
  searchParams,
}: LocalizedCheckoutConfirmationPageProps) => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

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
