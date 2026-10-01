import { ProductPageSkeleton } from "@/components/product";
import { resolveLocale } from "@/server/i18n/request-locale";

const Loading = async () => {
  const locale = await resolveLocale("storefront");

  return <ProductPageSkeleton locale={locale} />;
};

export default Loading;
