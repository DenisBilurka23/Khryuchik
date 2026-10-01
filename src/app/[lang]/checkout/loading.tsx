import { CheckoutPageSkeleton } from "@/components/checkout-page-view";
import { resolveLocale } from "@/server/i18n/request-locale";

const Loading = async () => {
  const locale = await resolveLocale("storefront");

  return <CheckoutPageSkeleton locale={locale} />;
};

export default Loading;
