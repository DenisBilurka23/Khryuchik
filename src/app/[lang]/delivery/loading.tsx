import { DeliveryPageSkeleton } from "@/components/delivery-page-view";
import { resolveLocale } from "@/server/i18n/request-locale";
import { getRequestRegion } from "@/server/region/request-region";

const Loading = async () => {
  const [locale, region] = await Promise.all([
    resolveLocale("storefront"),
    getRequestRegion(),
  ]);

  return <DeliveryPageSkeleton locale={locale} region={region} />;
};

export default Loading;
