import { ShopCatalogSkeleton, ShopPageView } from "@/components/shop-page-view";
import { resolveLocale } from "@/server/i18n/request-locale";

const Loading = async () => {
  const locale = await resolveLocale("storefront");

  return (
    <ShopPageView locale={locale}>
      <ShopCatalogSkeleton />
    </ShopPageView>
  );
};

export default Loading;
