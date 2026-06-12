import { notFound } from "next/navigation";

import { CheckoutResultView } from "@/components/checkout-result-view";
import { locales } from "@/i18n/config";
import { isActiveLocale } from "@/server/localization/localization.service";
import { findOrderByStripeSessionId } from "@/server/orders/repositories/orders.repository";

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

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const { session_id } = await searchParams;
  const order = session_id
    ? await findOrderByStripeSessionId(session_id)
    : null;

  return (
    <CheckoutResultView locale={lang} kind="success" orderId={order?.id} />
  );
};

export default LocalizedCheckoutSuccessPage;
