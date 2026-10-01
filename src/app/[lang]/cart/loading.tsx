import { CartPageSkeleton } from "@/components/cart-page-view";
import { resolveLocale } from "@/server/i18n/request-locale";

const Loading = async () => {
  const locale = await resolveLocale("storefront");

  return <CartPageSkeleton locale={locale} />;
};

export default Loading;
